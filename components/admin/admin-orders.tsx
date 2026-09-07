"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

type OrderStatus =
	| "Contact confirmed"
	| "Awaiting response"
	| "Preparing"
	| "On the way"
	| "Accepted";

type WaitingOn =
	| "Host contacted"
	| "Waiting on caterer"
	| "In the kitchen"
	| "On the way"
	| "Caterer to call the host";

type OrderRow = {
	code: string;
	occasionTitle: string;
	occasionMeta: string;
	breadcrumb: string;
	imageSrc: string;
	total: string;
	totalNote: string;
	waitingOn: WaitingOn;
	status: OrderStatus;
	isRev?: boolean;
};

const ORDERS: OrderRow[] = [
	{
		code: "AZ-2418",
		occasionTitle: "Iftar Gathering",
		occasionMeta: "8 Sep 2026 · 6:30 PM · 35 guests",
		breadcrumb: "Iftar · Socart Catering",
		imageSrc: "/images/overview/birthday-dinner.jpg",
		total: "$560",
		totalNote: "Cash on delivery",
		waitingOn: "Host contacted",
		status: "Contact confirmed",
	},
	{
		code: "AZ-2431",
		occasionTitle: "Iftar Gathering",
		occasionMeta: "8 Sep 2026 · 6:30 PM · 35 guests",
		breadcrumb: "Iftar · Yummy Catering",
		imageSrc: "/images/overview/birthday-dinner.jpg",
		total: "$420",
		totalNote: "Cash on delivery",
		waitingOn: "Waiting on caterer",
		status: "Awaiting response",
	},
	{
		code: "AZ-2402",
		occasionTitle: "Team Lunch",
		occasionMeta: "31 Aug 2026 · 1:00 PM · 18 guests",
		breadcrumb: "Lunch · Sweet House",
		imageSrc: "/images/overview/team-lunch.jpg",
		total: "$144",
		totalNote: "Paid online",
		waitingOn: "In the kitchen",
		status: "Preparing",
		isRev: true,
	},
	{
		code: "AZ-2356",
		occasionTitle: "Team Lunch",
		occasionMeta: "31 Aug 2026 · 1:00 PM · 18 guests",
		breadcrumb: "Lunch · Yummy Catering",
		imageSrc: "/images/overview/team-lunch.jpg",
		total: "$198",
		totalNote: "Cash on delivery",
		waitingOn: "On the way",
		status: "On the way",
	},
	{
		code: "AZ-2377",
		occasionTitle: "Weekend Dinner",
		occasionMeta: "20 Sep 2026 · 8:00 PM · 60 guests",
		breadcrumb: "Dinner · Socart Catering",
		imageSrc: "/images/overview/birthday-dinner.jpg",
		total: "$1,470",
		totalNote: "Cash on delivery",
		waitingOn: "Caterer to call the host",
		status: "Accepted",
	},
	{
		code: "AZ-2444",
		occasionTitle: "Corporate Breakfast",
		occasionMeta: "2 Sep 2026 · 9:00 AM · 45 guests",
		breadcrumb: "Breakfast · Yummy Catering",
		imageSrc: "/images/overview/corporate-breakfast.jpg",
		total: "$315",
		totalNote: "Cash on delivery",
		waitingOn: "Waiting on caterer",
		status: "Awaiting response",
	},
	{
		code: "AZ-2451",
		occasionTitle: "Weekend Dinner",
		occasionMeta: "20 Sep 2026 · 8:00 PM · 60 guests",
		breadcrumb: "Dinner · Yummy Catering",
		imageSrc: "/images/overview/birthday-dinner.jpg",
		total: "$1,440",
		totalNote: "Paid online",
		waitingOn: "Waiting on caterer",
		status: "Awaiting response",
	},
	{
		code: "AZ-2455",
		occasionTitle: "Sunday Family Lunch",
		occasionMeta: "11 Sep 2026 · 1:30 PM · 22 guests",
		breadcrumb: "Lunch · Yummy Catering",
		imageSrc: "/images/overview/team-lunch.jpg",
		total: "$242",
		totalNote: "Cash on delivery",
		waitingOn: "Waiting on caterer",
		status: "Awaiting response",
	},
];

type TabId = "all" | "awaiting" | "in_progress" | "delivered" | "declined";

const TABS: { id: TabId; label: string; count: number }[] = [
	{ id: "all", label: "All", count: 10 },
	{ id: "awaiting", label: "Awaiting reply", count: 4 },
	{ id: "in_progress", label: "In progress", count: 4 },
	{ id: "delivered", label: "Delivered", count: 1 },
	{ id: "declined", label: "Declined or cancelled", count: 1 },
];

function StatusPill({ status }: { status: OrderStatus }) {
	const styles: Record<OrderStatus, string> = {
		"Awaiting response":
			"bg-[#FCF4E7] dark:bg-amber-950/50 text-[#915B1E] dark:text-amber-300",
		"On the way":
			"bg-[#EAF5EC] dark:bg-emerald-950/50 text-[#2D6A42] dark:text-emerald-300",
		"Contact confirmed":
			"bg-[#F3F0EC] dark:bg-stone-800 text-[#666059] dark:text-stone-300",
		Preparing:
			"bg-[#F3F0EC] dark:bg-stone-800 text-[#666059] dark:text-stone-300",
		Accepted:
			"bg-[#F3F0EC] dark:bg-stone-800 text-[#666059] dark:text-stone-300",
	};
	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
		>
			{status}
		</span>
	);
}

function WaitingOnCell({ value }: { value: WaitingOn }) {
	let className = "text-[#78716C] dark:text-stone-400";
	if (value === "On the way" || value === "In the kitchen") {
		className = "text-[#2D6A42] dark:text-emerald-400";
	} else if (
		value === "Host contacted" ||
		value === "Waiting on caterer"
	) {
		className = "text-[#915B1E] dark:text-amber-400";
	}
	return <span className={`text-xs sm:text-sm font-medium ${className}`}>{value}</span>;
}

export function AdminOrders() {
	const [activeTab, setActiveTab] = useState<TabId>("all");

	return (
		<div className="mx-auto w-full max-w-5xl space-y-4 pb-16 font-sans">
			{/* Search */}
			<div className="relative">
				<MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#78716C]" />
				<input
					type="text"
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
								{tab.count}
							</span>
						</button>
					);
				})}
			</div>

			{/* Filter chip */}
			<div>
				<button
					type="button"
					className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] dark:bg-stone-900/60 border border-[#EFECE6] dark:border-stone-800 px-3.5 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-stone-200 hover:bg-[#F5F2EC] dark:hover:bg-stone-800 transition-colors"
				>
					Still open
					<CaretDownIcon className="size-3.5" />
				</button>
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
					{ORDERS.map((row) => {
						const href = `/admin/orders/${row.code.replace(/-/g, "")}`;
						return (
							<Link
								key={row.code}
								href={href}
								className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-4 px-5 py-4 hover:bg-[#FAF8F5]/60 dark:hover:bg-stone-800/40 transition-colors items-center"
							>
								{/* Order: thumbnail + code + breadcrumb */}
								<div className="flex items-center gap-3">
									<div className="relative size-11 shrink-0 rounded-lg overflow-hidden border border-[#EFECE6] dark:border-stone-700 bg-stone-100 shadow-2xs">
										<Image
											src={row.imageSrc}
											alt={row.occasionTitle}
											fill
											className="object-cover"
											sizes="44px"
										/>
									</div>
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
									<WaitingOnCell value={row.waitingOn} />
								</div>

								{/* Status */}
								<div>
									<StatusPill status={row.status} />
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
