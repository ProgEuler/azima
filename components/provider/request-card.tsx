"use client";

import { useState } from "react";
import Link from "next/link";
import {
	ClockIcon,
	UsersIcon,
	MapPinIcon,
	StorefrontIcon,
	CurrencyDollarIcon,
} from "@phosphor-icons/react";
import { AcceptRequestDialog } from "@/components/provider/accept-request-dialog";
import { RejectRequestDialog } from "@/components/provider/reject-request-dialog";
import { AdvanceOrderButton } from "@/components/provider/advance-order-button";
import { FormError } from "@/components/form-error";
import { MediaThumb } from "@/components/media-thumb";
import { ordersApi, type ProviderOrder } from "@/lib/api/provider";
import { occasionImage } from "@/lib/format";
import { toRequestView } from "@/lib/provider-orders";

/** A request or order, with the actions the caterer can take on it right now. */
export function RequestCard({
	order,
	onChanged,
}: {
	order: ProviderOrder;
	/** Called after the server accepted a change so the parent can refetch. */
	onChanged?: () => void;
}) {
	const request = toRequestView(order);
	const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const awaiting = order.status === "pending";
	const declined = order.status === "rejected" || order.status === "cancelled";

	return (
		<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden transition-all font-sans">
			{/* Cover image banner with pills overlay */}
			<div className="relative h-44 sm:h-52 w-full bg-stone-100">
				<MediaThumb
					src={null}
					fallbackSrc={occasionImage(order.meal_type)}
					label={request.title}
					sizes="(max-width: 1024px) 100vw, 1024px"
					priority
					className="absolute inset-0 border-0"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

				{/* Top tags */}
				<div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="inline-flex items-center rounded-full bg-white/95 dark:bg-stone-900/90 px-2.5 py-0.5 text-[11px] font-bold text-[#1C1917] dark:text-stone-100 tracking-wider uppercase shadow-2xs backdrop-blur-xs">
							{request.mealTag}
						</span>
						{request.isNew ? (
							<span className="inline-flex items-center rounded-full bg-[#E58325] px-2.5 py-0.5 text-[11px] font-bold text-white tracking-wider uppercase shadow-2xs">
								NEW
							</span>
						) : null}
					</div>

					<span className="inline-flex items-center rounded-full bg-white/95 dark:bg-stone-900/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#666059] dark:text-stone-300 shadow-2xs backdrop-blur-xs">
						{order.status_label}
					</span>
				</div>

				{/* Bottom details on banner */}
				<div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
					<div className="space-y-0.5">
						<h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow-xs">
							{request.title}
						</h2>
						<p className="text-xs text-white/90 font-medium">
							{request.code} · {request.askedTime}
						</p>
					</div>

					<span className="inline-flex items-center rounded-full bg-white/95 dark:bg-stone-900/95 px-3 py-1 text-xs font-bold text-[#1C1917] dark:text-stone-100 shadow-2xs shrink-0">
						{request.dueTime}
					</span>
				</div>
			</div>

			{/* 4 Metadata Columns Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:px-6 border-b border-[#F5F2EC] dark:border-stone-800">
				{/* Date & Time */}
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
						<ClockIcon className="size-3.5" />
						Date & time
					</div>
					<div className="font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100">
						{request.dateTime}
					</div>
					<div className="text-xs text-[#78716C] dark:text-stone-400">
						{request.timeSubtext}
					</div>
				</div>

				{/* Guests */}
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
						<UsersIcon className="size-3.5" />
						Guests
					</div>
					<div className="font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100">
						{request.guests}
					</div>
				</div>

				{/* Delivery / Pick-up */}
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
						{request.deliveryType === "venue" ? (
							<MapPinIcon className="size-3.5" />
						) : (
							<StorefrontIcon className="size-3.5" />
						)}
						{request.deliveryType === "venue"
							? "Delivered to the venue"
							: "Pay and pick up"}
					</div>
					<div className="font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100">
						{request.delivery}
					</div>
				</div>

				{/* Total */}
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
						<CurrencyDollarIcon className="size-3.5" />
						Total
					</div>
					<div className="font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100">
						{request.total}
					</div>
				</div>
			</div>

			{/* What they ordered */}
			<div className="p-5 sm:px-6 space-y-3.5">
				<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
					What they ordered
				</div>

				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
					{request.items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
						>
							<div className="flex items-center gap-3">
								<MediaThumb
									src={item.image}
									label={item.name}
									sizes="44px"
									className="size-11 rounded-lg"
								/>

								<div className="space-y-0.5">
									<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
										{item.name}
									</div>
									<div className="text-xs text-[#78716C] dark:text-stone-400">
										{item.rate}
									</div>
								</div>
							</div>

							<div className="font-bold text-sm sm:text-[15px] text-[#1C1917] dark:text-stone-100 text-right shrink-0">
								{item.price}
							</div>
						</div>
					))}
				</div>

				{/* Host note box */}
				{request.hostNote ? (
					<div className="bg-[#FFFDF5] dark:bg-amber-950/20 border border-[#F6ECC8] dark:border-amber-900/40 rounded-xl p-3.5 text-xs text-[#57524D] dark:text-stone-300 leading-relaxed mt-2">
						<span className="font-bold text-[#1C1917] dark:text-stone-100">
							Host&apos;s note:
						</span>{" "}
						{request.hostNote}
					</div>
				) : null}
			</div>

			{/* Footer buttons */}
			<div className="p-4 sm:px-6 border-t border-[#F5F2EC] dark:border-stone-800 flex items-center justify-between gap-3 bg-[#FAF8F5]/40 dark:bg-stone-900/30">
				<div className="flex items-center gap-2.5 flex-wrap">
					{awaiting ? (
						<>
							<button
								type="button"
								onClick={() => setAcceptDialogOpen(true)}
								className="rounded-full bg-[#8B351F] hover:bg-[#722A18] text-white px-5 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
							>
								Accept
							</button>
							<button
								type="button"
								onClick={() => setRejectDialogOpen(true)}
								className="rounded-full border border-[#EFECE6] dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-[#8B351F] dark:text-amber-400 px-5 py-2 text-xs font-semibold transition-colors cursor-pointer"
							>
								Reject
							</button>
						</>
					) : declined ? (
						<span className="inline-flex items-center rounded-full bg-[#FDF0ED] dark:bg-red-950/50 px-3 py-1.5 text-xs font-semibold text-[#B83E28] dark:text-red-400">
							✕ {order.status_label}
						</span>
					) : order.status === "delivered" ? (
						<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-3 py-1.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
							✓ Delivered
						</span>
					) : (
						<>
							<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-3 py-1.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
								✓ Accepted
							</span>
							<AdvanceOrderButton order={order} onChanged={onChanged} onError={setError} />
						</>
					)}
				</div>

				<Link
					href={`/provider/requests/${order.id}`}
					className="rounded-full border border-[#EFECE6] dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-[#1C1917] dark:text-stone-200 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
				>
					Details
				</Link>
			</div>

			{error ? (
				<div className="px-4 sm:px-6 pb-4">
					<FormError error={error} />
				</div>
			) : null}

			<AcceptRequestDialog
				open={acceptDialogOpen}
				onOpenChange={setAcceptDialogOpen}
				request={request}
				onConfirm={async (id) => {
					await ordersApi.accept(id);
					onChanged?.();
				}}
			/>
			<RejectRequestDialog
				open={rejectDialogOpen}
				onOpenChange={setRejectDialogOpen}
				title={request.title}
				onConfirm={async (reason) => {
					await ordersApi.reject(order.id, reason);
					onChanged?.();
				}}
			/>
		</div>
	);
}
