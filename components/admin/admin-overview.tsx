"use client";

import Link from "next/link";
import {
	MoneyIcon,
	CreditCardIcon,
	WarningIcon,
	CalendarBlankIcon,
	ClockIcon,
	ArrowRightIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { MediaThumb } from "@/components/media-thumb";
import { QueryState } from "@/components/form-error";
import { useApi } from "@/hooks/use-api";
import { adminApi, type Overview } from "@/lib/api/admin";
import { dayMonth, joinParts, money, occasionImage, pluralize, timeLabel } from "@/lib/format";

type FinancialMetric = {
	id: string;
	title: string;
	amount: string;
	subtext: string;
	iconType: "cash" | "card" | "warning" | "calendar";
	isAlert?: boolean;
};

// Colours for the pipeline bar, in the order work moves through the stages.
const STAGE_COLORS: Record<string, string> = {
	awaiting_reply: "#EAB308",
	reconfirming: "#C7C2BB",
	awaiting_call: "#E59880",
	contacted: "#C05621",
	preparing: "#5C2417",
	on_the_way: "#2F7455",
};

function financeCards(money_: Overview["money"]): FinancialMetric[] {
	return [
		{
			id: "cash_collect",
			title: "Cash to collect",
			amount: money(money_.cash_to_collect.amount),
			subtext: `${pluralize(money_.cash_to_collect.orders, "accepted order")} · handed over on the day`,
			iconType: "cash",
		},
		{
			id: "already_paid",
			title: "Already paid online",
			amount: money(money_.paid_online.amount),
			subtext: `${pluralize(money_.paid_online.orders, "order")} · paid before the day`,
			iconType: "card",
		},
		{
			id: "cash_owed",
			title: "Delivered, cash owed",
			amount: money(money_.cash_owed.amount),
			subtext: `${pluralize(money_.cash_owed.orders, "order")} not settled yet`,
			iconType: "warning",
			isAlert: money_.cash_owed.orders > 0,
		},
		{
			id: "booked_month",
			title: "Booked this month",
			amount: money(money_.booked_this_month.amount),
			subtext: `Last month ${money(money_.booked_this_month.last_month)}`,
			iconType: "calendar",
		},
	];
}

const EVENT_BADGE = {
	covered: { label: "Covered", variant: "covered" as const },
	awaiting: { label: "Awaiting caterer", variant: "awaiting" as const },
	nofood: { label: "No food ordered", variant: "nofood" as const },
};

export function AdminOverview() {
	const overview = useApi((signal) => adminApi.overview(signal), []);
	const data = overview.data;

	if (!data) {
		return (
			<div className="mx-auto w-full max-w-5xl">
				<QueryState loading={overview.loading} error={overview.error} onRetry={overview.reload} label="Loading overview…" />
			</div>
		);
	}

	const adminPlatformFinances = financeCards(data.money);
	const adminOrderStages = data.pipeline.map((stage) => ({ ...stage, color: STAGE_COLORS[stage.id] ?? "#C7C2BB" }));
	// Total orders across all stages for the progress bar calculation
	const totalStageOrders = adminOrderStages.reduce((sum, s) => sum + s.count, 0);
	const adminOrdersInProgress = data.orders_in_progress.items;

	return (
		<div className="mx-auto w-full max-w-5xl space-y-7 pb-12 font-sans">
			{/* Page Subtitle */}
			<div>
				<p className="text-[#78716C] dark:text-stone-400 text-sm md:text-[15px] font-normal leading-relaxed">
					Where money, orders and the next seven days stand right now.
				</p>
			</div>

			{/* Section 1: Money on the platform */}
			<section className="space-y-3.5">
				<h2 className="font-bold text-lg md:text-[19px] text-[#1C1917] dark:text-stone-100 tracking-tight">
					Money on the platform
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{adminPlatformFinances.map((item) => (
						<FinanceCard key={item.id} item={item} />
					))}
				</div>
			</section>

			{/* Section 2: Orders in progress */}
			<section className="space-y-3.5">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-lg md:text-[19px] text-[#1C1917] dark:text-stone-100 tracking-tight">
						Orders in progress
					</h2>
					<Link
						href="/admin/orders"
						className="group inline-flex items-center gap-1 font-medium text-xs md:text-sm text-[#9C412B] hover:text-[#7C2D12] dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
					>
						All orders
						<ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>

				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-5">
					{/* Multi-segment progress bar */}
					<div className="space-y-3.5">
						<div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#EFECE6] dark:bg-stone-800">
							{adminOrderStages.map((stage) => {
								if (stage.count === 0 || totalStageOrders === 0) return null;
								const percent = (stage.count / totalStageOrders) * 100;
								return (
									<div
										key={stage.id}
										className="h-full transition-all"
										style={{
											width: `${percent}%`,
											backgroundColor: stage.color,
										}}
										title={`${stage.label}: ${stage.count}`}
									/>
								);
							})}
						</div>

						{/* Legend with colored dots */}
						<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs md:text-sm">
							{adminOrderStages.map((stage) => (
								<div key={stage.id} className="flex items-center gap-1.5">
									<span
										className="size-2.5 rounded-full inline-block shrink-0"
										style={{ backgroundColor: stage.color }}
									/>
									<span className="font-normal text-[#57524D] dark:text-stone-400">
										{stage.label}
									</span>
									<span className="font-bold text-[#1C1917] dark:text-stone-100 ml-0.5">
										{stage.count}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Warning alert notice */}
					{data.overdue_replies > 0 ? (
						<div className="flex items-center gap-2 pt-1 font-bold text-xs md:text-sm text-[#C53030] dark:text-red-400">
							<ClockIcon
								weight="bold"
								className="size-4 shrink-0 text-[#C53030] dark:text-red-400"
							/>
							<span>{data.overdue_replies} with no caterer reply after 2 hours</span>
						</div>
					) : null}

					{/* Orders list */}
					<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
						{adminOrdersInProgress.length === 0 ? (
							<p className="py-6 text-center text-sm text-[#78716C] dark:text-stone-400">
								No orders are in progress.
							</p>
						) : null}
						{adminOrdersInProgress.map((order) => (
							<div
								key={order.id}
								className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-2 last:pb-2"
							>
								{/* Left: Customer -> Caterer & Event Details */}
								<div className="space-y-0.5">
									<div className="flex items-center flex-wrap gap-1 text-sm md:text-[15px] font-bold text-[#1C1917] dark:text-stone-100">
										<span>{order.host}</span>
										<span className="text-[#A8A29E] dark:text-stone-500 font-normal mx-0.5">
											→
										</span>
										<span>{order.provider}</span>
									</div>
									<div className="text-xs md:text-[13px] text-[#78716C] dark:text-stone-400">
										{order.title} · {order.guest_count} guests ·{" "}
										{order.order_number}
									</div>
								</div>

								{/* Right: Amount & Stage Information */}
								<div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
									<div className="font-bold text-sm md:text-base text-[#1C1917] dark:text-stone-100 sm:text-right min-w-[70px]">
										{money(order.total_amount)}
									</div>
									<div className="text-right min-w-[95px]">
										<div className="font-medium text-xs md:text-[13px] text-[#292524] dark:text-stone-200">
											{order.stage}
										</div>
										<div
											className={cn(
												"text-xs mt-0.5",
												order.is_overdue
													? "font-medium text-[#C53030] dark:text-red-400"
													: "text-[#A8A29E] dark:text-stone-500"
											)}
										>
											{order.hours_in_stage}h in this stage
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Footer link to all orders */}
					<div className="pt-2 text-center">
						<Link
							href="/admin/orders"
							className="inline-flex items-center gap-1.5 font-medium text-xs md:text-sm text-[#9C412B] hover:text-[#7C2D12] dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
						>
							See all {data.orders_in_progress.total} orders in progress
							<span className="text-xs">→</span>
						</Link>
					</div>
				</div>
			</section>

			{/* Section 3: Next seven days */}
			<section className="space-y-3.5">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-lg md:text-[19px] text-[#1C1917] dark:text-stone-100 tracking-tight">
						Next seven days
					</h2>
					<Link
						href="/admin/orders"
						className="group inline-flex items-center gap-1 font-medium text-xs md:text-sm text-[#9C412B] hover:text-[#7C2D12] dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
					>
						All orders
						<ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>

				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
					{data.upcoming_seven_days.length === 0 ? (
						<p className="py-6 text-center text-sm text-[#78716C] dark:text-stone-400">
							No occasions in the next seven days.
						</p>
					) : null}
					{data.upcoming_seven_days.map((event) => (
						<div
							key={event.id}
							className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-1 last:pb-1"
						>
							{/* Left: Thumbnail, Date/Time, Event Info */}
							<div className="flex items-center gap-4">
								<MediaThumb
									src={null}
									fallbackSrc={occasionImage(event.meal_type)}
									label={event.title}
									sizes="72px"
									className="h-12 w-16 sm:h-14 sm:w-18 rounded-lg"
								/>

								<div className="shrink-0 min-w-[62px]">
									<div className="font-bold text-xs md:text-sm text-[#1C1917] dark:text-stone-100">
										{dayMonth(event.event_date)}
									</div>
									<div className="text-xs text-[#78716C] dark:text-stone-400">
										{timeLabel(event.start_time)}
									</div>
								</div>

								<div className="space-y-0.5">
									<div className="text-xs md:text-sm">
										<span className="font-bold text-[#1C1917] dark:text-stone-100">
											{event.title}
										</span>
										<span className="text-[#A8A29E] dark:text-stone-400 font-normal ml-2">
											{event.host}
										</span>
									</div>
									<div className="text-xs text-[#78716C] dark:text-stone-400">
										{joinParts([event.meal_type, event.guests != null ? `${event.guests} guests` : "", event.caterers.length ? event.caterers.join(", ") : "No caterer yet"])}
									</div>
								</div>
							</div>

							{/* Right: Price & Status Badge */}
							<div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pl-20 sm:pl-0">
								<div className="font-bold text-xs sm:text-sm text-[#1C1917] dark:text-stone-100 sm:text-right min-w-[50px]">
									{event.state === "nofood" ? "—" : money(event.amount)}
								</div>
								<div className="min-w-[125px] text-right">
									<EventStatusBadge
										label={EVENT_BADGE[event.state].label}
										variant={EVENT_BADGE[event.state].variant}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

function FinanceCard({ item }: { item: FinancialMetric }) {
	const isAlert = item.isAlert;

	return (
		<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
			{/* Top: Icon + Label */}
			<div className="flex items-center gap-2">
				{item.iconType === "cash" && (
					<MoneyIcon className="size-4 text-[#57524D] dark:text-stone-400 shrink-0" />
				)}
				{item.iconType === "card" && (
					<CreditCardIcon className="size-4 text-[#57524D] dark:text-stone-400 shrink-0" />
				)}
				{item.iconType === "warning" && (
					<WarningIcon
						weight="bold"
						className="size-4 text-[#C53030] dark:text-red-400 shrink-0"
					/>
				)}
				{item.iconType === "calendar" && (
					<CalendarBlankIcon className="size-4 text-[#57524D] dark:text-stone-400 shrink-0" />
				)}

				<span
					className={cn(
						"text-xs font-semibold tracking-tight",
						isAlert
							? "text-[#C53030] dark:text-red-400"
							: "text-[#57524D] dark:text-stone-300"
					)}
				>
					{item.title}
				</span>
			</div>

			{/* Middle: Big Stat Amount */}
			<div
				className={cn(
					"text-3xl sm:text-[34px] font-bold tracking-tight my-1",
					isAlert
						? "text-[#C53030] dark:text-red-400"
						: "text-[#1C1917] dark:text-stone-50"
				)}
			>
				{item.amount}
			</div>

			{/* Bottom: Subtitle context */}
			<div
				className={cn(
					"text-xs font-normal",
					isAlert
						? "text-[#C53030] dark:text-red-400 font-medium"
						: "text-[#78716C] dark:text-stone-400"
				)}
			>
				{item.subtext}
			</div>
		</div>
	);
}

function EventStatusBadge({
	label,
	variant,
}: {
	label: string;
	variant: "covered" | "awaiting" | "nofood";
}) {
	if (variant === "covered") {
		return (
			<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-3 py-1 text-xs font-medium text-[#2D6A42] dark:text-emerald-300">
				{label}
			</span>
		);
	}

	if (variant === "awaiting") {
		return (
			<span className="inline-flex items-center rounded-full bg-[#FCF4E7] dark:bg-amber-950/50 px-3 py-1 text-xs font-medium text-[#915B1E] dark:text-amber-300">
				{label}
			</span>
		);
	}

	return (
		<span className="inline-flex items-center rounded-full bg-[#F1EFEA] dark:bg-stone-800 px-3 py-1 text-xs font-medium text-[#69635C] dark:text-stone-300">
			{label}
		</span>
	);
}
