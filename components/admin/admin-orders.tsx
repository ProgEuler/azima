"use client";

import { useState } from "react";
import Link from "next/link";
import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { MediaThumb } from "@/components/media-thumb";
import { OrderStatusPill } from "@/components/order-status-pill";
import { useApi, useDebounced } from "@/hooks/use-api";
import { adminApi, type OrderScope, type OrderTab } from "@/lib/api/admin";
import {
	dateLabel,
	joinParts,
	money,
	occasionImage,
	paymentMethodLabel,
	pluralize,
	timeLabel,
} from "@/lib/format";
import { ORDER_WAITING_ON, type OrderStatus } from "@/lib/order-meta";

const TABS: { id: OrderTab; label: string }[] = [
	{ id: "all", label: "All" },
	{ id: "awaiting", label: "Awaiting reply" },
	{ id: "in_progress", label: "In progress" },
	{ id: "delivered", label: "Delivered" },
	{ id: "declined", label: "Declined or cancelled" },
];

const SCOPES: { id: OrderScope; label: string }[] = [
	{ id: "any", label: "Everything" },
	{ id: "open", label: "Still open" },
	{ id: "week", label: "Next 7 days" },
];

function WaitingOnCell({ status }: { status: string }) {
	const value = ORDER_WAITING_ON[status as OrderStatus] ?? "—";
	let className = "text-[#78716C] dark:text-stone-400";
	if (status === "on_the_way" || status === "preparing") {
		className = "text-[#2D6A42] dark:text-emerald-400";
	} else if (status === "confirmed" || status === "pending" || status === "reconfirming") {
		className = "text-[#915B1E] dark:text-amber-400";
	}
	return <span className={`text-xs sm:text-sm font-medium ${className}`}>{value}</span>;
}

export function AdminOrders() {
	const [activeTab, setActiveTab] = useState<OrderTab>("all");
	const [scope, setScope] = useState<OrderScope>("any");
	const [searchQuery, setSearchQuery] = useState("");
	const q = useDebounced(searchQuery.trim());

	const orders = useApi(
		(signal) => adminApi.orders({ tab: activeTab, scope, q, page_size: 100 }, signal),
		[activeTab, scope, q],
	);
	const counts = orders.data?.counts;
	const rows = orders.data?.results ?? [];

	return (
		<div className="mx-auto w-full max-w-5xl space-y-4 pb-16 font-sans">
			{/* Search */}
			<div className="relative">
				<MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#78716C]" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search by reference, occasion, host or caterer"
					className="h-11 w-full rounded-full border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 pl-10 pr-4 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 transition-colors"
				/>
			</div>

			{/* Tabs */}
			<div className="flex flex-wrap gap-2">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
								isActive
									? "bg-[#8B351F] text-white shadow-2xs"
									: "bg-[#FAF8F5] dark:bg-stone-900/60 text-[#1C1917] dark:text-stone-200 border border-[#EFECE6] dark:border-stone-800 hover:bg-[#F5F2EC] dark:hover:bg-stone-800"
							}`}
						>
							{tab.label}
							<span
								className={`inline-flex items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
									isActive
										? "bg-white/20 text-white"
										: "bg-[#EFECE6] dark:bg-stone-800 text-[#78716C] dark:text-stone-400"
								}`}
							>
								{counts?.[tab.id] ?? 0}
							</span>
						</button>
					);
				})}
			</div>

			{/* Scope filter */}
			<div className="relative inline-block">
				<select
					value={scope}
					onChange={(e) => setScope(e.target.value as OrderScope)}
					aria-label="Order scope"
					className="appearance-none inline-flex items-center rounded-full bg-[#FAF8F5] dark:bg-stone-900/60 border border-[#EFECE6] dark:border-stone-800 pl-3.5 pr-8 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-stone-200 hover:bg-[#F5F2EC] dark:hover:bg-stone-800 transition-colors cursor-pointer outline-none"
				>
					{SCOPES.map((option) => (
						<option key={option.id} value={option.id}>
							{option.label}
						</option>
					))}
				</select>
				<CaretDownIcon className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2" />
			</div>

			{/* Table card */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				{/* Header */}
				<div className="hidden sm:grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-4 px-5 py-3 border-b border-[#EFECE6] dark:border-stone-800 text-xs font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
					<div>Order</div>
					<div>Occasions</div>
					<div>Total</div>
					<div>Waiting on</div>
					<div>Status</div>
				</div>

				{/* Rows */}
				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
					{orders.loading && !orders.data ? (
						<div className="py-12 text-center text-sm text-[#78716C] dark:text-stone-400">Loading orders…</div>
					) : orders.error ? (
						<div className="py-12 text-center text-sm text-[#B83E28]">
							{orders.error.message}{" "}
							<button type="button" onClick={orders.reload} className="underline cursor-pointer">
								Try again
							</button>
						</div>
					) : rows.length === 0 ? (
						<div className="py-12 text-center text-sm text-[#78716C] dark:text-stone-400">
							No orders match these filters.
						</div>
					) : null}
					{rows.map((order) => {
						const row = {
							code: order.order_number,
							occasionTitle: order.title || "Order",
							occasionMeta: joinParts([
								dateLabel(order.delivery_date),
								timeLabel(order.delivery_time),
								pluralize(order.guest_count, "guest"),
							]),
							breadcrumb: joinParts([
								order.meal_type ? order.meal_type.charAt(0).toUpperCase() + order.meal_type.slice(1) : "",
								order.provider.business_name,
							]),
							imageSrc: occasionImage(order.meal_type),
							total: money(order.total_amount),
							totalNote: paymentMethodLabel(order.payment),
							isRev: order.status === "reconfirming",
						};
						const href = `/admin/orders/${order.id}`;
						return (
							<Link
								key={order.id}
								href={href}
								className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-4 px-5 py-4 hover:bg-[#FAF8F5]/60 dark:hover:bg-stone-800/40 transition-colors items-center"
							>
								{/* Order: thumbnail + code + breadcrumb */}
								<div className="flex items-center gap-3">
									<MediaThumb
										src={null}
										fallbackSrc={row.imageSrc}
										label={row.occasionTitle}
										sizes="44px"
										className="size-11 rounded-lg"
									/>
									<div className="space-y-0.5 min-w-0">
										<div className="flex items-center gap-1.5 flex-wrap">
											<span className="font-bold text-sm text-[#8B351F] dark:text-amber-400">
												{row.code}
											</span>
											{row.isRev ? (
												<span className="inline-flex items-center rounded-full bg-[#FCF4E7] dark:bg-amber-950/50 px-2 py-0.5 text-[11px] font-semibold text-[#915B1E] dark:text-amber-300">
													Rev
												</span>
											) : null}
										</div>
										<div className="text-xs text-[#78716C] dark:text-stone-400 truncate">
											{row.breadcrumb}
										</div>
									</div>
								</div>

								{/* Occasion */}
								<div className="space-y-0.5 min-w-0">
									<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
										{row.occasionTitle}
									</div>
									<div className="text-xs text-[#78716C] dark:text-stone-400">
										{row.occasionMeta}
									</div>
								</div>

								{/* Total */}
								<div className="space-y-0.5">
									<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
										{row.total}
									</div>
									<div className="text-xs text-[#78716C] dark:text-stone-400">
										{row.totalNote}
									</div>
								</div>

								{/* Waiting on */}
								<div className="flex items-center">
									<WaitingOnCell status={order.status} />
								</div>

								{/* Status */}
								<div>
									<OrderStatusPill status={order.status} />
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
