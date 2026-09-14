"use client";

import { useState } from "react";
import Link from "next/link";
import {
	ClockCountdownIcon,
	LightningIcon,
	ProhibitIcon,
	CalendarBlankIcon,
	InfoIcon,
	CaretRightIcon,
	EnvelopeSimpleIcon,
	BriefcaseIcon,
	ReceiptIcon,
	ArrowRightIcon,
	TruckIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { RequestCard } from "./request-card";
import {
	INITIAL_PROVIDER_REQUESTS,
	INITIAL_ACTIVE_ORDERS,
	type ProviderRequest,
} from "./provider-mock-data";

export function ProviderDashboard() {
	const [requestMode, setRequestMode] = useState<"review" | "auto" | "not_accepting">("auto");
	const [notice48h, setNotice48h] = useState(false);
	const [requests, setRequests] = useState<ProviderRequest[]>(INITIAL_PROVIDER_REQUESTS);
	const [activeOrders, setActiveOrders] = useState(INITIAL_ACTIVE_ORDERS);

	// Display only top 2 requests on dashboard as shown in screenshot
	const dashboardRequests = requests.slice(0, 2);

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

	return (
		<div className="mx-auto w-full max-w-5xl space-y-7 pb-16 font-sans">
			{/* Taking new requests settings card */}
			<section className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 md:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-5">
				<div className="space-y-1">
					<h1 className="font-bold text-lg text-[#1C1917] dark:text-stone-100 tracking-tight">
						Taking new requests
					</h1>
					<p className="text-xs text-[#78716C] dark:text-stone-400">
						Two settings decide which requests reach you at all.
					</p>
				</div>

				{/* 3 Request mode cards */}
				<div className="space-y-2">
					<div className="text-xs text-[#78716C] dark:text-stone-400">
						When a request arrives
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{/* Review each */}
						<button
							type="button"
							onClick={() => setRequestMode("review")}
							className={cn(
								"rounded-2xl border p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
								requestMode === "review"
									? "bg-[#8B351F] text-white border-[#8B351F] shadow-xs"
									: "bg-white dark:bg-stone-900 border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-800"
							)}
						>
							<ClockCountdownIcon
								className={cn(
									"size-5",
									requestMode === "review" ? "text-white" : "text-[#78716C] dark:text-stone-400"
								)}
							/>
							<div>
								<div
									className={cn(
										"font-bold text-sm",
										requestMode === "review"
											? "text-white"
											: "text-[#1C1917] dark:text-stone-100"
									)}
								>
									Review each
								</div>
								<div
									className={cn(
										"text-xs",
										requestMode === "review"
											? "text-white/80"
											: "text-[#78716C] dark:text-stone-400"
									)}
								>
									You decide on every one
								</div>
							</div>
						</button>

						{/* Auto-accept (selected in screenshot) */}
						<button
							type="button"
							onClick={() => setRequestMode("auto")}
							className={cn(
								"rounded-2xl border p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
								requestMode === "auto"
									? "bg-[#8B351F] text-white border-[#8B351F] shadow-xs"
									: "bg-white dark:bg-stone-900 border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-800"
							)}
						>
							<LightningIcon
								weight="fill"
								className={cn(
									"size-5",
									requestMode === "auto" ? "text-white" : "text-[#78716C] dark:text-stone-400"
								)}
							/>
							<div>
								<div
									className={cn(
										"font-bold text-sm",
										requestMode === "auto"
											? "text-white"
											: "text-[#1C1917] dark:text-stone-100"
									)}
								>
									Auto-accept
								</div>
								<div
									className={cn(
										"text-xs",
										requestMode === "auto"
											? "text-white/80"
											: "text-[#78716C] dark:text-stone-400"
									)}
								>
									Booked without asking
								</div>
							</div>
						</button>

						{/* Not accepting */}
						<button
							type="button"
							onClick={() => setRequestMode("not_accepting")}
							className={cn(
								"rounded-2xl border p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
								requestMode === "not_accepting"
									? "bg-[#8B351F] text-white border-[#8B351F] shadow-xs"
									: "bg-white dark:bg-stone-900 border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-800"
							)}
						>
							<ProhibitIcon
								className={cn(
									"size-5",
									requestMode === "not_accepting"
										? "text-white"
										: "text-[#78716C] dark:text-stone-400"
								)}
							/>
							<div>
								<div
									className={cn(
										"font-bold text-sm",
										requestMode === "not_accepting"
											? "text-white"
											: "text-[#1C1917] dark:text-stone-100"
									)}
								>
									Not accepting
								</div>
								<div
									className={cn(
										"text-xs",
										requestMode === "not_accepting"
											? "text-white/80"
											: "text-[#78716C] dark:text-stone-400"
									)}
								>
									Hidden from hosts
								</div>
							</div>
						</button>
					</div>
				</div>

				{/* 48 hours notice row with toggle switch */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 p-4 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<CalendarBlankIcon className="size-5 text-[#78716C] dark:text-stone-400 shrink-0" />
						<div>
							<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
								Need at least 48 hours notice
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400">
								Hosts can book you for any date, including tomorrow.
							</div>
						</div>
					</div>

					{/* Switch */}
					<button
						type="button"
						role="switch"
						aria-checked={notice48h}
						onClick={() => setNotice48h(!notice48h)}
						className={cn(
							"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
							notice48h ? "bg-[#8B351F]" : "bg-[#E5E0D8] dark:bg-stone-700"
						)}
					>
						<span
							className={cn(
								"pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
								notice48h ? "translate-x-5" : "translate-x-0"
							)}
						/>
					</button>
				</div>

				{/* Info callout */}
				<div className="rounded-xl bg-[#FAF8F5] dark:bg-stone-850/80 border border-[#F5EBE1] dark:border-stone-800 px-4 py-3 flex items-center gap-2.5 text-xs text-[#8B351F] dark:text-amber-400">
					<InfoIcon className="size-4 shrink-0" />
					<span>
						Requests are accepted the moment they arrive, without asking you first.
					</span>
				</div>

				{/* Close individual dates */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 p-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-850/60 transition-colors cursor-pointer">
					<div className="flex items-center gap-3">
						<CalendarBlankIcon className="size-5 text-[#78716C] dark:text-stone-400 shrink-0" />
						<div>
							<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
								Close individual dates
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400">
								2 dates are closed to new requests
							</div>
						</div>
					</div>
					<CaretRightIcon className="size-4 text-[#78716C] dark:text-stone-400" />
				</div>
			</section>

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
						<span className="text-4xl sm:text-5xl font-bold tracking-tight">4</span>
						<span className="text-sm text-white/85 font-normal">requests</span>
					</div>
					<div className="flex items-center justify-between text-xs font-semibold text-white/95 border-t border-white/15 pt-3">
						<span>$2,417 still undecided</span>
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
							$198
						</div>
					</div>
					<div className="space-y-1 text-xs border-t border-[#F5F2EC] dark:border-stone-800 pt-3">
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>To collect in cash</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">
								$198
							</span>
						</div>
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>Already paid online</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">$0</span>
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
							$0
						</div>
					</div>
					<div className="space-y-1 text-xs border-t border-[#F5F2EC] dark:border-stone-800 pt-3">
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>Orders completed</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">0</span>
						</div>
						<div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
							<span>Next 7 days</span>
							<span className="font-bold text-[#1C1917] dark:text-stone-200">
								1 job · 18 guests
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
					<span className="inline-flex items-center rounded-full bg-[#E58325] px-2.5 py-0.5 text-xs font-semibold text-white shadow-2xs">
						Showing 2 of 4
					</span>
				</div>

				<div className="space-y-4">
					{dashboardRequests.map((req) => (
						<RequestCard
							key={req.id}
							request={req}
							onAccept={handleAccept}
							onReject={handleReject}
						/>
					))}
				</div>

				{/* See all 4 requests button */}
				<Link
					href="/provider/requests"
					className="w-full rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#8B351F] dark:text-amber-400 hover:bg-[#FAF8F5] dark:hover:bg-stone-850/60 transition-colors shadow-2xs cursor-pointer"
				>
					See all 4 requests →
				</Link>
			</section>

			{/* Active orders section */}
			<section className="space-y-3">
				<h2 className="font-bold text-base md:text-lg text-[#1C1917] dark:text-stone-100 tracking-tight">
					Active orders
				</h2>

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
			</section>
		</div>
	);
}
