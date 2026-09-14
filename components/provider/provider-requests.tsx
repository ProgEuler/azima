"use client";

import { useState, useMemo } from "react";
import {
	MagnifyingGlassIcon,
	CaretDownIcon,
	TruckIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { RequestCard } from "./request-card";
import {
	INITIAL_PROVIDER_REQUESTS,
	INITIAL_ACTIVE_ORDERS,
	type ProviderRequest,
} from "./provider-mock-data";

export function ProviderRequests() {
	const [activeTab, setActiveTab] = useState<"needs_response" | "active" | "completed">(
		"needs_response"
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"soonest" | "newest">("soonest");
	const [requests, setRequests] = useState<ProviderRequest[]>(INITIAL_PROVIDER_REQUESTS);
	const [activeOrders, setActiveOrders] = useState(INITIAL_ACTIVE_ORDERS);

	const handleAccept = (id: string) => {
		setRequests((prev) =>
			prev.map((r) => (r.id === id ? { ...r, status: "Accepted" } : r))
		);
	};

	const handleReject = (id: string) => {
		setRequests((prev) =>
			prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
		);
	};

	const handleMarkDelivered = (id: string) => {
		setActiveOrders((prev) =>
			prev.map((o) => (o.id === id ? { ...o, status: "Delivered" } : o))
		);
	};

	// Filtered requests based on search query
	const filteredRequests = useMemo(() => {
		const q = searchQuery.toLowerCase().trim();
		if (!q) return requests;

		return requests.filter(
			(r) =>
				r.title.toLowerCase().includes(q) ||
				r.code.toLowerCase().includes(q) ||
				r.delivery.toLowerCase().includes(q) ||
				r.mealTag.toLowerCase().includes(q) ||
				r.items.some((item) => item.name.toLowerCase().includes(q))
		);
	}, [requests, searchQuery]);

	// Split by timeline group
	const thisWeekRequests = filteredRequests.filter(
		(r) => r.timelineGroup === "This week"
	);
	const thisMonthRequests = filteredRequests.filter(
		(r) => r.timelineGroup === "This month"
	);

	const pendingCount = requests.filter((r) => r.status === "Awaiting response").length;
	const activeCount = activeOrders.length;
	const completedCount = 0;

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

			{/* Tab 1: Needs your response */}
			{activeTab === "needs_response" && (
				<div className="space-y-7">
					{/* This week section */}
					{thisWeekRequests.length > 0 && (
						<section className="space-y-3">
							<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
								This week
							</div>
							<div className="space-y-4">
								{thisWeekRequests.map((req) => (
									<RequestCard
										key={req.id}
										request={req}
										onAccept={handleAccept}
										onReject={handleReject}
									/>
								))}
							</div>
						</section>
					)}

					{/* This month section */}
					{thisMonthRequests.length > 0 && (
						<section className="space-y-3">
							<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
								This month
							</div>
							<div className="space-y-4">
								{thisMonthRequests.map((req) => (
									<RequestCard
										key={req.id}
										request={req}
										onAccept={handleAccept}
										onReject={handleReject}
									/>
								))}
							</div>
						</section>
					)}

					{filteredRequests.length === 0 && (
						<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-8 text-center space-y-2">
							<p className="text-sm font-semibold text-[#1C1917] dark:text-stone-200">
								No requests match your search
							</p>
							<p className="text-xs text-[#78716C] dark:text-stone-400">
								Try searching by occasion name, reference code, or item.
							</p>
						</div>
					)}
				</div>
			)}

			{/* Tab 2: Active orders */}
			{activeTab === "active" && (
				<div className="space-y-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						In progress & scheduled
					</div>

					<div className="space-y-3">
						{activeOrders.map((order) => (
							<div
								key={order.id}
								className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
							>
								<div className="space-y-1">
									<h3 className="font-bold text-sm md:text-base text-[#1C1917] dark:text-stone-100">
										{order.title}
									</h3>
									<p className="text-xs text-[#78716C] dark:text-stone-400">
										{order.meta}
									</p>
									<div className="pt-1">
										{order.status === "On the way" ? (
											<button
												type="button"
												onClick={() => handleMarkDelivered(order.id)}
												className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B351F] dark:text-amber-400 hover:underline cursor-pointer"
											>
												<TruckIcon className="size-4" />
												Mark it delivered once it arrives
											</button>
										) : (
											<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-400">
												✓ Delivered
											</span>
										)}
									</div>
								</div>

								<span
									className={cn(
										"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold self-start sm:self-auto",
										order.status === "On the way"
											? "bg-[#EAF5EC] dark:bg-emerald-950/50 text-[#2D6A42] dark:text-emerald-300"
											: "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
									)}
								>
									{order.status}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Tab 3: Completed */}
			{activeTab === "completed" && (
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-12 text-center space-y-2">
					<p className="text-sm font-semibold text-[#1C1917] dark:text-stone-200">
						No completed orders yet
					</p>
					<p className="text-xs text-[#78716C] dark:text-stone-400">
						Fulfilled orders will be archived here once delivered.
					</p>
				</div>
			)}
		</div>
	);
}
