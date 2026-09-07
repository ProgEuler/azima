"use client";

import {
	PaperPlaneTiltIcon,
	WarningIcon,
	ChatCircleIcon,
	CaretRightIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Segment = {
	label: string;
	value: number;
	color: string; // bg color
	dotColor: string; // legend dot
};

const SEGMENTS: Segment[] = [
	{ label: "First try", value: 3, color: "bg-[#2D6A42]", dotColor: "bg-[#2D6A42]" },
	{ label: "Needed back-up", value: 1, color: "bg-[#EAB308]", dotColor: "bg-[#EAB308]" },
	{ label: "Never arrived", value: 1, color: "bg-[#B83E28]", dotColor: "bg-[#B83E28]" },
	{ label: "Still sending", value: 1, color: "bg-[#C7C2BB]", dotColor: "bg-[#C7C2BB]" },
];

const TOTAL = SEGMENTS.reduce((sum, s) => sum + s.value, 0);

type AlertRow = {
	icon: React.ReactNode;
	iconClassName: string;
	title: string;
	subtitle?: string;
	recipient: { name: string; role: string };
	deliveryStatus: { text: string; tone: "red" | "amber" | "neutral" };
};

const NEVER_ARRIVED: AlertRow[] = [
	{
		icon: <WarningIcon weight="fill" />,
		iconClassName: "text-[#B83E28] dark:text-red-400",
		title: "Order AZ-2402 was edited",
		subtitle: "Guest count changed from 15 to 18",
		recipient: { name: "Sweet House", role: "Caterer" },
		deliveryStatus: {
			text: "push notification and WhatsApp message both failed · 3d ago",
			tone: "red",
		},
	},
];

const NEEDED_BACKUP: AlertRow[] = [
	{
		icon: <ChatCircleIcon weight="fill" />,
		iconClassName: "text-[#915B1E] dark:text-amber-400",
		title: "New request — Iftar Gathering",
		subtitle: "35 guests · Shish taouk platter · needs your response",
		recipient: { name: "Yummy Catering", role: "Caterer" },
		deliveryStatus: {
			text: "push notification failed, WhatsApp message got through · 35m ago",
			tone: "amber",
		},
	},
];

const STILL_SENDING: AlertRow[] = [
	{
		icon: <PaperPlaneTiltIcon weight="fill" />,
		iconClassName: "text-[#78716C] dark:text-stone-400",
		title: "A request is still waiting on you",
		subtitle: "Layla Karam is waiting on your answer for Corporate Breakfast",
		recipient: { name: "Yummy Catering", role: "Caterer" },
		deliveryStatus: {
			text: "Sent as a SMS · 2h ago",
			tone: "neutral",
		},
	},
];

function ProgressBar() {
	return (
		<div className="flex h-2 w-full overflow-hidden rounded-full bg-[#EFECE6] dark:bg-stone-800">
			{SEGMENTS.map((seg, i) => {
				const widthPct = (seg.value / TOTAL) * 100;
				return (
					<div
						key={seg.label}
						className={cn(seg.color, i === 0 && "rounded-l-full", i === SEGMENTS.length - 1 && "rounded-r-full")}
						style={{ width: `${widthPct}%` }}
						aria-label={`${seg.label}: ${seg.value}`}
					/>
				);
			})}
		</div>
	);
}

function Legend() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
			{SEGMENTS.map((seg) => (
				<div key={seg.label} className="space-y-1">
					<div className="flex items-center gap-1.5">
						<span className={cn("size-2 rounded-full", seg.dotColor)} />
						<span className="text-xs font-medium text-[#78716C] dark:text-stone-400">
							{seg.label}
						</span>
					</div>
					<div className="font-bold text-2xl tracking-tight text-[#1C1917] dark:text-stone-50">
						{seg.value}
					</div>
				</div>
			))}
		</div>
	);
}

function DeliveryStatusText({ status }: { status: AlertRow["deliveryStatus"] }) {
	const className = {
		red: "text-[#B83E28] dark:text-red-400",
		amber: "text-[#915B1E] dark:text-amber-400",
		neutral: "text-[#78716C] dark:text-stone-400",
	}[status.tone];
	return (
		<p className={cn("text-xs font-semibold mt-2.5", className)}>
			{status.text}
		</p>
	);
}

function AlertCard({ row }: { row: AlertRow }) {
	return (
		<div className="bg-white dark:bg-stone-900/60 rounded-xl border border-[#EFECE6] dark:border-stone-800 p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex items-start gap-3.5 cursor-pointer hover:bg-[#FAF8F5]/40 dark:hover:bg-stone-800/40 transition-colors">
			<div className={cn("shrink-0 mt-0.5 size-5 flex items-center justify-center", row.iconClassName)}>
				{row.icon}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-3">
					<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
						{row.title}
					</div>
					<CaretRightIcon className="size-4 text-[#A8A29E] shrink-0 mt-0.5" />
				</div>
				{row.subtitle ? (
					<p className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400 mt-1 leading-relaxed">
						{row.subtitle}
					</p>
				) : null}
				<p className="text-xs text-[#78716C] dark:text-stone-400 mt-2">
					<span className="font-medium text-[#1C1917] dark:text-stone-200">
						To {row.recipient.name}
					</span>{" "}
					· {row.recipient.role}
				</p>
				<DeliveryStatusText status={row.deliveryStatus} />
			</div>
		</div>
	);
}

export function AdminNotifications() {
	return (
		<div className="mx-auto w-full max-w-5xl space-y-4 pb-16 font-sans">
			{/* Summary card */}
			<section className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-5">
				<div className="space-y-2">
					<div className="text-[11px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
						Alerts sent by azima
					</div>
					<h1 className="font-bold text-2xl sm:text-[28px] tracking-tight text-[#1C1917] dark:text-stone-50">
						4 of 6 reached the person
					</h1>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400 max-w-2xl leading-relaxed">
						Every alert goes out on one channel with a back-up behind it. If the first attempt does not land, azima re-sends over WhatsApp, then SMS.
					</p>
				</div>

				<ProgressBar />
				<Legend />
			</section>

			{/* Never arrived — red */}
			<section className="rounded-2xl border border-[#F5C6B5] dark:border-red-900/60 bg-[#FDF3EE] dark:bg-red-950/20 p-5 sm:p-6 space-y-4">
				<header className="space-y-1">
					<h2 className="font-bold text-base sm:text-lg text-[#1C1917] dark:text-stone-100">
						Never arrived{" "}
						<span className="text-[#78716C] dark:text-stone-400 font-semibold">
							· 1
						</span>
					</h2>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400">
						Nobody was told. If it was a request, the caterer does not know it exists.
					</p>
				</header>
				{NEVER_ARRIVED.map((row, i) => (
					<AlertCard key={i} row={row} />
				))}
			</section>

			{/* Needed WhatsApp back-up — amber */}
			<section className="rounded-2xl border border-[#F2DDA8] dark:border-amber-900/60 bg-[#FDF7E6] dark:bg-amber-950/20 p-5 sm:p-6 space-y-4">
				<header className="space-y-1">
					<h2 className="font-bold text-base sm:text-lg text-[#1C1917] dark:text-stone-100">
						Needed the WhatsApp back-up{" "}
						<span className="text-[#78716C] dark:text-stone-400 font-semibold">
							· 1
						</span>
					</h2>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400">
						These did reach the person, but only on the second attempt.
					</p>
				</header>
				{NEEDED_BACKUP.map((row, i) => (
					<AlertCard key={i} row={row} />
				))}
			</section>

			{/* Still sending — neutral */}
			<section className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 space-y-4">
				<header className="space-y-1">
					<h2 className="font-bold text-base sm:text-lg text-[#1C1917] dark:text-stone-100">
						Still sending{" "}
						<span className="text-[#78716C] dark:text-stone-400 font-semibold">
							· 1
						</span>
					</h2>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400">
						Not yet confirmed as delivered. Check back shortly.
					</p>
				</header>
				{STILL_SENDING.map((row, i) => (
					<AlertCard key={i} row={row} />
				))}
			</section>
		</div>
	);
}
