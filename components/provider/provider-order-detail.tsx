"use client";

import Link from "next/link";
import { ArrowLeftIcon, PhoneIcon } from "@phosphor-icons/react";
import { QueryState } from "@/components/form-error";
import { RequestCard } from "@/components/provider/request-card";
import { useApi } from "@/hooks/use-api";
import { ordersApi } from "@/lib/api/provider";
import { dateTimeLabel } from "@/lib/format";

/** One order in full: the request card, host contact and its timeline. */
export function ProviderOrderDetail({ id }: { id: string }) {
	const detail = useApi((signal) => ordersApi.detail(id, signal), [id]);
	const order = detail.data;

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6 pb-16 font-sans">
			<div>
				<Link
					href="/provider/requests"
					className="group inline-flex items-center gap-2 font-semibold text-xs md:text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
				>
					<ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
					Requests
				</Link>
			</div>

			{!order ? (
				<QueryState loading={detail.loading} error={detail.error} onRetry={detail.reload} label="Loading order…" />
			) : (
				<>
					<RequestCard order={order} onChanged={detail.reload} />

					<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
						<div className="text-[11px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
							Host
						</div>
						<div className="font-bold text-base text-[#1C1917] dark:text-stone-100">{order.host.name}</div>
						{order.host.phone ? (
							<a
								href={`tel:${order.host.phone}`}
								className="inline-flex items-center gap-1.5 font-bold text-sm text-[#8B351F] dark:text-amber-400 hover:underline"
							>
								<PhoneIcon className="size-3.5" />
								{order.host.phone}
							</a>
						) : (
							<p className="text-xs text-[#78716C] dark:text-stone-400">
								The host&apos;s phone number is shown once you accept the request.
							</p>
						)}
						{order.cancelled_reason ? (
							<p className="text-xs text-[#B83E28]">Reason: {order.cancelled_reason}</p>
						) : null}
					</div>

					<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
						<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
							Timeline
						</div>
						<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
							{order.events.map((event) => (
								<div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:px-5">
									<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">{event.message}</div>
									<div className="text-right shrink-0 text-xs text-[#78716C] dark:text-stone-400">
										{dateTimeLabel(event.created_at)}
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
