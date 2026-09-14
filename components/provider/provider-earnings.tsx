"use client";

import { useState } from "react";
import { CreditCardIcon, WalletIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
	PROVIDER_EARNINGS,
	type EarningsJob,
	type EarningsJobMethod,
} from "@/components/provider/provider-mock-data";

const METHOD_LABEL_STYLES: Record<EarningsJobMethod, string> = {
	"Cash collected": "text-[#915B1E] dark:text-amber-400",
	"Paid online": "text-emerald-600 dark:text-emerald-400",
};

export function ProviderEarnings() {
	const [activeMonthIndex, setActiveMonthIndex] = useState(0);
	const activeMonth = PROVIDER_EARNINGS[activeMonthIndex];

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-16 font-sans">
			<SectionHeader
				title="What you have earned"
				description="Only delivered jobs count here. Cash is money you collected on the day; online was settled when the host paid at checkout."
			/>

			<div className="flex flex-wrap gap-2">
				{PROVIDER_EARNINGS.map((month, index) => {
					const isActive = index === activeMonthIndex;
					return (
						<button
							key={month.id}
							type="button"
							onClick={() => setActiveMonthIndex(index)}
							className={`inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
								isActive
									? "bg-[#8B351F] text-white shadow-2xs"
									: "bg-[#FAF8F5] dark:bg-stone-900/60 text-[#1C1917] dark:text-stone-200 border border-[#EFECE6] dark:border-stone-800 hover:bg-[#F5F2EC] dark:hover:bg-stone-800"
							}`}
						>
							{month.label}
						</button>
					);
				})}
			</div>

			<Card size="sm" className="rounded-2xl border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60">
				<CardContent>
					<div className="text-sm text-muted-foreground">{activeMonth.monthLabel}</div>
					<div className="mt-1 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1C1917] dark:text-stone-100">
						{activeMonth.total}
					</div>
					<div className="mt-1 text-sm text-muted-foreground">
						{activeMonth.jobsDelivered} jobs delivered
					</div>

					<div className="mt-5 grid gap-3 sm:grid-cols-2">
						<div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800/40 px-4 py-3">
							<WalletIcon className="size-5 text-[#78716C] dark:text-stone-400 shrink-0" />
							<div>
								<div className="text-xs text-muted-foreground">Collected in cash</div>
								<div className="mt-0.5 font-heading text-lg font-semibold text-[#1C1917] dark:text-stone-100">
									{activeMonth.cashAmount}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800/40 px-4 py-3">
							<CreditCardIcon className="size-5 text-[#78716C] dark:text-stone-400 shrink-0" />
							<div>
								<div className="text-xs text-muted-foreground">Paid online</div>
								<div className="mt-0.5 font-heading text-lg font-semibold text-[#1C1917] dark:text-stone-100">
									{activeMonth.onlineAmount}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div>
				<h2 className="font-heading text-base font-semibold text-[#1C1917] dark:text-stone-100">
					Jobs in {activeMonth.monthLabel}
				</h2>

				{activeMonth.jobs.length === 0 ? (
					<div className="mt-3">
						<EmptyState
							title={`No delivered jobs in ${activeMonth.monthLabel} yet.`}
							description="Delivered jobs appear here once you mark them complete on the day."
						/>
					</div>
				) : (
					<div className="mt-3 space-y-3">
						{activeMonth.jobs.map((job: EarningsJob) => (
							<div
								key={job.code}
								className="flex items-center gap-4 rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] px-4 sm:px-5 py-4"
							>
								<div className="size-12 shrink-0 rounded-xl bg-[#EFECE6] dark:bg-stone-800" />
								<div className="min-w-0 flex-1">
									<div className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
										{job.title}
									</div>
									<div className="mt-0.5 text-xs text-muted-foreground">
										{job.date} · {job.guests} · {job.code}
									</div>
								</div>
								<div className="text-right shrink-0">
									<div className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
										{job.amount}
									</div>
									<div className={`mt-0.5 text-xs font-medium ${METHOD_LABEL_STYLES[job.method]}`}>
										{job.method}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
