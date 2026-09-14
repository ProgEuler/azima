"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CANCEL_REASONS = [
	"Caterer unreachable — no reply to the request",
	"Duplicate request for the same occasion",
	"Host asked support to cancel",
	"Caterer cannot fulfil and did not decline",
	"Suspected fraudulent order",
	"Another reason",
] as const;

export interface CancelOrderModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	orderCode?: string;
	catererName?: string;
	customerName?: string;
	onConfirm?: (reason: string) => void;
}

export function CancelOrderModal({
	open,
	onOpenChange,
	orderCode = "AZ-2418",
	catererName = "Socart Catering",
	customerName = "Omar Naimneh",
	onConfirm,
}: CancelOrderModalProps) {
	const [selectedReason, setSelectedReason] = useState<string>("");
	const [customReason, setCustomReason] = useState<string>("");

	const handleClose = () => {
		setSelectedReason("");
		setCustomReason("");
		onOpenChange(false);
	};

	const handleConfirm = () => {
		const finalReason =
			selectedReason === "Another reason"
				? customReason.trim() || "Another reason"
				: selectedReason || "Order cancelled by platform";

		onConfirm?.(finalReason);
		setSelectedReason("");
		setCustomReason("");
		onOpenChange(false);
	};

	const isSubmitDisabled =
		!selectedReason || (selectedReason === "Another reason" && !customReason.trim());

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="w-full max-w-[calc(100%-2rem)] sm:max-w-[480px] rounded-3xl sm:rounded-[28px] bg-white dark:bg-stone-900 p-6 sm:p-7 border border-[#EFECE6] dark:border-stone-800 shadow-xl gap-5"
			>
				<DialogHeader className="gap-1.5 text-left">
					<DialogTitle className="text-xl sm:text-[22px] font-bold text-[#1C1917] dark:text-stone-100 tracking-tight leading-snug">
						Cancel {orderCode}?
					</DialogTitle>
					<DialogDescription className="text-sm sm:text-[14.5px] text-[#57524D] dark:text-stone-300 leading-relaxed">
						{catererName} and {customerName} are notified immediately. This cannot
						be undone.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3.5 pt-1">
					<div className="flex flex-col gap-3">
						{CANCEL_REASONS.map((reason) => {
							const isSelected = selectedReason === reason;
							return (
								<label
									key={reason}
									className="flex items-center gap-3 cursor-pointer group select-none"
									onClick={() => setSelectedReason(reason)}
								>
									<span
										className={cn(
											"size-[18px] rounded-full border flex items-center justify-center shrink-0 transition-all",
											isSelected
												? "border-[#1C1917] dark:border-stone-100 bg-white dark:bg-stone-900"
												: "border-stone-400 dark:border-stone-600 group-hover:border-stone-600 dark:group-hover:border-stone-400"
										)}
									>
										{isSelected && (
											<span className="size-2 rounded-full bg-[#1C1917] dark:bg-stone-100" />
										)}
									</span>
									<span className="text-sm text-[#1C1917] dark:text-stone-200 font-medium">
										{reason}
									</span>
								</label>
							);
						})}

						{selectedReason === "Another reason" && (
							<input
								type="text"
								value={customReason}
								onChange={(e) => setCustomReason(e.target.value)}
								placeholder="Please specify reason..."
								className="mt-1 w-full rounded-2xl border border-[#E8E4DC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-stone-800 px-4 py-2.5 text-sm text-[#1C1917] dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#1C1917] dark:focus:ring-stone-300 transition-all"
								autoFocus
							/>
						)}
					</div>
				</div>

				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={handleConfirm}
						disabled={isSubmitDisabled}
						className={cn(
							"rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all shadow-2xs",
							isSubmitDisabled
								? "border-[#F4C7BF]/50 text-[#C84F38]/50 bg-white/60 dark:bg-stone-900/60 cursor-not-allowed"
								: "border-[#F4C7BF] dark:border-rose-900/60 bg-white dark:bg-stone-900 text-[#C84F38] dark:text-rose-400 hover:bg-[#FDF2F0] dark:hover:bg-rose-950/30 cursor-pointer active:scale-[0.98]"
						)}
					>
						Cancel the order
					</button>
					<button
						type="button"
						onClick={handleClose}
						className="rounded-2xl border border-[#E8E4DC] dark:border-stone-700 bg-white dark:bg-stone-900 px-5 py-2.5 text-sm font-bold text-[#1C1917] dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
					>
						Leave it alone
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
