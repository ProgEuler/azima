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

const USER_SUSPEND_REASONS = [
	"Fraud suspected",
	"Abusive behaviour",
	"Repeated no-shows",
	"Duplicate account",
	"Owner asked us to close it",
	"Other",
] as const;

export interface SuspendUserModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userName?: string;
	liveOrdersCount?: number;
	onConfirm?: (reason: string) => void;
}

export function SuspendUserModal({
	open,
	onOpenChange,
	userName = "Omar Naimneh",
	liveOrdersCount = 6,
	onConfirm,
}: SuspendUserModalProps) {
	const [selectedReason, setSelectedReason] = useState<string>("");
	const [otherReason, setOtherReason] = useState<string>("");

	const ordersSentence =
		liveOrdersCount === 1
			? "1 live order stays with the caterer"
			: `${liveOrdersCount} live orders stay with the caterer`;

	const handleCancel = () => {
		setSelectedReason("");
		setOtherReason("");
		onOpenChange(false);
	};

	const handleConfirm = () => {
		const finalReason =
			selectedReason === "Other"
				? otherReason.trim() || "Other"
				: selectedReason || "Account suspended";

		onConfirm?.(finalReason);
		setSelectedReason("");
		setOtherReason("");
		onOpenChange(false);
	};

	const isSubmitDisabled =
		!selectedReason || (selectedReason === "Other" && !otherReason.trim());

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="w-full max-w-[calc(100%-2rem)] sm:max-w-[440px] rounded-3xl sm:rounded-[28px] bg-white dark:bg-stone-900 p-6 sm:p-7 border border-[#EFECE6] dark:border-stone-800 shadow-xl gap-5"
			>
				<DialogHeader className="gap-2 text-left">
					<DialogTitle className="text-xl sm:text-[22px] font-bold text-[#1C1917] dark:text-stone-100 tracking-tight leading-snug">
						Suspend {userName}?
					</DialogTitle>
					<DialogDescription className="text-sm sm:text-[14.5px] text-[#57524D] dark:text-stone-300 leading-relaxed pt-0.5">
						{userName} will not be able to sign in. {ordersSentence} — cancel them
						separately if they should not go ahead.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2.5">
					<div className="text-xs font-bold text-[#8C7A6B] dark:text-stone-400 tracking-wide">
						Reason — recorded in the audit trail
					</div>

					<div className="flex flex-col gap-2">
						{USER_SUSPEND_REASONS.map((reason) => {
							const isSelected = selectedReason === reason;
							return (
								<button
									key={reason}
									type="button"
									onClick={() => setSelectedReason(reason)}
									className={cn(
										"w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer",
										isSelected
											? "bg-[#F0EBE1] text-[#1C1917] dark:bg-stone-800 dark:text-stone-100 ring-2 ring-[#1C1917] dark:ring-stone-300 shadow-2xs"
											: "bg-[#FAF8F5] text-[#292524] hover:bg-[#F3EFE9] dark:bg-stone-800/60 dark:text-stone-200 dark:hover:bg-stone-800"
									)}
								>
									{reason}
								</button>
							);
						})}

						{selectedReason === "Other" && (
							<input
								type="text"
								value={otherReason}
								onChange={(e) => setOtherReason(e.target.value)}
								placeholder="Please specify reason..."
								className="w-full rounded-2xl border border-[#E8E4DC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-stone-800 px-4 py-2.5 text-sm text-[#1C1917] dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#1C1917] dark:focus:ring-stone-300 transition-all"
								autoFocus
							/>
						)}
					</div>
				</div>

				<div className="flex items-center justify-end gap-3 pt-1">
					<button
						type="button"
						onClick={handleCancel}
						className="font-bold text-sm text-[#1C1917] dark:text-stone-200 hover:text-stone-600 dark:hover:text-stone-400 px-3 py-2 cursor-pointer transition-colors"
					>
						Cancel
					</button>
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
						Suspend account
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
