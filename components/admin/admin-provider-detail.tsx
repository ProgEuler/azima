"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeftIcon,
	WhatsappLogoIcon,
	PhoneIcon,
	EnvelopeSimpleIcon,
	MapPinIcon,
	StarIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { CatererAccount } from "@/lib/mock-data";
import { SuspendProviderModal } from "@/components/admin/suspend-provider-modal";

export function AdminProviderDetail({ provider }: { provider: CatererAccount }) {
	const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
	const [isSuspended, setIsSuspended] = useState(provider.isSuspended ?? false);
	const [suspendReason, setSuspendReason] = useState<string | null>(null);

	const tradingTerms = provider.tradingTerms;
	const menuCategories = provider.menuCategories || [];
	const ordersList = provider.ordersList || [];

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-16 font-sans">
			{/* Back Link */}
			<div>
				<Link
					href="/admin/providers"
					className="group inline-flex items-center gap-2 font-semibold text-xs md:text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
				>
					<ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
					Providers
				</Link>
			</div>

			{/* Main Profile Header Card */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 md:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
					{/* Left: Avatar + Title + Badges + Owner info + Description */}
					<div className="flex items-start gap-4">
						<div className="relative size-14 rounded-lg overflow-hidden shrink-0 border border-[#EFECE6] dark:border-stone-700 bg-stone-100 shadow-2xs">
							<Image
								src={provider.imageSrc}
								alt={provider.name}
								fill
								className="object-cover"
								sizes="56px"
							/>
						</div>

						<div className="space-y-1">
							<div className="flex items-center gap-2.5 flex-wrap">
								<h1 className="font-bold text-xl md:text-2xl text-[#1C1917] dark:text-stone-100 tracking-tight">
									{provider.name}
								</h1>
								{isSuspended ? (
									<span className="inline-flex items-center rounded-full bg-[#FDF2F0] dark:bg-rose-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#B83E28] dark:text-rose-300">
										Suspended
									</span>
								) : (
									<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
										Approved
									</span>
								)}
							</div>

							<div className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-[#78716C] dark:text-stone-400">
								<StarIcon weight="fill" className="size-3.5 text-amber-500 inline" />
								<span className="font-medium text-[#1C1917] dark:text-stone-200">
									{provider.rating}
								</span>
								{provider.reviewsCount ? <span>({provider.reviewsCount})</span> : null}
								<span>·</span>
								<span>{provider.category}</span>
								{provider.ownerName ? (
									<>
										<span>·</span>
										<span>Run by {provider.ownerName}</span>
									</>
								) : null}
							</div>

							{provider.description ? (
								<p className="text-xs sm:text-sm text-[#57524D] dark:text-stone-300 pt-1 leading-relaxed">
									{provider.description}
								</p>
							) : null}
						</div>
					</div>

					{/* Right: WhatsApp Button */}
					<div className="shrink-0">
						{provider.phone ? (
							<a
								href={`https://wa.me/${provider.phone.replace(/[^0-9]/g, "")}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-full border border-[#D0ECD5] dark:border-emerald-900/60 bg-[#EAF7EC] dark:bg-emerald-950/40 px-4 py-2 text-xs md:text-sm font-semibold text-[#1E7736] dark:text-emerald-300 hover:bg-[#DDF2E1] dark:hover:bg-emerald-900/40 transition-colors cursor-pointer shadow-2xs"
							>
								<WhatsappLogoIcon weight="fill" className="size-4 text-[#25D366]" />
								WhatsApp
							</a>
						) : null}
					</div>
				</div>

				{/* Contact Information Row */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F5F2EC] dark:border-stone-800">
					{/* Phone */}
					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
							<PhoneIcon className="size-3.5" />
							Phone
						</div>
						<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100">
							{provider.phone || "+961 3 991 204"}
						</div>
					</div>

					{/* Sign-in Email */}
					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
							<EnvelopeSimpleIcon className="size-3.5" />
							Sign-in email
						</div>
						<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100 break-all">
							{provider.email || "kitchen@yummy.example"}
						</div>
					</div>

					{/* Based in */}
					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-stone-400">
							<MapPinIcon className="size-3.5" />
							Based in
						</div>
						<div className="font-bold text-sm md:text-[15px] text-[#1C1917] dark:text-stone-100">
							{provider.city || "Beirut"}
						</div>
					</div>
				</div>
			</div>

			{/* 4 KPI Metric Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Live orders */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Live orders
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{provider.liveOrders}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						Accepted or in progress
					</div>
				</div>

				{/* Delivered */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Delivered
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{provider.deliveredOrders}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						Service fulfilled
					</div>
				</div>

				{/* Acceptance rate */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Acceptance rate
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{provider.acceptanceRate || "100%"}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						{provider.acceptanceDecisions ?? 1} decisions
					</div>
				</div>

				{/* Menu items */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3">
					<div className="text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Menu items
					</div>
					<div className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#1C1917] dark:text-stone-50">
						{provider.menuItemsCount || 8}
					</div>
					<div className="text-xs font-normal text-[#78716C] dark:text-stone-400">
						Published to hosts
					</div>
				</div>
			</div>

			{/* Trading terms Card */}
			{tradingTerms ? (
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
					<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Trading terms · set by the caterer, read-only here
					</div>

					<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80 p-5 md:p-6 space-y-4">
						{/* Availability mode */}
						<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-2 first:pt-0">
							<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
								Availability mode
							</div>
							<div className="text-left sm:text-right">
								<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100 flex items-center sm:justify-end gap-1.5">
									<span className="size-2 rounded-full bg-[#2D6A42] inline-block shrink-0" />
									{tradingTerms.availabilityMode}
								</div>
								<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
									{tradingTerms.availabilityNote}
								</div>
							</div>
						</div>

						{/* Booking lead time */}
						<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-3">
							<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
								Booking lead time
							</div>
							<div className="text-left sm:text-right">
								<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
									{tradingTerms.bookingLeadTime}
								</div>
								<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
									{tradingTerms.bookingLeadNote}
								</div>
							</div>
						</div>

						{/* Bookings accepted */}
						<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-3">
							<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
								Bookings accepted
							</div>
							<div className="text-left sm:text-right">
								<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
									{tradingTerms.bookingsAccepted}
								</div>
								<div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
									{tradingTerms.bookingsNote}
								</div>
							</div>
						</div>

						{/* Delivers to */}
						<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-3">
							<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
								Delivers to
							</div>
							<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100 text-left sm:text-right">
								{tradingTerms.deliversTo}
							</div>
						</div>

						{/* Delivery fee */}
						<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-3">
							<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
								Delivery fee
							</div>
							<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100 text-left sm:text-right">
								{tradingTerms.deliveryFee}
							</div>
						</div>

						{/* Host collection */}
						<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-3">
							<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
								Host collection
							</div>
							<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100 text-left sm:text-right">
								{tradingTerms.hostCollection}
							</div>
						</div>

						{/* Dates taken out of service */}
						<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-3">
							<div className="text-xs sm:text-sm font-medium text-[#78716C] dark:text-stone-400">
								Dates taken out of service
							</div>
							<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100 text-left sm:text-right">
								{tradingTerms.blackoutDates}
							</div>
						</div>
					</div>
				</div>
			) : null}

			{/* Menu and pricing Card */}
			{menuCategories.length > 0 ? (
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
					<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Menu and pricing · {provider.menuItemsCount || 8} items · {provider.priceRange || "$2.50–$24 per guest"}
					</div>

					<div className="p-5 md:p-6 space-y-6">
						{menuCategories.map((cat, idx) => (
							<div key={idx} className="space-y-3">
								<h3 className="text-xs font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wider">
									{cat.title}
								</h3>

								<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
									{cat.items.map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
										>
											{/* Left: Thumbnail & text */}
											<div className="flex items-center gap-3.5">
												<div className="relative size-12 rounded-lg overflow-hidden shrink-0 border border-[#EFECE6] dark:border-stone-700 bg-stone-100 shadow-2xs">
													<Image
														src={item.imageSrc}
														alt={item.name}
														fill
														className="object-cover"
														sizes="48px"
													/>
												</div>

												<div className="space-y-0.5">
													<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
														{item.name}
													</div>
													<div className="text-xs text-[#78716C] dark:text-stone-400">
														{item.description}
													</div>
												</div>
											</div>

											{/* Right: Price */}
											<div className="text-right shrink-0">
												<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
													{item.price}
												</div>
												<div className="text-[11px] text-[#78716C] dark:text-stone-400">
													per guest
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			) : null}

			{/* Orders Card */}
			{ordersList.length > 0 ? (
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
					<div className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800 px-5 py-3.5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
						Orders · {provider.liveOrders} live · {provider.deliveredOrders} delivered
					</div>

					<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
						{ordersList.map((ord) => (
							<div
								key={ord.id}
								className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-5 hover:bg-[#FAF8F5]/60 dark:hover:bg-stone-800/40 transition-colors"
							>
								{/* Left: Thumbnail & Details */}
								<div className="flex items-center gap-3.5">
									<div className="relative size-12 rounded-lg overflow-hidden shrink-0 border border-[#EFECE6] dark:border-stone-700 bg-stone-100 shadow-2xs">
										<Image
											src={ord.imageSrc}
											alt={ord.eventName}
											fill
											className="object-cover"
											sizes="48px"
										/>
									</div>

									<div className="space-y-0.5">
										<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
											{ord.eventName}
										</div>
										<div className="text-xs text-[#78716C] dark:text-stone-400">
											{ord.code} · {ord.date} · {ord.guests} guests
										</div>
									</div>
								</div>

								{/* Right: Badge & Price */}
								<div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pl-16 sm:pl-0">
									<div>
										{ord.status === "Awaiting response" ? (
											<span className="inline-flex items-center rounded-full bg-[#FCF4E7] dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#915B1E] dark:text-amber-300">
												Awaiting response
											</span>
										) : ord.status === "On the way" ? (
											<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
												On the way
											</span>
										) : (
											<span className="inline-flex items-center rounded-full bg-[#F3F0EC] dark:bg-stone-800 px-2.5 py-0.5 text-xs font-semibold text-[#666059] dark:text-stone-300">
												{ord.status}
											</span>
										)}
									</div>

									<div className="font-bold text-sm md:text-base text-[#1C1917] dark:text-stone-100 text-right min-w-[60px]">
										{ord.amount}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			) : null}

			{/* Suspend Footer */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
				<p className="text-xs text-[#78716C] dark:text-stone-400 max-w-xl leading-relaxed">
					{isSuspended
						? `This provider is currently suspended (${suspendReason || "Account suspended"}). They cannot sign in and are hidden from discovery.`
						: "Suspending hides them from discovery and blocks sign-in, and needs a reason. Orders already placed stay on the platform."}
				</p>
				{isSuspended ? (
					<button
						type="button"
						onClick={() => {
							setIsSuspended(false);
							setSuspendReason(null);
						}}
						className="rounded-full border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900 px-5 py-2 text-xs font-semibold text-[#1C1917] dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
					>
						Reinstate provider
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

			<SuspendProviderModal
				open={isSuspendModalOpen}
				onOpenChange={setIsSuspendModalOpen}
				providerName={provider.name}
				liveOrdersCount={provider.liveOrders}
				onConfirm={(reason) => {
					setIsSuspended(true);
					setSuspendReason(reason);
				}}
			/>
		</div>
	);
}
