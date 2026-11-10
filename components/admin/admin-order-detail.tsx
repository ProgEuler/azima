"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PhoneIcon } from "@phosphor-icons/react";
import { CancelOrderModal } from "@/components/admin/cancel-order-modal";
import { MediaThumb } from "@/components/media-thumb";
import { OrderStatusPill } from "@/components/order-status-pill";
import { QueryState } from "@/components/form-error";
import { useApi } from "@/hooks/use-api";
import { adminApi } from "@/lib/api/admin";
import {
	dateLabel,
	dateTimeLabel,
	joinParts,
	money,
	occasionImage,
	paymentMethodLabel,
	paymentStateLabel,
	timeLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";

const PAYMENT_TONE = {
	amber: "text-[#915B1E] dark:text-amber-400",
	green: "text-[#2D6A42] dark:text-emerald-400",
	red: "text-[#B83E28] dark:text-rose-400",
	neutral: "text-[#78716C] dark:text-stone-400",
} as const;

export function AdminOrderDetail({ id }: { id: string }) {
	const detail = useApi((signal) => adminApi.order(id, signal), [id]);
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

	const order = detail.data;
	if (!order) {
		return (
			<div className="mx-auto w-full max-w-5xl">
				<QueryState loading={detail.loading} error={detail.error} onRetry={detail.reload} label="Loading order…" />
			</div>
		);
	}

	const isCancelled = order.status === "cancelled";
	const canCancel = !["cancelled", "rejected", "delivered"].includes(order.status);
	const payment = paymentStateLabel(order.payment);
	const milestones = order.milestones;
	const decision = milestones.caterer_decision;

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-16 font-sans">
			{/* Back link */}
			<div>
				<Link
					href="/admin/orders"
					className="group inline-flex items-center gap-2 font-semibold text-xs md:text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
				>
					<ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
					Orders
				</Link>
			</div>

			{/* Hero + meta card */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				{/* Hero image with tag pills */}
				<div className="relative h-44 sm:h-56 w-full bg-stone-100">
					<MediaThumb
						src={null}
						fallbackSrc={occasionImage(order.meal_type)}
						label={order.title}
						sizes="(max-width: 1024px) 100vw, 1024px"
						priority
						className="absolute inset-0 border-0"
					/>
					<div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
						<span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-[#1C1917] shadow-2xs backdrop-blur">
							{order.order_number}
						</span>
						{order.meal_type ? (
							<span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-[#1C1917] shadow-2xs backdrop-blur capitalize">
								{order.meal_type}
							</span>
						) : null}
					</div>
				</div>

				{/* Status + title + amount row */}
				<div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div className="space-y-2.5">
						<OrderStatusPill status={order.status} />
						<h1 className="font-bold text-2xl sm:text-[28px] tracking-tight text-[#1C1917] dark:text-stone-50">
							{order.title}
						</h1>
						<p className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400">
							{joinParts([
								dateLabel(order.delivery_date),
								timeLabel(order.delivery_time),
								order.fulfillment === "pickup" ? "Host collects" : order.delivery_address,
							])}
						</p>
					</div>

					<div className="text-left sm:text-right shrink-0">
						<div className="font-bold text-2xl sm:text-3xl tracking-tight text-[#1C1917] dark:text-stone-50">
							{money(order.total_amount)}
						</div>
						<div className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400 mt-1">
							{order.guest_count} guests · {paymentMethodLabel(order.payment)}
						</div>
						<div className={cn("text-xs font-semibold mt-1", PAYMENT_TONE[payment.tone])}>
							{payment.text}
						</div>
					</div>
				</div>
			</div>

			{/* Host + Caterer side-by-side */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Host */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
					<div className="text-[11px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
						Host
					</div>
					<div className="space-y-1">
						<div className="font-bold text-base sm:text-lg text-[#8B351F] dark:text-amber-400">
							{order.host.name}
						</div>
						<div className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400">
							{order.host.email ?? "—"}
						</div>
					</div>
					<div className="flex items-center gap-1.5 font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100 pt-1">
						<PhoneIcon className="size-3.5 text-[#78716C]" />
						{order.host.phone ?? "—"}
					</div>
				</div>

				{/* Caterer */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
					<div className="text-[11px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
						Caterer
					</div>
					<div className="space-y-1">
						<div className="font-bold text-base sm:text-lg text-[#8B351F] dark:text-amber-400">
							{order.provider.business_name}
						</div>
						<div className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400">
							{order.provider.city || "—"}
						</div>
					</div>
					<div className="flex items-center gap-1.5 font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100 pt-1">
						<PhoneIcon className="size-3.5 text-[#78716C]" />
						{order.provider.phone || "—"}
					</div>
				</div>
			</div>

			{/* Three milestones */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					The three milestones
				</div>

				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80 p-5 sm:p-6 space-y-0">
					{/* Caterer decision */}
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-3 first:pt-1 last:pb-1">
						<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
							Caterer decision
						</div>
						<div className="text-left sm:text-right">
							<div
								className={cn(
									"font-bold text-sm sm:text-base",
									decision.state === "accepted" && "text-[#2D6A42] dark:text-emerald-400",
									decision.state === "declined" && "text-[#B83E28] dark:text-rose-400",
									decision.state === "pending" && "text-[#915B1E] dark:text-amber-400",
								)}
							>
								{decision.state === "accepted"
									? "Accepted"
									: decision.state === "declined"
										? "Declined"
										: "Awaiting reply"}
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
								{decision.at ? dateTimeLabel(decision.at) : "—"}
							</div>
						</div>
					</div>

					{/* Host contacted */}
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-3">
						<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
							Host contacted by caterer
						</div>
						<div className="text-left sm:text-right">
							<div
								className={cn(
									"font-bold text-sm sm:text-base",
									milestones.host_contacted.at
										? "text-[#2D6A42] dark:text-emerald-400"
										: "text-[#666059] dark:text-stone-400",
								)}
							>
								{milestones.host_contacted.at
									? milestones.host_contacted.note || "Confirmed"
									: "Not yet"}
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
								{milestones.host_contacted.at ? dateTimeLabel(milestones.host_contacted.at) : "—"}
							</div>
						</div>
					</div>

					{/* Delivery */}
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-3 last:pb-1">
						<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
							Delivery
						</div>
						<div className="text-left sm:text-right">
							<div
								className={cn(
									"font-bold text-sm sm:text-base",
									milestones.delivery.at
										? "text-[#2D6A42] dark:text-emerald-400"
										: "text-[#666059] dark:text-stone-400",
								)}
							>
								{milestones.delivery.at ? "Delivered" : isCancelled ? "Cancelled" : "Not yet"}
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
								{milestones.delivery.at ? dateTimeLabel(milestones.delivery.at) : "—"}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* What was ordered */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					What was ordered · {order.items.length} {order.items.length === 1 ? "item" : "items"}
				</div>

				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80 p-5 sm:p-6 space-y-0">
					{order.items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
						>
							<div className="flex items-center gap-3">
								<MediaThumb
									src={item.image}
									label={item.item_name}
									sizes="40px"
									className="size-10 rounded-lg"
								/>
								<div className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-stone-100">
									{item.item_name}
								</div>
							</div>
							<div className="text-right shrink-0">
								<div className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-stone-100">
									{money(item.unit_price)}
								</div>
								<div className="text-xs text-[#78716C] dark:text-stone-400">
									/ guest · {money(item.total_price)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Timeline */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					Timeline
				</div>

				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
					{order.events.map((event) => (
						<div
							key={event.id}
							className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:px-5"
						>
							<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
								{event.message}
							</div>
							<div className="text-right shrink-0">
								<div className="text-xs text-[#78716C] dark:text-stone-400">
									{dateTimeLabel(event.created_at)}
								</div>
								<div className="text-[11px] text-[#78716C] dark:text-stone-500">
									{event.actor}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Audit records */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					Audit records for this order · {order.audit_records.length}
				</div>

				<div className="p-4 sm:px-5">
					{order.audit_records.length > 0 ? (
						<div className="space-y-4">
							{order.audit_records.map((record) => (
								<div key={record.id} className="space-y-1">
									<div className="text-xs font-semibold text-[#8B351F] dark:text-amber-400">
										{record.message}
									</div>
									{record.reason ? (
										<p className="text-sm text-[#1C1917] dark:text-stone-200">
											Reason: {record.reason}
										</p>
									) : null}
									<div className="text-xs text-[#78716C] dark:text-stone-400 pt-0.5">
										{record.actor ? `${record.actor} · ` : ""}
										{dateTimeLabel(record.created_at)}
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-[#78716C] dark:text-stone-400">
							Nothing recorded against this order yet.
						</p>
					)}
				</div>
			</div>

			{/* Cancel footer */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
				<p className="text-xs text-[#78716C] dark:text-stone-400 max-w-xl leading-relaxed">
					{isCancelled
						? `This order was cancelled${order.cancelled_by === "admin" ? " by azima support" : order.cancelled_by ? ` by the ${order.cancelled_by}` : ""} (${order.cancelled_reason || "no reason given"}). ${order.provider.business_name} and ${order.host.name} have been notified.`
						: canCancel
							? "Cancel on behalf of the platform only when neither side can resolve it. The host and the caterer are both told, and the record names azima support."
							: "This order is finished and can no longer be cancelled."}
				</p>
				{!canCancel ? (
					<span className="rounded-full border border-[#EFECE6] dark:border-stone-800 bg-stone-100 dark:bg-stone-800/50 px-5 py-2 text-xs font-semibold text-[#78716C] dark:text-stone-400 self-start sm:self-auto shadow-2xs">
						{isCancelled ? "Order cancelled" : order.status_label}
					</span>
				) : (
					<button
						type="button"
						onClick={() => setIsCancelModalOpen(true)}
						className="rounded-full border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900 px-5 py-2 text-xs font-semibold text-[#B83E28] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
					>
						Cancel this order
					</button>
				)}
			</div>

			<CancelOrderModal
				open={isCancelModalOpen}
				onOpenChange={setIsCancelModalOpen}
				orderCode={order.order_number}
				catererName={order.provider.business_name}
				customerName={order.host.name}
				onConfirm={async (reason) => {
					await adminApi.cancelOrder(id, reason);
					detail.reload();
				}}
			/>
		</div>
	);
}
