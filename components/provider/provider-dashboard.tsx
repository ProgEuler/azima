"use client";

import Link from "next/link";
import {
	ArrowRightIcon,
	BriefcaseIcon,
	EnvelopeSimpleIcon,
	ReceiptIcon,
} from "@phosphor-icons/react";
import { QueryState } from "@/components/form-error";
import { ActiveOrderRow } from "@/components/provider/active-order-row";
import { RequestCard } from "@/components/provider/request-card";
import { RequestSettings } from "@/components/provider/request-settings";
import { useApi } from "@/hooks/use-api";
import { ordersApi, providerApi } from "@/lib/api/provider";
import { money, pluralize } from "@/lib/format";

export function ProviderDashboard() {
	const dashboard = useApi((signal) => providerApi.dashboard(signal), []);
	const needsResponse = useApi(
		(signal) => ordersApi.list({ tab: "needs_response", page_size: 2 }, signal),
		[],
	);
	const active = useApi((signal) => ordersApi.list({ tab: "active", page_size: 20 }, signal), []);

	const summary = dashboard.data;
	if (!summary) {
		return (
			<div className="mx-auto w-full max-w-5xl">
				<QueryState loading={dashboard.loading} error={dashboard.error} onRetry={dashboard.reload} label="Loading your dashboard…" />
			</div>
		);
	}

	const refresh = () => {
		dashboard.reload();
		needsResponse.reload();
		active.reload();
	};

	const waitingCount = needsResponse.data?.counts.needs_response ?? summary.waiting_for_reply.count;
	const dashboardRequests = needsResponse.data?.results ?? [];
	const activeOrders = active.data?.results ?? [];

	return (
		<div className="mx-auto w-full max-w-5xl space-y-7 pb-16 font-sans">
			<RequestSettings
				initialMode={summary.settings.request_mode}
				initialNotice={summary.settings.order_notice_period}
				closedDatesCount={summary.settings.closed_dates_count}
				onChanged={dashboard.reload}
			/>

			{/* 3 Summary / KPI Cards */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Waiting for your reply */}
				<Link
					href="/provider/requests"
					className="rounded-2xl bg-[#943820] dark:bg-[#7C2D12] text-white p-6 shadow-xs flex flex-col justify-between gap-5 hover:bg-[#85321C] transition-colors group cursor-pointer"
				>
					<div className="flex items-center gap-2 text-sm font-semibold text-white/95">
						<EnvelopeSimpleIcon className="size-4" />
						Waiting for your reply
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl sm:text-5xl font-bold tracking-tight">{summary.waiting_for_reply.count}</span>
						<span className="text-sm text-white/85 font-normal">{summary.waiting_for_reply.count === 1 ? "request" : "requests"}</span>
					</div>
					<div className="flex items-center justify-between text-xs font-semibold text-white/95 border-t border-white/15 pt-3">
						<span>{money(summary.waiting_for_reply.total_amount)} still undecided</span>
						<ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
					</div>
				</Link>

				{/* Money on accepted work */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-5">
					<div className="flex items-center gap-2 text-xs font-semibold text-[#78716C] dark:text-stone-400">
						<BriefcaseIcon className="size-4" />
						Money on accepted work
					</div>
					<div>
						<div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-stone-100">
							{money(Number(summary.money_on_accepted_work.cash_to_collect) + Number(summary.money_on_accepted_work.paid_online))}
						</div>
					</div>
					<div className="space-y-1 text-xs border-t border-[#F5F2EC] dark:border-stone-800 pt-3">
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>To collect in cash</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">
								{money(summary.money_on_accepted_work.cash_to_collect)}
							</span>
						</div>
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>Already paid online</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">{money(summary.money_on_accepted_work.paid_online)}</span>
						</div>
					</div>
				</div>

				{/* Earned this month */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-5">
					<div className="flex items-center gap-2 text-xs font-semibold text-[#78716C] dark:text-stone-400">
						<ReceiptIcon className="size-4" />
						Earned this month
					</div>
					<div>
						<div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-stone-100">
							{money(summary.earned_this_month.amount)}
						</div>
					</div>
					<div className="space-y-1 text-xs border-t border-[#F5F2EC] dark:border-stone-800 pt-3">
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>Orders completed</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">{summary.earned_this_month.orders_completed}</span>
						</div>
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>Next 7 days</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">
								{pluralize(summary.earned_this_month.next_7_days.jobs, "job")} · {pluralize(summary.earned_this_month.next_7_days.guests, "guest")}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Needs your response section */}
			<section className="space-y-4">
				<div className="flex items-center justify-between gap-2">
					<h2 className="font-bold text-base md:text-lg text-[#1C1917] dark:text-stone-100 tracking-tight">
						Needs your response
					</h2>
					{waitingCount > 0 ? (
						<span className="inline-flex items-center rounded-full bg-[#E58325] px-2.5 py-0.5 text-xs font-semibold text-white shadow-2xs">
							Showing {dashboardRequests.length} of {waitingCount}
						</span>
					) : null}
				</div>

				<QueryState loading={needsResponse.loading && !needsResponse.data} error={needsResponse.error} onRetry={needsResponse.reload} />
				{needsResponse.data && dashboardRequests.length === 0 ? (
					<p className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 text-sm text-[#78716C] dark:text-stone-400">
						You are all caught up. New requests will appear here.
					</p>
				) : null}

				<div className="space-y-4">
					{dashboardRequests.map((order) => (
						<RequestCard key={order.id} order={order} onChanged={refresh} />
					))}
				</div>

				{waitingCount > 0 ? (
					<Link
						href="/provider/requests"
						className="w-full rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#8B351F] dark:text-amber-400 hover:bg-[#FAF8F5] dark:hover:bg-stone-850 transition-colors"
					>
						See all {waitingCount} {waitingCount === 1 ? "request" : "requests"} →
					</Link>
				) : null}
			</section>

			{/* Active orders section */}
			<section className="space-y-3">
				<h2 className="font-bold text-base md:text-lg text-[#1C1917] dark:text-stone-100 tracking-tight">
					Active orders
				</h2>

				<QueryState loading={active.loading && !active.data} error={active.error} onRetry={active.reload} />
				{active.data && activeOrders.length === 0 ? (
					<p className="text-sm text-[#78716C] dark:text-stone-400">No active orders right now.</p>
				) : null}

				<div className="space-y-3">
					{activeOrders.map((order) => (
						<ActiveOrderRow key={order.id} order={order} onChanged={refresh} />
					))}
				</div>
			</section>
		</div>
	);
}
