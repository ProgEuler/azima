"use client";

import { useState } from "react";
import {
	CalendarBlankIcon,
	CaretRightIcon,
	ClockCountdownIcon,
	InfoIcon,
	LightningIcon,
	ProhibitIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FormError } from "@/components/form-error";
import { CloseDatesDialog } from "@/components/provider/close-dates-dialog";
import type { NoticePeriod, RequestMode } from "@/lib/api/admin";
import { providerApi } from "@/lib/api/provider";

const MODE_NOTE: Record<RequestMode, string> = {
	review: "You decide on every request. Hosts wait for your reply.",
	auto: "Requests are accepted the moment they arrive, without asking you first.",
	not_accepting: "You are hidden from hosts until you start accepting requests again.",
};

/** "Taking new requests": how requests reach the caterer and which dates are closed. */
export function RequestSettings({
	initialMode,
	initialNotice,
	closedDatesCount,
	onChanged,
}: {
	initialMode: RequestMode;
	initialNotice: NoticePeriod;
	closedDatesCount: number;
	onChanged?: () => void;
}) {
	const [mode, setMode] = useState<RequestMode>(initialMode);
	const [notice48h, setNotice48h] = useState(initialNotice === "at_least_48_hours");
	const [closedCount, setClosedCount] = useState(closedDatesCount);
	const [datesOpen, setDatesOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<unknown>(null);

	async function save(update: Parameters<typeof providerApi.updateProfile>[0], rollback: () => void) {
		setSaving(true);
		setError(null);
		try {
			await providerApi.updateProfile(update);
			onChanged?.();
		} catch (e) {
			rollback();
			setError(e);
		} finally {
			setSaving(false);
		}
	}

	function changeMode(next: RequestMode) {
		if (next === mode || saving) return;
		const previous = mode;
		setMode(next);
		void save({ request_mode: next }, () => setMode(previous));
	}

	async function changeNotice(next: boolean) {
		const previous = notice48h;
		setNotice48h(next);
		await save({ order_notice_period: next ? "at_least_48_hours" : "instant" }, () => setNotice48h(previous));
	}

	return (
		<>
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
						onClick={() => changeMode("review")}
						className={cn(
							"rounded-2xl border p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
							mode === "review"
								? "bg-[#8B351F] text-white border-[#8B351F] shadow-xs"
								: "bg-white dark:bg-stone-900 border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-800"
						)}
					>
						<ClockCountdownIcon
							className={cn(
								"size-5",
								mode === "review" ? "text-white" : "text-[#78716C] dark:text-stone-400"
							)}
						/>
						<div>
							<div
								className={cn(
									"font-bold text-sm",
									mode === "review"
										? "text-white"
										: "text-[#1C1917] dark:text-stone-100"
								)}
							>
								Review each
							</div>
							<div
								className={cn(
									"text-xs",
									mode === "review"
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
						onClick={() => changeMode("auto")}
						className={cn(
							"rounded-2xl border p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
							mode === "auto"
								? "bg-[#8B351F] text-white border-[#8B351F] shadow-xs"
								: "bg-white dark:bg-stone-900 border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-800"
						)}
					>
						<LightningIcon
							weight="fill"
							className={cn(
								"size-5",
								mode === "auto" ? "text-white" : "text-[#78716C] dark:text-stone-400"
							)}
						/>
						<div>
							<div
								className={cn(
									"font-bold text-sm",
									mode === "auto"
										? "text-white"
										: "text-[#1C1917] dark:text-stone-100"
								)}
							>
								Auto-accept
							</div>
							<div
								className={cn(
									"text-xs",
									mode === "auto"
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
						onClick={() => changeMode("not_accepting")}
						className={cn(
							"rounded-2xl border p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
							mode === "not_accepting"
								? "bg-[#8B351F] text-white border-[#8B351F] shadow-xs"
								: "bg-white dark:bg-stone-900 border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-800"
						)}
					>
						<ProhibitIcon
							className={cn(
								"size-5",
								mode === "not_accepting"
									? "text-white"
									: "text-[#78716C] dark:text-stone-400"
							)}
						/>
						<div>
							<div
								className={cn(
									"font-bold text-sm",
									mode === "not_accepting"
										? "text-white"
										: "text-[#1C1917] dark:text-stone-100"
								)}
							>
								Not accepting
							</div>
							<div
								className={cn(
									"text-xs",
									mode === "not_accepting"
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
							{notice48h
										? "Hosts must book you at least 48 hours ahead."
										: "Hosts can book you for any date, including tomorrow."}
						</div>
					</div>
				</div>

				{/* Switch */}
				<button
					type="button"
					role="switch"
					aria-checked={notice48h}
					disabled={saving}
					onClick={() => void changeNotice(!notice48h)}
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
				<span>{MODE_NOTE[mode]}</span>
			</div>

			{/* Close individual dates */}
			<div
				role="button"
				tabIndex={0}
				onClick={() => setDatesOpen(true)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") setDatesOpen(true);
				}}
				className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 p-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-850/60 transition-colors cursor-pointer"
			>
				<div className="flex items-center gap-3">
					<CalendarBlankIcon className="size-5 text-[#78716C] dark:text-stone-400 shrink-0" />
					<div>
						<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
							Close individual dates
						</div>
						<div className="text-xs text-[#78716C] dark:text-stone-400">
							{closedCount === 0
									? "No dates are closed to new requests"
									: `${closedCount} ${closedCount === 1 ? "date is" : "dates are"} closed to new requests`}
						</div>
					</div>
				</div>
				<CaretRightIcon className="size-4 text-[#78716C] dark:text-stone-400" />
			</div>
		</section>

			<FormError error={error} />
			<CloseDatesDialog
				open={datesOpen}
				onOpenChange={setDatesOpen}
				onChanged={(count) => {
					setClosedCount(count);
					onChanged?.();
				}}
			/>
		</>
	);
}
