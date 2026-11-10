"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FormError } from "@/components/form-error";
import { adminApi, type PendingApplication } from "@/lib/api/admin";
import { dateLabel, guestRange, joinParts, servicesLabel } from "@/lib/format";

/** Approve or reject a caterer application (a rejection needs a reason). */
export function ReviewApplicationDialog({
	application,
	onOpenChange,
	onDone,
}: {
	application: PendingApplication | null;
	onOpenChange: (open: boolean) => void;
	onDone: () => void;
}) {
	const [rejecting, setRejecting] = useState(false);
	const [reason, setReason] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const close = (open: boolean) => {
		if (!open) {
			setRejecting(false);
			setReason("");
			setError(null);
		}
		onOpenChange(open);
	};

	const run = async (action: () => Promise<unknown>) => {
		setBusy(true);
		setError(null);
		try {
			await action();
			close(false);
			onDone();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	if (!application) return null;

	return (
		<Dialog open onOpenChange={close}>
			<DialogContent showCloseButton={false} className="sm:max-w-md rounded-3xl">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl text-[#1C1917] dark:text-stone-100">
						{application.business_name}
					</DialogTitle>
					<DialogDescription className="text-sm text-[#78716C] dark:text-stone-400">
						{joinParts([
							servicesLabel(application.service_types),
							application.city,
							application.phone,
						])}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2 text-sm text-[#57524D] dark:text-stone-300">
					{application.description ? <p>{application.description}</p> : null}
					<p className="text-xs text-[#78716C] dark:text-stone-400">
						Takes {guestRange(application.smallest_order, application.largest_order)} ·{" "}
						{application.order_notice_period === "instant" ? "any date" : "48h notice"} ·
						applied {dateLabel(application.created_at)}
					</p>
					{application.email ? (
						<p className="text-xs text-[#78716C] dark:text-stone-400">
							{application.email}
						</p>
					) : null}
				</div>

				{rejecting ? (
					<textarea
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Why is this application being declined? The applicant will see it."
						rows={3}
						autoFocus
						className="w-full rounded-2xl border border-[#EFECE6] dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-700"
					/>
				) : null}

				<FormError error={error} />

				<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
					<button
						type="button"
						onClick={() => (rejecting ? setRejecting(false) : close(false))}
						className="rounded-2xl border border-[#EFECE6] dark:border-stone-700 bg-white dark:bg-stone-900 px-5 py-2.5 text-sm font-semibold text-[#1C1917] dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
					>
						{rejecting ? "Back" : "Close"}
					</button>
					{rejecting ? (
						<button
							type="button"
							disabled={busy || !reason.trim()}
							onClick={() =>
								run(() => adminApi.rejectApplication(application.id, reason.trim()))
							}
							className="rounded-2xl border border-[#F4C7BF] bg-white dark:bg-stone-900 px-5 py-2.5 text-sm font-semibold text-[#C84F38] hover:bg-[#FDF2F0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							{busy ? "Declining…" : "Decline application"}
						</button>
					) : (
						<>
							<button
								type="button"
								onClick={() => setRejecting(true)}
								className="rounded-2xl border border-[#F4C7BF] bg-white dark:bg-stone-900 px-5 py-2.5 text-sm font-semibold text-[#C84F38] hover:bg-[#FDF2F0] cursor-pointer"
							>
								Decline
							</button>
							<button
								type="button"
								disabled={busy}
								onClick={() => run(() => adminApi.approveApplication(application.id))}
								className="rounded-2xl bg-[#8B351F] hover:bg-[#732915] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
							>
								{busy ? "Approving…" : "Approve"}
							</button>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
