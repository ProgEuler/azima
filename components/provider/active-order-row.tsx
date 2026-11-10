"use client";

import { useState } from "react";
import Link from "next/link";
import { AdvanceOrderButton } from "@/components/provider/advance-order-button";
import { FormError } from "@/components/form-error";
import { OrderStatusPill } from "@/components/order-status-pill";
import type { ProviderOrder } from "@/lib/api/provider";
import { dateLabel, joinParts, money, timeLabel } from "@/lib/format";

/** Compact row for an accepted order, with its next-step action. */
export function ActiveOrderRow({
	order,
	onChanged,
}: {
	order: ProviderOrder;
	onChanged?: () => void;
}) {
	const [error, setError] = useState<unknown>(null);
	return (
		<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div className="space-y-1">
				<h3 className="font-bold text-sm md:text-base text-[#1C1917] dark:text-stone-100">
					<Link href={`/provider/requests/${order.id}`} className="hover:underline">
						{order.title || "Order"}
					</Link>
					<span className="ml-2 text-xs font-medium text-[#78716C] dark:text-stone-400">{order.order_number}</span>
				</h3>
				<p className="text-xs text-[#78716C] dark:text-stone-400">
					{joinParts([
						dateLabel(order.delivery_date),
						timeLabel(order.delivery_time),
						`${order.guest_count} guests`,
						money(order.total_amount),
					])}
				</p>
				<div className="pt-1">
					{order.status === "delivered" ? (
						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-400">
							✓ Delivered
						</span>
					) : (
						<AdvanceOrderButton order={order} onChanged={onChanged} onError={setError} variant="link" />
					)}
				</div>
				<FormError error={error} />
			</div>
			<OrderStatusPill status={order.status} className="self-start sm:self-auto" />
		</div>
	);
}
