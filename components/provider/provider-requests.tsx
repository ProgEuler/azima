"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { QueryState } from "@/components/form-error";
import { ActiveOrderRow } from "@/components/provider/active-order-row";
import { RequestCard } from "@/components/provider/request-card";
import { useApi, useDebounced } from "@/hooks/use-api";
import { ordersApi, type OrderTabId } from "@/lib/api/provider";
import { timelineGroup } from "@/lib/provider-orders";

export function ProviderRequests() {
	const [activeTab, setActiveTab] = useState<OrderTabId>("needs_response");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"soonest" | "newest">("soonest");
	const q = useDebounced(searchQuery.trim());

	const orders = useApi(
		(signal) => ordersApi.list({ tab: activeTab, q, sort: sortBy, page_size: 100 }, signal),
		[activeTab, q, sortBy],
	);
	const list = orders.data?.results ?? [];
	const counts = orders.data?.counts ?? { needs_response: 0, active: 0, completed: 0 };
	const pendingCount = counts.needs_response;
	const activeCount = counts.active;
	const completedCount = counts.completed;

	const thisWeekRequests = list.filter((o) => timelineGroup(o.delivery_date) === "This week");
	const thisMonthRequests = list.filter((o) => timelineGroup(o.delivery_date) === "This month");
	const laterRequests = list.filter((o) => timelineGroup(o.delivery_date) === "Later");

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-16 font-sans">
			{/* Search Bar */}
			<div className="relative">
				<MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#78716C] dark:text-stone-400" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Reference, occasion or host"
					className="w-full h-11 rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/80 pl-11 pr-4 text-sm text-[#1C1917] dark:text-stone-100 placeholder:text-[#A8A29E] focus:outline-hidden focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-700 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] transition-all"
				/>
			</div>

			{/* Tabs bar and Sort */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				{/* Tabs */}
				<div className="flex items-center gap-2 flex-wrap">
					<button
						type="button"
						onClick={() => setActiveTab("needs_response")}
						className={cn(
							"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
							activeTab === "needs_response"
								? "bg-[#8B351F] text-white shadow-xs"
								: "bg-white dark:bg-stone-900 border border-[#EFECE6] dark:border-stone-800 text-[#57524D] dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
						)}
					>
						Needs your response ({pendingCount})
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("active")}
						className={cn(
							"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
							activeTab === "active"
								? "bg-[#8B351F] text-white shadow-xs"
								: "bg-white dark:bg-stone-900 border border-[#EFECE6] dark:border-stone-800 text-[#57524D] dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
						)}
					>
						Active orders ({activeCount})
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("completed")}
						className={cn(
							"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
							activeTab === "completed"
								? "bg-[#8B351F] text-white shadow-xs"
								: "bg-white dark:bg-stone-900 border border-[#EFECE6] dark:border-stone-800 text-[#57524D] dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
						)}
					>
						Completed ({completedCount})
					</button>
				</div>

				{/* Sort control */}
				<div className="flex items-center gap-2 self-end sm:self-auto">
					<span className="text-xs text-[#78716C] dark:text-stone-400 font-medium">
						Sort
					</span>
					<div className="relative">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as "soonest" | "newest")}
							className="appearance-none inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-stone-900 border border-[#EFECE6] dark:border-stone-800 pl-3.5 pr-8 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-700 shadow-2xs"
						>
							<option value="soonest">Date (soonest)</option>
							<option value="newest">Recently received</option>
						</select>
						<CaretDownIcon className="size-3.5 text-[#78716C] dark:text-stone-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
					</div>
				</div>
			</div>

			<QueryState loading={orders.loading && !orders.data} error={orders.error} onRetry={orders.reload} label="Loading requests…" />

			{/* Tab 1: Needs your response */}
			{orders.data && activeTab === "needs_response" && (
				<div className="space-y-7">
					{[
						{ label: "This week", rows: thisWeekRequests },
						{ label: "This month", rows: thisMonthRequests },
						{ label: "Later", rows: laterRequests },
					].map(({ label, rows }) =>
						rows.length > 0 ? (
							<section key={label} className="space-y-3">
								<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
									{label}
								</div>
								<div className="space-y-4">
									{rows.map((order) => (
										<RequestCard key={order.id} order={order} onChanged={orders.reload} />
									))}
								</div>
							</section>
						) : null,
					)}

					{list.length === 0 && (
						<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-10 text-center">
							<p className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
								{q ? "No requests match your search" : "You are all caught up"}
							</p>
							<p className="text-xs text-[#78716C] dark:text-stone-400 mt-1">
								{q
									? "Try searching by occasion name, reference code, or item."
									: "New requests from hosts will appear here."}
							</p>
						</div>
					)}
				</div>
			)}

			{/* Tab 2: Active orders */}
			{orders.data && activeTab === "active" && (
				<div className="space-y-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						In progress & scheduled
					</div>
					{list.length === 0 ? (
						<p className="text-sm text-[#78716C] dark:text-stone-400">
							{q ? "No active orders match your search." : "No active orders right now."}
						</p>
					) : (
						list.map((order) => (
							<ActiveOrderRow key={order.id} order={order} onChanged={orders.reload} />
						))
					)}
				</div>
			)}

			{/* Tab 3: Completed */}
			{orders.data && activeTab === "completed" && (
				<div className="space-y-3">
					{list.length === 0 ? (
						<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-10 text-center">
							<p className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
								{q ? "No completed orders match your search" : "No completed orders yet"}
							</p>
							<p className="text-xs text-[#78716C] dark:text-stone-400 mt-1">
								Fulfilled orders will be archived here once delivered.
							</p>
						</div>
					) : (
						list.map((order) => (
							<ActiveOrderRow key={order.id} order={order} onChanged={orders.reload} />
						))
					)}
				</div>
			)}
		</div>
	);
}
