"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, PhoneIcon } from "@phosphor-icons/react";
import { CancelOrderModal } from "@/components/admin/cancel-order-modal";

const HERO_IMAGE = "/images/overview/birthday-dinner.jpg";

export function AdminOrderDetail() {
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [isCancelled, setIsCancelled] = useState(false);
	const [cancelReason, setCancelReason] = useState<string | null>(null);
	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-16 font-sans">
			{/* Back link */}
			<div>
				<Link
					href="/admin/orders"
					className="group inline-flex items-center gap-2 font-semibold text-xs md:text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
				>
					<ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
					Orders
				</Link>
			</div>

			{/* Hero + meta card */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				{/* Hero image with tag pills */}
				<div className="relative h-44 sm:h-56 w-full bg-stone-100">
					<Image
						src={HERO_IMAGE}
						alt="Iftar Gathering"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 1024px"
						priority
					/>
					<div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
						<span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-[#1C1917] shadow-2xs backdrop-blur">
							AZ-2418
						</span>
						<span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-[#1C1917] shadow-2xs backdrop-blur">
							Iftar
						</span>
					</div>
				</div>

				{/* Status + title + amount row */}
				<div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div className="space-y-2.5">
						{isCancelled ? (
							<span className="inline-flex items-center rounded-full bg-[#FDF2F0] dark:bg-rose-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#B83E28] dark:text-rose-300">
								Cancelled
							</span>
						) : (
							<span className="inline-flex items-center rounded-full bg-[#F3F0EC] dark:bg-stone-800 px-2.5 py-0.5 text-xs font-semibold text-[#666059] dark:text-stone-300">
								Contact confirmed
							</span>
						)}
						<h1 className="font-bold text-2xl sm:text-[28px] tracking-tight text-[#1C1917] dark:text-stone-50">
							Iftar Gathering
						</h1>
						<p className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400">
							8 Sep 2026 · 6:30 PM · Green Garden, Beirut
						</p>
					</div>

					<div className="text-left sm:text-right shrink-0">
						<div className="font-bold text-2xl sm:text-3xl tracking-tight text-[#1C1917] dark:text-stone-50">
							$560
						</div>
						<div className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400 mt-1">
							35 guests · Cash on delivery
						</div>
						<div className="text-xs font-semibold text-[#915B1E] dark:text-amber-400 mt-1">
							Cash not yet collected
						</div>
					</div>
				</div>
			</div>

			{/* Host + Caterer side-by-side */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Host */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
					<div className="text-[11px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
						Host
					</div>
					<div className="space-y-1">
						<div className="font-bold text-base sm:text-lg text-[#8B351F] dark:text-amber-400">
							Omar Naimneh
						</div>
						<div className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400">
							omar@azima.app
						</div>
					</div>
					<div className="flex items-center gap-1.5 font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100 pt-1">
						<PhoneIcon className="size-3.5 text-[#78716C]" />
						+961 3 112 440
					</div>
				</div>

				{/* Caterer */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
					<div className="text-[11px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
						Caterer
					</div>
					<div className="space-y-1">
						<div className="font-bold text-base sm:text-lg text-[#8B351F] dark:text-amber-400">
							Socart Catering
						</div>
						<div className="text-xs sm:text-sm text-[#78716C] dark:text-stone-400">
							Beirut
						</div>
					</div>
					<div className="flex items-center gap-1.5 font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100 pt-1">
						<PhoneIcon className="size-3.5 text-[#78716C]" />
						+961 3 445 118
					</div>
				</div>
			</div>

			{/* Three milestones */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					The three milestones
				</div>

				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80 p-5 sm:p-6 space-y-0">
					{/* Caterer decision */}
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-3 first:pt-1 last:pb-1">
						<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
							Caterer decision
						</div>
						<div className="text-left sm:text-right">
							<div className="font-bold text-sm sm:text-base text-[#2D6A42] dark:text-emerald-400">
								Accepted
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
								28 Aug 2026 · 10:06 AM
							</div>
						</div>
					</div>

					{/* Host contacted */}
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-3">
						<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
							Host contacted by caterer
						</div>
						<div className="text-left sm:text-right">
							<div className="font-bold text-sm sm:text-base text-[#2D6A42] dark:text-emerald-400">
								Confirmed by phone
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
								28 Aug 2026 · 4:06 PM
							</div>
						</div>
					</div>

					{/* Delivery */}
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-3 last:pb-1">
						<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
							Delivery
						</div>
						<div className="text-left sm:text-right">
							<div className="font-bold text-sm sm:text-base text-[#666059] dark:text-stone-400">
								Not yet
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
								—
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* What was ordered */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					What was ordered · 2 items
				</div>

				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80 p-5 sm:p-6 space-y-0">
					<div className="flex items-center justify-between gap-4 py-3 first:pt-1">
						<div className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-stone-100">
							Mixed mezze platter
						</div>
						<div className="text-right shrink-0">
							<div className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-stone-100">
								$9
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400">
								/ guest
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between gap-4 py-3 last:pb-1">
						<div className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-stone-100">
							Kibbeh & fatayer selection
						</div>
						<div className="text-right shrink-0">
							<div className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-stone-100">
								$7
							</div>
							<div className="text-xs text-[#78716C] dark:text-stone-400">
								/ guest
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Timeline */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					Timeline
				</div>

				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:px-5">
						<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
							Provider called and confirmed the detail
						</div>
						<div className="text-right shrink-0">
							<div className="text-xs text-[#78716C] dark:text-stone-400">
								28 Aug 2026 · 4:06 PM
							</div>
							<div className="text-[11px] text-[#78716C] dark:text-stone-500">
								provider
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:px-5">
						<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
							Provider accepted
						</div>
						<div className="text-right shrink-0">
							<div className="text-xs text-[#78716C] dark:text-stone-400">
								28 Aug 2026 · 10:06 AM
							</div>
							<div className="text-[11px] text-[#78716C] dark:text-stone-500">
								provider
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:px-5">
						<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
							Request sent
						</div>
						<div className="text-right shrink-0">
							<div className="text-xs text-[#78716C] dark:text-stone-400">
								28 Aug 2026 · 8:06 AM
							</div>
							<div className="text-[11px] text-[#78716C] dark:text-stone-500">
								customer
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Audit records */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					Audit records for this order · {isCancelled ? "1" : "0"}
				</div>

				<div className="p-4 sm:px-5">
					{isCancelled ? (
						<div className="space-y-1">
							<div className="text-xs font-semibold text-[#8B351F] dark:text-amber-400">
								Order cancelled by azima support
							</div>
							<p className="text-sm text-[#1C1917] dark:text-stone-200">
								Reason: {cancelReason}
							</p>
							<div className="text-xs text-[#78716C] dark:text-stone-400 pt-0.5">
								Recorded just now
							</div>
						</div>
					) : (
						<p className="text-sm text-[#78716C] dark:text-stone-400">
							Nothing recorded against this order yet.
						</p>
					)}
				</div>
			</div>

			{/* Cancel footer */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
				<p className="text-xs text-[#78716C] dark:text-stone-400 max-w-xl leading-relaxed">
					{isCancelled
						? `This order was cancelled by azima support (${cancelReason}). Socart Catering and Omar Naimneh have been notified.`
						: "Cancel on behalf of the platform only when neither side can resolve it. The host and the caterer are both told, and the record names azima support."}
				</p>
				{isCancelled ? (
					<span className="rounded-full border border-[#EFECE6] dark:border-stone-800 bg-stone-100 dark:bg-stone-800/50 px-5 py-2 text-xs font-semibold text-[#78716C] dark:text-stone-400 self-start sm:self-auto shadow-2xs">
						Order cancelled
					</span>
				) : (
					<button
						type="button"
						onClick={() => setIsCancelModalOpen(true)}
						className="rounded-full border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900 px-5 py-2 text-xs font-semibold text-[#B83E28] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
					>
						Cancel this order
					</button>
				)}
			</div>

			<CancelOrderModal
				open={isCancelModalOpen}
				onOpenChange={setIsCancelModalOpen}
				orderCode="AZ-2418"
				catererName="Socart Catering"
				customerName="Omar Naimneh"
				onConfirm={(reason) => {
					setIsCancelled(true);
					setCancelReason(reason);
				}}
			/>
		</div>
	);
}
