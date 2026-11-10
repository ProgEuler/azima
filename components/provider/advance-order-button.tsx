"use client";

import { useState } from "react";
import { TruckIcon } from "@phosphor-icons/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ordersApi, type ProviderOrder } from "@/lib/api/provider";
import { money } from "@/lib/format";

/**
 * The single "next step" action for an accepted order. Marking a cash order as
 * delivered asks whether the cash was collected, so money owed is never lost.
 */
export function AdvanceOrderButton({
	order,
	onChanged,
	onError,
	variant = "button",
}: {
	order: ProviderOrder;
	onChanged?: () => void;
	onError?: (error: unknown) => void;
	variant?: "button" | "link";
}) {
	const action = order.next_action;
	const [busy, setBusy] = useState(false);
	const [cashDialog, setCashDialog] = useState(false);

	if (!action || action.type !== "advance") return null;

	const isDelivery = action.to === "delivered";
	const needsCashQuestion =
		isDelivery && order.payment?.method === "cash_on_delivery" && order.payment.status === "pending";

	async function run(cashCollected?: boolean) {
		setBusy(true);
		onError?.(null);
		try {
			await ordersApi.advance(order.id, cashCollected === undefined ? {} : { cash_collected: cashCollected });
			setCashDialog(false);
			onChanged?.();
		} catch (error) {
			onError?.(error);
		} finally {
			setBusy(false);
		}
	}

	const className =
		variant === "link"
			? "inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B351F] dark:text-amber-400 hover:underline cursor-pointer disabled:opacity-60"
			: "rounded-full border border-[#EFECE6] dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-[#8B351F] dark:text-amber-400 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60";

	return (
		<>
			<button
				type="button"
				disabled={busy}
				onClick={() => (needsCashQuestion ? setCashDialog(true) : void run())}
				className={className}
			>
				{variant === "link" ? <TruckIcon className="size-4" /> : null}
				{busy ? "Saving…" : action.label}
			</button>

			<Dialog open={cashDialog} onOpenChange={setCashDialog}>
				<DialogContent className="sm:max-w-md p-0 overflow-hidden">
					<DialogHeader className="px-6 pt-5 pb-3">
						<DialogTitle className="text-lg font-semibold">Did you collect the cash?</DialogTitle>
						<DialogDescription>
							{order.order_number} is {money(order.total_amount)} in cash on delivery. If you have not
							been paid yet, the amount stays owed until it is settled.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col sm:flex-row items-center gap-2 px-6 pb-6">
						<Button type="button" disabled={busy} onClick={() => void run(true)}>
							Yes, cash collected
						</Button>
						<Button type="button" variant="outline" disabled={busy} onClick={() => void run(false)}>
							Not collected yet
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
