"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
	adminPendingApprovals,
	adminCatererProviders,
	type CatererAccount,
} from "@/lib/mock-data";

export function AdminProviders() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

	const activeCount = adminCatererProviders.filter((p) => !p.isSuspended).length;
	const suspendedCount = adminCatererProviders.filter((p) => p.isSuspended).length;
	const allCount = adminCatererProviders.length;

	const filteredProviders = useMemo(() => {
		return adminCatererProviders.filter((provider) => {
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && !provider.isSuspended) ||
				(statusFilter === "suspended" && provider.isSuspended);

			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				provider.name.toLowerCase().includes(q) ||
				provider.category.toLowerCase().includes(q) ||
				(provider.ownerName && provider.ownerName.toLowerCase().includes(q)) ||
				(provider.city && provider.city.toLowerCase().includes(q)) ||
				(provider.phone && provider.phone.toLowerCase().includes(q)) ||
				(provider.email && provider.email.toLowerCase().includes(q));

			return matchesStatus && matchesSearch;
		});
	}, [searchQuery, statusFilter]);

	return (
		<div className="mx-auto w-full max-w-5xl space-y-7 pb-12 font-sans">
			{/* Section 1: Pending approvals */}
			<section className="space-y-3">
				<h2 className="font-bold text-lg text-[#1C1917] dark:text-stone-100 tracking-tight">
					Pending approvals
				</h2>

				{adminPendingApprovals.map((item) => (
					<div
						key={item.id}
						className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
					>
						{/* Left: Thumbnail & Details */}
						<div className="flex items-center gap-4">
							<div className="relative size-14 rounded-lg overflow-hidden shrink-0 border border-[#EFECE6] dark:border-stone-700 bg-stone-100 shadow-2xs">
								<Image
									src={item.imageSrc}
									alt={item.name}
									fill
									className="object-cover"
									sizes="56px"
								/>
							</div>

							<div className="space-y-0.5">
								<div className="font-bold text-base md:text-lg text-[#1C1917] dark:text-stone-100">
									{item.name}
								</div>
								<div className="text-xs md:text-sm text-[#78716C] dark:text-stone-400">
									{item.category} · {item.city} · {item.phone}
								</div>
								<div className="text-xs text-[#78716C] dark:text-stone-400">
									{item.menuItemsToReview} menu items to review
								</div>
							</div>
						</div>

						{/* Right: Action Button */}
						<div>
							<button
								type="button"
								className="rounded-full bg-[#8B351F] hover:bg-[#732915] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
							>
								Review application
							</button>
						</div>
					</div>
				))}
			</section>

			{/* Section 2: Caterer accounts */}
			<section className="space-y-3.5">
				<div>
					<h2 className="font-bold text-lg text-[#1C1917] dark:text-stone-100 tracking-tight">
						Caterer accounts
					</h2>
					<p className="text-xs sm:text-[13px] text-[#78716C] dark:text-stone-400 mt-0.5">
						Every approved caterer, suspended ones included. Open one to suspend it or put it back.
					</p>
				</div>

				{/* Search and Filters */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
					{/* Search input */}
					<div className="relative flex-1">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search name, owner, phone, email or city"
							className="w-full h-11 rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900 px-4 text-sm text-[#1C1917] dark:text-stone-100 placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-700 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] transition-all"
						/>
					</div>

					{/* Filter Pills */}
					<div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
						<button
							type="button"
							onClick={() => setStatusFilter("all")}
							className={cn(
								"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
								statusFilter === "all"
									? "bg-[#221C18] text-white shadow-xs"
									: "bg-white dark:bg-stone-900 text-[#57524D] dark:text-stone-300 border border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
							)}
						>
							All {allCount}
						</button>

						<button
							type="button"
							onClick={() => setStatusFilter("active")}
							className={cn(
								"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
								statusFilter === "active"
									? "bg-[#221C18] text-white shadow-xs"
									: "bg-white dark:bg-stone-900 text-[#57524D] dark:text-stone-300 border border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
							)}
						>
							Active {activeCount}
						</button>

						<button
							type="button"
							onClick={() => setStatusFilter("suspended")}
							className={cn(
								"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
								statusFilter === "suspended"
									? "bg-[#221C18] text-white shadow-xs"
									: "bg-white dark:bg-stone-900 text-[#57524D] dark:text-stone-300 border border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
							)}
						>
							Suspended {suspendedCount}
						</button>
					</div>
				</div>

				{/* Caterers Table */}
				<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800">
									<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
										Providers
									</th>
									<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
										Capacity
									</th>
									<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
										Taking requests
									</th>
									<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
										Orders
									</th>
									<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400 text-right">
										Action
									</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
								{filteredProviders.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="py-12 text-center text-sm text-[#78716C] dark:text-stone-400"
										>
											No caterers found matching your search.
										</td>
									</tr>
								) : (
									filteredProviders.map((provider) => (
										<tr
											key={provider.id}
											className="hover:bg-[#FAF8F5]/60 dark:hover:bg-stone-800/40 transition-colors"
										>
											{/* Column 1: Providers (Thumbnail, Name, Rating & Category) */}
											<td className="py-3.5 px-5">
												<div className="flex items-center gap-3.5">
													<div className="relative size-12 rounded-lg overflow-hidden shrink-0 border border-[#EFECE6] dark:border-stone-700 bg-stone-100 shadow-2xs">
														<Image
															src={provider.imageSrc}
															alt={provider.name}
															fill
															className="object-cover"
															sizes="48px"
														/>
													</div>

													<div className="space-y-0.5">
														<div className="font-bold text-sm md:text-[15px] text-[#8B351F] hover:underline cursor-pointer">
															<Link href={`/admin/providers/${provider.id}`}>
																{provider.name}
															</Link>
														</div>
														<div className="flex items-center gap-1 text-xs text-[#78716C] dark:text-stone-400">
															<StarIcon weight="fill" className="size-3 text-amber-500 inline" />
															<span>{provider.rating}</span>
															<span>·</span>
															<span>{provider.category}</span>
															{provider.isSuspended && (
																<span className="inline-flex items-center rounded-full bg-[#FDF0ED] dark:bg-red-950/50 px-2 py-0.5 text-[11px] font-semibold text-[#B83E28] dark:text-red-400 ml-1.5">
																	Suspended
																</span>
															)}
														</div>
													</div>
												</div>
											</td>

											{/* Column 2: Capacity */}
											<td className="py-3.5 px-5 text-xs md:text-sm font-medium text-[#1C1917] dark:text-stone-200">
												{provider.capacity}
											</td>

											{/* Column 3: Taking requests */}
											<td className="py-3.5 px-5">
												<div className="space-y-0.5">
													<div
														className={cn(
															"text-xs md:text-sm font-semibold flex items-center gap-1.5",
															provider.requestStatus.color === "green"
																? "text-[#1C1917] dark:text-stone-100"
																: "text-[#B83E28] dark:text-red-400"
														)}
													>
														<span
															className={cn(
																"size-2 rounded-full inline-block shrink-0",
																provider.requestStatus.color === "green"
																	? "bg-[#2D6A42]"
																	: "bg-[#B83E28]"
															)}
														/>
														{provider.requestStatus.label}
													</div>
													<div className="text-xs text-[#78716C] dark:text-stone-400 pl-3.5">
														{provider.requestStatus.subtext}
													</div>
												</div>
											</td>

											{/* Column 4: Orders */}
											<td className="py-3.5 px-5">
												{provider.liveOrders > 0 || provider.deliveredOrders > 0 ? (
													<div className="space-y-0.5">
														<div className="font-bold text-xs md:text-sm text-[#1C1917] dark:text-stone-100">
															{provider.liveOrders} live
														</div>
														<div className="text-xs text-[#78716C] dark:text-stone-400">
															{provider.deliveredOrders} delivered
														</div>
													</div>
												) : (
													<div className="text-xs md:text-sm text-[#78716C] dark:text-stone-400">
														None yet
													</div>
												)}
											</td>

											{/* Column 5: Action */}
											<td className="py-3.5 px-5 text-right whitespace-nowrap">
												<Link
													href={`/admin/providers/${provider.id}`}
													className="inline-flex items-center justify-center rounded-full border border-[#EFECE6] dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-1 text-xs font-semibold text-[#1C1917] dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs"
												>
													View
												</Link>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</div>
	);
}
