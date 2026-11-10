"use client";

import { useState } from "react";
import Link from "next/link";
import {
	ArrowLeftIcon,
	WhatsappLogoIcon,
	PhoneIcon,
	EnvelopeSimpleIcon,
	MapPinIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import { SuspendUserModal } from "@/components/admin/suspend-user-modal";
import { MediaThumb } from "@/components/media-thumb";
import { OrderStatusPill } from "@/components/order-status-pill";
import { FormError, QueryState } from "@/components/form-error";
import { useApi } from "@/hooks/use-api";
import { adminApi } from "@/lib/api/admin";
import { dateLabel, money, occasionImage } from "@/lib/format";

export function AdminUserDetail({ id }: { id: string }) {
	const detail = useApi((signal) => adminApi.user(id, signal), [id]);
	const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
	const [actionError, setActionError] = useState<unknown>(null);

	if (!detail.data) {
		return (
			<div className="mx-auto w-full max-w-5xl">
				<QueryState loading={detail.loading} error={detail.error} onRetry={detail.reload} label="Loading host…" />
			</div>
		);
	}

	const u = detail.data;
	const user = {
		name: u.full_name || u.email || u.phone || "Host",
		phone: u.phone ?? "",
		email: u.email ?? "—",
		address: u.address || "—",
		hostSince: dateLabel(u.created_at),
		occasions: u.occasions_count,
		liveOccasions: u.live_occasions,
		ordersCount: u.orders_count,
		cancelledOrders: u.cancelled_orders,
		booked: u.orders_count > 0 ? money(u.booked_total) : "—",
		cancellationRate: `${u.cancellation_rate}%`,
		occasionsList: u.occasions,
	};
	const isSuspended = u.is_suspended;
	const suspendReason = u.suspension_reason || null;

	const reinstate = async () => {
		setActionError(null);
		try {
			await adminApi.reinstateUser(id);
			detail.reload();
		} catch (error) {
			setActionError(error);
		}
	};
	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-12 font-sans">
			{/* Back Link */}
			<div>
				<Link
					href="/admin/users"
					className="group inline-flex items-center gap-2 font-semibold text-xs md:text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
				>
					<ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
					Host accounts
				</Link>
			</div>

			{/* Main Profile Header Card */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 md:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					{/* Left: Avatar + Name + Active badge + Joined date */}
					<div className="flex items-center gap-4">
						<MediaThumb
							src={u.avatar}
							label={user.name}
							sizes="56px"
							className="size-14 rounded-full"
						/>

						<div className="space-y-1">
							<div className="flex items-center gap-2.5 flex-wrap">
								<h1 className="font-bold text-xl md:text-2xl text-[#1C1917] dark:text-stone-100 tracking-tight">
									{user.name}
								</h1>
								{isSuspended ? (
									<span className="inline-flex items-center rounded-full bg-[#FDF0ED] dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#B83E28] dark:text-red-400">
										Suspended
									</span>
								) : (
									<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
										Active
									</span>
								)}
							</div>
							<p className="text-xs md:text-sm text-[#78716C] dark:text-stone-400">
								Host since {user.hostSince}
							</p>
						</div>
					</div>

					{/* Right: WhatsApp Button */}
					<div>
						<a
							href={`https://wa.me/${user.phone.replace(/[^0-9]/g, "")}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-full border border-[#D0ECD5] dark:border-emerald-900/60 bg-[#EAF7EC] dark:bg-emerald-950/40 px-4 py-2 text-xs md:text-sm font-semibold text-[#1E7736] dark:text-emerald-300 hover:bg-[#DDF2E1] dark:hover:bg-emerald-900/40 transition-colors cursor-pointer shadow-2xs"
						>
							<WhatsappLogoIcon weight="fill" className="size-4 text-[#25D366]" />
							WhatsApp
						</a>
					</div>
				</div>

				{/* Contact Information Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F5F2EC] dark:border-stone-800">
					{/* Phone */}
					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
							<PhoneIcon className="size-3.5" />
							Phone
						</div>
						<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100">
							{user.phone}
						</div>
					</div>

					{/* Email */}
					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
							<EnvelopeSimpleIcon className="size-3.5" />
							Email
						</div>
						<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100 break-all">
							{user.email}
						</div>
					</div>

					{/* Address */}
					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
							<MapPinIcon className="size-3.5" />
							Address
						</div>
						<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100">
							{user.address}
						</div>
					</div>
				</div>
			</div>

			{/* 4 KPI Metric Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Occasions */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Occasions
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{user.occasions}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						{user.liveOccasions} live now
					</div>
				</div>

				{/* Orders */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Orders
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{user.ordersCount}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						{user.cancelledOrders} cancelled
					</div>
				</div>

				{/* Booked */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Booked
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{user.booked}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						Excluding cancelled
					</div>
				</div>

				{/* Cancellation rate */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Cancellation rate
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{user.cancellationRate}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						Within normal range
					</div>
				</div>
			</div>

			{/* Occasions List Card */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				{/* Header */}
				<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
					Occasions · {user.occasions}
				</div>

				{/* List items */}
				<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
					{user.occasionsList.length === 0 ? (
						<div className="py-10 text-center text-xs md:text-sm text-[#78716C] dark:text-stone-400">
							No occasions found for this host account.
						</div>
					) : (
						user.occasionsList.map((item) => (
							<div
								key={item.id}
								className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-5 hover:bg-[#FAF8F5]/60 dark:hover:bg-stone-800/40 transition-colors"
							>
								{/* Left: Thumbnail & Occasion details */}
								<div className="flex items-center gap-3.5">
									<MediaThumb
										src={null}
										fallbackSrc={occasionImage(item.meal_type)}
										label={item.title}
										sizes="56px"
										className="size-12 sm:w-14 sm:h-12 rounded-lg"
									/>

									<div className="space-y-0.5">
										<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100">
											{item.title}
										</div>
										<div className="flex items-center gap-1.5 text-xs text-[#78716C] dark:text-stone-400">
											<span>{dateLabel(item.event_date)}</span>
											<span>·</span>
											<span className="capitalize">{item.meal_type || "Occasion"}</span>
											<span>·</span>
											<span className="inline-flex items-center gap-1">
												<UsersIcon className="size-3.5" />
												{item.guests ?? "—"}
											</span>
										</div>
									</div>
								</div>

								{/* Right: Badge & Price */}
								<div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pl-16 sm:pl-0">
									<div>
										{item.status ? (
											<OrderStatusPill status={item.status} />
										) : (
											<span className="text-xs text-[#78716C] dark:text-stone-400">No food ordered</span>
										)}
									</div>

									<div className="font-bold text-sm md:text-base text-[#1C1917] dark:text-stone-100 text-right min-w-[50px]">
										{item.status ? money(item.amount) : "—"}
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<FormError error={actionError} />

			{/* Suspend Footer */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
				<p className="text-xs text-[#78716C] dark:text-stone-400 max-w-xl leading-relaxed">
					{isSuspended
						? `This user is currently suspended (${suspendReason || "Account suspended"}). They cannot sign in to the platform.`
						: "Suspending prevents them from signing in, and needs a reason. Orders already placed stay with the caterer."}
				</p>
				{isSuspended ? (
					<button
						type="button"
						onClick={reinstate}
						className="rounded-full border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900 px-5 py-2 text-xs font-semibold text-[#1C1917] dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
					>
						Reinstate user
					</button>
				) : (
					<button
						type="button"
						onClick={() => setIsSuspendModalOpen(true)}
						className="rounded-full border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900 px-5 py-2 text-xs font-semibold text-[#B83E28] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
					>
						Suspend
					</button>
				)}
			</div>

			<SuspendUserModal
				open={isSuspendModalOpen}
				onOpenChange={setIsSuspendModalOpen}
				userName={user.name}
				liveOrdersCount={user.liveOccasions}
				onConfirm={async (reason) => {
					await adminApi.suspendUser(id, reason);
					detail.reload();
				}}
			/>
		</div>
	);
}
