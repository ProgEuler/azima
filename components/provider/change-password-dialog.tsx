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
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/form-error";
import { providerApi } from "@/lib/api/provider";

export function ChangePasswordDialog({
	open,
	onOpenChange,
	onChanged,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onChanged: () => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md p-0 overflow-hidden">
				<PasswordForm onCancel={() => onOpenChange(false)} onDone={() => { onChanged(); onOpenChange(false); }} />
			</DialogContent>
		</Dialog>
	);
}

function PasswordForm({ onCancel, onDone }: { onCancel: () => void; onDone: () => void }) {
	const [current, setCurrent] = useState("");
	const [next, setNext] = useState("");
	const [confirm, setConfirm] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const mismatch = confirm.length > 0 && next !== confirm;
	const valid = current.length > 0 && next.length >= 8 && next === confirm;

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		if (!valid) return;
		setBusy(true);
		setError(null);
		try {
			await providerApi.changePassword(current, next);
			onDone();
		} catch (e) {
			setError(e);
			setBusy(false);
		}
	}

	return (
		<>
			<DialogHeader className="px-6 pt-5 pb-2">
				<DialogTitle className="text-lg font-semibold">Change password</DialogTitle>
				<DialogDescription>Use at least 8 characters.</DialogDescription>
			</DialogHeader>
			<form onSubmit={submit} className="space-y-4 px-6 pb-6">
				<Field label="Current password"><Input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
				<Field label="New password" hint={next && next.length < 8 ? "Use at least 8 characters" : undefined}>
					<Input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
				</Field>
				<Field label="Confirm new password" error={mismatch ? "Passwords don't match" : undefined}>
					<Input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
				</Field>
				<FormError error={error} />
				<div className="flex items-center gap-2 pt-1">
					<Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
					<Button type="submit" disabled={!valid || busy}>{busy ? "Saving…" : "Update password"}</Button>
				</div>
			</form>
		</>
	);
}
