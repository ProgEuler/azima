"use client";

import { useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/form-error";
import { useApi } from "@/hooks/use-api";
import { providerApi } from "@/lib/api/provider";
import { dateLabel } from "@/lib/format";

function today() {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Close single dates or a range to new requests, and re-open them. */
export function CloseDatesDialog({
	open,
	onOpenChange,
	onChanged,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Reports the new number of upcoming closed dates after each change. */
	onChanged?: (count: number) => void;
}) {
	const dates = useApi((signal) => (open ? providerApi.closeDates(signal) : Promise.resolve([])), [open]);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [reason, setReason] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<unknown>(null);

	async function refresh() {
		const fresh = await providerApi.closeDates();
		dates.setData(fresh);
		onChanged?.(fresh.length);
	}

	async function add() {
		if (!from) return;
		setBusy(true);
		setError(null);
		try {
			await providerApi.closeDate({ date_from: from, date_to: to || undefined, reason });
			setFrom("");
			setTo("");
			setReason("");
			await refresh();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	}

	async function reopen(id: string) {
		setError(null);
		try {
			await providerApi.reopenDate(id);
			await refresh();
		} catch (e) {
			setError(e);
		}
	}

	const list = dates.data ?? [];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md p-0 overflow-hidden">
				<DialogHeader className="px-6 pt-5 pb-2">
					<DialogTitle className="text-lg font-semibold">Close individual dates</DialogTitle>
					<DialogDescription>
						Hosts cannot request you for a closed date. Orders you already accepted are not affected.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 px-6 pb-6">
					<div className="grid grid-cols-2 gap-3">
						<Field label="From">
							<Input type="date" min={today()} value={from} onChange={(e) => setFrom(e.target.value)} />
						</Field>
						<Field label="To (optional)">
							<Input type="date" min={from || today()} value={to} onChange={(e) => setTo(e.target.value)} />
						</Field>
					</div>
					<Field label="Reason (optional)">
						<Input placeholder="Family wedding" value={reason} onChange={(e) => setReason(e.target.value)} />
					</Field>
					<Button type="button" disabled={!from || busy} onClick={() => void add()}>
						{busy ? "Closing…" : "Close these dates"}
					</Button>

					<FormError error={error} />

					<div className="space-y-1.5">
						<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
							Closed dates · {list.length}
						</div>
						{dates.loading && !dates.data ? (
							<p className="text-xs text-muted-foreground">Loading…</p>
						) : list.length === 0 ? (
							<p className="text-xs text-muted-foreground">Nothing is closed.</p>
						) : (
							<ul className="max-h-48 divide-y divide-[#F5F2EC] dark:divide-stone-800 overflow-y-auto rounded-xl border border-[#EFECE6] dark:border-stone-800">
								{list.map((d) => (
									<li key={d.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
										<span>
											<span className="font-semibold">{dateLabel(d.date)}</span>
											{d.reason ? <span className="text-muted-foreground"> · {d.reason}</span> : null}
										</span>
										<button
											type="button"
											onClick={() => void reopen(d.id)}
											aria-label={`Re-open ${dateLabel(d.date)}`}
											className="rounded-md p-1 text-muted-foreground hover:bg-[#FAF8F5] dark:hover:bg-stone-800 cursor-pointer"
										>
											<XIcon className="size-3.5" />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
