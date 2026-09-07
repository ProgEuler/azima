"use client";

import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeftIcon,
	WhatsappLogoIcon,
	PhoneIcon,
	EnvelopeSimpleIcon,
	MapPinIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { AdminHostUser } from "@/lib/mock-data";

export function AdminUserDetail({ user }: { user: AdminHostUser }) {
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
						{user.avatarImage ? (
							<div className="relative size-14 rounded-full overflow-hidden shrink-0 border border-[#EFECE6] dark:border-stone-700 bg-stone-100">
								<Image
									src={user.avatarImage}
									alt={user.name}
									fill
									className="object-cover"
									sizes="56px"
								/>
							</div>
						) : (
							<div className="size-14 rounded-full shrink-0 flex items-center justify-center font-bold text-base bg-[#FBF0EB] text-[#A3432B] dark:bg-amber-950/40 dark:text-amber-400 border border-[#F5E2DA] dark:border-amber-900/40">
								{user.avatarInitials}
							</div>
						)}

						<div className="space-y-1">
							<div className="flex items-center gap-2.5 flex-wrap">
								<h1 className="font-bold text-xl md:text-2xl text-[#1C1917] dark:text-stone-100 tracking-tight">
									{user.name}
								</h1>
								{user.status === "active" ? (
									<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
										Active
									</span>
								) : (
									<span className="inline-flex items-center rounded-full bg-[#FDF0ED] dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#B83E28] dark:text-red-400">
										Suspended
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
									<div className="relative size-12 sm:w-14 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-[#EFECE6] dark:border-stone-700 bg-stone-100 shadow-2xs">
										<Image
											src={item.imageSrc}
											alt={item.title}
											fill
											className="object-cover"
											sizes="56px"
										/>
									</div>

									<div className="space-y-0.5">
										<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100">
											{item.title}
										</div>
										<div className="flex items-center gap-1.5 text-xs text-[#78716C] dark:text-stone-400">
											<span>{item.date}</span>
											<span>·</span>
											<span>{item.mealType}</span>
											<span>·</span>
											<span className="inline-flex items-center gap-1">
												<UsersIcon className="size-3.5" />
												{item.guests}
											</span>
										</div>
									</div>
								</div>

								{/* Right: Badge & Price */}
								<div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pl-16 sm:pl-0">
									<div>
										{item.status === "Rejected" && (
											<span className="inline-flex items-center rounded-full bg-[#FDF0ED] dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#B83E28] dark:text-red-400">
												Rejected
											</span>
										)}
										{item.status === "Contact confirmed" && (
											<span className="inline-flex items-center rounded-full bg-[#FCF4E7] dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#915B1E] dark:text-amber-300">
												Contact confirmed
											</span>
										)}
										{item.status === "Preparing" && (
											<span className="inline-flex items-center rounded-full bg-[#FCF4E7] dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#915B1E] dark:text-amber-300">
												Preparing
											</span>
										)}
										{item.status === "Covered" && (
											<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
												Covered
											</span>
										)}
									</div>

									<div className="font-bold text-sm md:text-base text-[#1C1917] dark:text-stone-100 text-right min-w-[50px]">
										{item.amount}
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
