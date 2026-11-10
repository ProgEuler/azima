"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormError } from "@/components/form-error";
import type { RequestView } from "@/lib/provider-orders";

type TotalParts = {
	amount: string;
	suffix?: string;
};

function splitTotal(total: string): TotalParts {
	const match = total.match(/^(.+?)\s+(\bin cash\b|\bpaid online\b.*)$/);
	if (match) {
		return { amount: match[1], suffix: match[2] };
	}
	return { amount: total };
}

type DetailRow = {
	key: "dateTime" | "guests" | "delivery";
	label: string;
	render?: (value: string) => string;
};

const DETAIL_ROWS: DetailRow[] = [
	{ key: "dateTime", label: "Date & time" },
	{ key: "guests", label: "Guests", render: (value) => value.replace(/\s+to cook for$/, "") },
	{ key: "delivery", label: "Delivery" },
];

export function AcceptRequestDialog({
	open,
	onOpenChange,
	request,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: RequestView | null;
	onConfirm: (id: string) => Promise<void>;
}) {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<unknown>(null);
	const totalParts = request ? splitTotal(request.total) : null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md p-0 overflow-hidden">
				<DialogHeader className="px-6 pt-5 pb-3">
					<DialogTitle className="text-lg font-semibold">
						Accept this request?
					</DialogTitle>
					<DialogDescription>
						The host is told immediately, and you call them to confirm the details.
					</DialogDescription>
				</DialogHeader>

				{request ? (
					<div className="mx-6 mb-6 rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-800/40 px-5 py-2 divide-y divide-[#EFECE6] dark:divide-stone-700/50">
						{DETAIL_ROWS.map((row) => {
							const raw = request[row.key] as string;
							const display = row.render ? row.render(raw) : raw;
							return (
								<div
									key={row.key}
									className="flex items-center justify-between gap-4 py-3"
								>
									<span className="text-sm font-medium text-[#78716C] dark:text-stone-400">
										{row.label}
									</span>
									<span className="text-sm font-semibold text-[#1C1917] dark:text-stone-100 text-right">
										{display}
									</span>
								</div>
							);
						})}
						<div className="flex items-baseline justify-between gap-4 py-3">
							<span className="text-sm font-medium text-[#78716C] dark:text-stone-400">
								Total
							</span>
							<div className="text-right">
								<span className="font-heading text-base font-semibold text-[#1C1917] dark:text-stone-100">
									{totalParts?.amount}
								</span>
								{totalParts?.suffix ? (
									<span className="ml-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
										{totalParts.suffix}
									</span>
								) : null}
							</div>
						</div>
					</div>
				) : null}

				{error ? (
					<div className="px-6 pb-3">
						<FormError error={error} />
					</div>
				) : null}

				<div className="flex items-center gap-2 px-6 pb-6">
					<Button
						type="button"
						className="bg-[#8B351F] hover:bg-[#722A18] text-white"
						disabled={!request || busy}
						onClick={async () => {
							if (!request) return;
							setBusy(true);
							setError(null);
							try {
								await onConfirm(request.id);
								onOpenChange(false);
							} catch (e) {
								setError(e);
							} finally {
								setBusy(false);
							}
						}}
					>
						{busy ? "Accepting…" : "Yes, accept"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Not yet
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
