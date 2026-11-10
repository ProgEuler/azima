"use client";

import {
	PaperPlaneTiltIcon,
	WarningIcon,
	ChatCircleIcon,
	CaretRightIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { QueryState } from "@/components/form-error";
import { useApi } from "@/hooks/use-api";
import { adminApi, type DeliveryItem, type NotificationDelivery } from "@/lib/api/admin";
import { ago } from "@/lib/format";

type Segment = {
	label: string;
	value: number;
	color: string; // bg color
	dotColor: string; // legend dot
};

function buildSegments(summary: NotificationDelivery["summary"]): Segment[] {
	return [
		{ label: "First try", value: summary.first_try, color: "bg-[#2D6A42]", dotColor: "bg-[#2D6A42]" },
		{ label: "Needed back-up", value: summary.backup, color: "bg-[#EAB308]", dotColor: "bg-[#EAB308]" },
		{ label: "Never arrived", value: summary.failed, color: "bg-[#B83E28]", dotColor: "bg-[#B83E28]" },
		{ label: "Still sending", value: summary.sending, color: "bg-[#C7C2BB]", dotColor: "bg-[#C7C2BB]" },
	];
}

type AlertRow = {
	icon: React.ReactNode;
	iconClassName: string;
	title: string;
	subtitle?: string;
	recipient: { name: string; role: string };
	deliveryStatus: { text: string; tone: "red" | "amber" | "neutral" };
};

function ProgressBar({ segments }: { segments: Segment[] }) {
	const TOTAL = segments.reduce((sum, s) => sum + s.value, 0);
	return (
		<div className="flex h-2 w-full overflow-hidden rounded-full bg-[#EFECE6] dark:bg-stone-800">
			{segments.map((seg, i) => {
				if (seg.value === 0) return null;
				const widthPct = (seg.value / TOTAL) * 100;
				return (
					<div
						key={seg.label}
						className={cn(seg.color, i === 0 && "rounded-l-full", i === segments.length - 1 && "rounded-r-full")}
						style={{ width: `${widthPct}%` }}
						aria-label={`${seg.label}: ${seg.value}`}
					/>
				);
			})}
		</div>
	);
}

function Legend({ segments }: { segments: Segment[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
			{segments.map((seg) => (
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

const CHANNEL_LABEL = { push: "push notification", whatsapp: "WhatsApp message", sms: "SMS" } as const;

function list(items: string[]): string {
	if (items.length <= 1) return items.join("");
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Describe what happened across the channel attempts, in plain words. */
function describe(item: DeliveryItem): AlertRow["deliveryStatus"] {
	const failed = item.attempts.filter((a) => a.status === "failed").map((a) => CHANNEL_LABEL[a.channel]);
	const delivered = item.attempts.find((a) => a.status === "delivered");
	const when = ago(item.created_at);
	if (item.delivery_state === "failed") {
		const verb = failed.length === 1 ? "failed" : failed.length === 2 ? "both failed" : "all failed";
		return { text: `${list(failed)} ${verb} · ${when}`, tone: "red" };
	}
	if (item.delivery_state === "backup" && delivered) {
		return {
			text: `${list(failed)} failed, ${CHANNEL_LABEL[delivered.channel]} got through · ${when}`,
			tone: "amber",
		};
	}
	const last = item.attempts[item.attempts.length - 1];
	return { text: `Sent as ${last ? `a ${CHANNEL_LABEL[last.channel]}` : "an alert"} · ${when}`, tone: "neutral" };
}

function toRow(item: DeliveryItem, kind: "never" | "backup" | "sending"): AlertRow {
	const icon = {
		never: { node: <WarningIcon weight="fill" />, cls: "text-[#B83E28] dark:text-red-400" },
		backup: { node: <ChatCircleIcon weight="fill" />, cls: "text-[#915B1E] dark:text-amber-400" },
		sending: { node: <PaperPlaneTiltIcon weight="fill" />, cls: "text-[#78716C] dark:text-stone-400" },
	}[kind];
	return {
		icon: icon.node,
		iconClassName: icon.cls,
		title: item.title,
		subtitle: item.body || undefined,
		recipient: item.recipient,
		deliveryStatus: describe(item),
	};
}

export function AdminNotifications() {
	const report = useApi((signal) => adminApi.notificationDelivery(7, signal), []);
	const data = report.data;

	if (!data) {
		return (
			<div className="mx-auto w-full max-w-5xl">
				<QueryState loading={report.loading} error={report.error} onRetry={report.reload} label="Loading delivery report…" />
			</div>
		);
	}

	const segments = buildSegments(data.summary);
	const settled = data.summary.first_try + data.summary.backup + data.summary.failed;
	const reached = data.summary.first_try + data.summary.backup;
	const NEVER_ARRIVED = data.never_arrived.map((i) => toRow(i, "never"));
	const NEEDED_BACKUP = data.needed_backup.map((i) => toRow(i, "backup"));
	const STILL_SENDING = data.still_sending.map((i) => toRow(i, "sending"));

	return (
		<div className="mx-auto w-full max-w-5xl space-y-4 pb-16 font-sans">
			{/* Summary card */}
			<section className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-5">
				<div className="space-y-2">
					<div className="text-[11px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
						Alerts sent by azima · last {data.days} days
					</div>
					<h1 className="font-bold text-2xl sm:text-[28px] tracking-tight text-[#1C1917] dark:text-stone-50">
						{data.summary.total === 0
							? "No alerts were sent in the last 7 days"
							: `${reached} of ${settled} reached the person`}
					</h1>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400 max-w-2xl leading-relaxed">
						Every alert goes out on one channel with a back-up behind it. If the first attempt does not land, azima re-sends over WhatsApp, then SMS.
					</p>
				</div>

				<ProgressBar segments={segments} />
				<Legend segments={segments} />
			</section>

			{/* Never arrived — red */}
			{NEVER_ARRIVED.length > 0 ? <section className="rounded-2xl border border-[#F5C6B5] dark:border-red-900/60 bg-[#FDF3EE] dark:bg-red-950/20 p-5 sm:p-6 space-y-4">
				<header className="space-y-1">
					<h2 className="font-bold text-base sm:text-lg text-[#1C1917] dark:text-stone-100">
						Never arrived{" "}
						<span className="text-[#78716C] dark:text-stone-400 font-semibold">
							· {NEVER_ARRIVED.length}
						</span>
					</h2>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400">
						Nobody was told. If it was a request, the caterer does not know it exists.
					</p>
				</header>
				{NEVER_ARRIVED.map((row, i) => (
					<AlertCard key={i} row={row} />
				))}
			</section> : null}

			{/* Needed WhatsApp back-up — amber */}
			{NEEDED_BACKUP.length > 0 ? <section className="rounded-2xl border border-[#F2DDA8] dark:border-amber-900/60 bg-[#FDF7E6] dark:bg-amber-950/20 p-5 sm:p-6 space-y-4">
				<header className="space-y-1">
					<h2 className="font-bold text-base sm:text-lg text-[#1C1917] dark:text-stone-100">
						Needed a back-up channel{" "}
						<span className="text-[#78716C] dark:text-stone-400 font-semibold">
							· {NEEDED_BACKUP.length}
						</span>
					</h2>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400">
						These did reach the person, but not on the first attempt.
					</p>
				</header>
				{NEEDED_BACKUP.map((row, i) => (
					<AlertCard key={i} row={row} />
				))}
			</section> : null}

			{/* Still sending — neutral */}
			{STILL_SENDING.length > 0 ? <section className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 space-y-4">
				<header className="space-y-1">
					<h2 className="font-bold text-base sm:text-lg text-[#1C1917] dark:text-stone-100">
						Still sending{" "}
						<span className="text-[#78716C] dark:text-stone-400 font-semibold">
							· {STILL_SENDING.length}
						</span>
					</h2>
					<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-400">
						Not yet confirmed as delivered. Check back shortly.
					</p>
				</header>
				{STILL_SENDING.map((row, i) => (
					<AlertCard key={i} row={row} />
				))}
			</section> : null}
		</div>
	);
}
