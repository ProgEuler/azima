"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/form-error";

/** Decline a request, optionally telling the host why. */
export function RejectRequestDialog({
	open,
	onOpenChange,
	title,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	onConfirm: (reason: string) => Promise<void>;
}) {
	const [reason, setReason] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<unknown>(null);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md p-0 overflow-hidden">
				<DialogHeader className="px-6 pt-5 pb-3">
					<DialogTitle className="text-lg font-semibold">Decline this request?</DialogTitle>
					<DialogDescription>
						{title} will be offered to other caterers. Tell the host why if you like.
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 space-y-3">
					<Textarea
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Optional — for example, fully booked on that date"
						rows={3}
					/>
					<FormError error={error} />
				</div>
				<div className="flex items-center gap-2 px-6 py-5">
					<Button
						type="button"
						disabled={busy}
						onClick={async () => {
							setBusy(true);
							setError(null);
							try {
								await onConfirm(reason.trim());
								setReason("");
								onOpenChange(false);
							} catch (e) {
								setError(e);
							} finally {
								setBusy(false);
							}
						}}
					>
						{busy ? "Declining…" : "Yes, decline"}
					</Button>
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Keep it
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
