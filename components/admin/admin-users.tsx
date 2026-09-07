"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { adminHostUsers, type AdminHostUser } from "@/lib/mock-data";

export function AdminUsers() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

	const filteredUsers = useMemo(() => {
		return adminHostUsers.filter((user) => {
			const matchesStatus =
				statusFilter === "all" || user.status === statusFilter;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				user.name.toLowerCase().includes(q) ||
				user.email.toLowerCase().includes(q) ||
				user.phone.toLowerCase().includes(q);

			return matchesStatus && matchesSearch;
		});
	}, [searchQuery, statusFilter]);

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-12 font-sans">
			{/* Page Subtitle */}
			<div>
				<p className="text-[#78716C] dark:text-stone-400 text-sm md:text-[15px] font-normal leading-relaxed">
					Host accounts on the customer app. Caterer businesses are under Providers.
				</p>
			</div>

			{/* Search and Filters Bar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
				{/* Search input with rounded border */}
				<div className="relative flex-1">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search name, phone or email"
						className="w-full h-11 rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900 px-4 text-sm text-[#1C1917] dark:text-stone-100 placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-700 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] transition-all"
					/>
				</div>

				{/* Status filter pills */}
				<div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
					<button
						type="button"
						onClick={() => setStatusFilter("all")}
						className={cn(
							"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
							statusFilter === "all"
								? "bg-[#7C2D12] text-white shadow-xs"
								: "bg-white dark:bg-stone-900 text-[#57524D] dark:text-stone-300 border border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
						)}
					>
						All
					</button>

					<button
						type="button"
						onClick={() => setStatusFilter("active")}
						className={cn(
							"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
							statusFilter === "active"
								? "bg-[#7C2D12] text-white shadow-xs"
								: "bg-white dark:bg-stone-900 text-[#57524D] dark:text-stone-300 border border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
						)}
					>
						Active
					</button>

					<button
						type="button"
						onClick={() => setStatusFilter("suspended")}
						className={cn(
							"rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
							statusFilter === "suspended"
								? "bg-[#7C2D12] text-white shadow-xs"
								: "bg-white dark:bg-stone-900 text-[#57524D] dark:text-stone-300 border border-[#EFECE6] dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
						)}
					>
						Suspended
					</button>
				</div>
			</div>

			{/* Users Table Container */}
			<div className="rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						{/* Table Header */}
						<thead>
							<tr className="bg-[#F8F4EE] dark:bg-stone-800/70 border-b border-[#EFECE6] dark:border-stone-800">
								<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
									Full name
								</th>
								<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
									Phone number
								</th>
								<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
									Occasions
								</th>
								<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
									Booked
								</th>
								<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400">
									Status
								</th>
								<th className="py-3.5 px-5 text-xs font-semibold text-[#78716C] dark:text-stone-400 text-right">
									Action
								</th>
							</tr>
						</thead>

						{/* Table Body */}
						<tbody className="divide-y divide-[#F5F2EC] dark:divide-stone-800/80">
							{filteredUsers.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="py-12 text-center text-sm text-[#78716C] dark:text-stone-400"
									>
										No users found matching your criteria.
									</td>
								</tr>
							) : (
								filteredUsers.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-[#FAF8F5]/60 dark:hover:bg-stone-800/40 transition-colors"
									>
										{/* Full Name & Avatar */}
										<td className="py-3.5 px-5">
											<div className="flex items-center gap-3.5">
												{user.avatarImage ? (
													<div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-stone-200/60 dark:border-stone-700 bg-stone-100">
														<Image
															src={user.avatarImage}
															alt={user.name}
															fill
															className="object-cover"
															sizes="40px"
														/>
													</div>
												) : (
													<div className="size-10 rounded-full shrink-0 flex items-center justify-center font-bold text-xs bg-[#FBF0EB] text-[#A3432B] dark:bg-amber-950/40 dark:text-amber-400 border border-[#F5E2DA] dark:border-amber-900/40">
														{user.avatarInitials}
													</div>
												)}

												<div className="space-y-0.5">
													<div className="font-bold text-sm text-[#1C1917] dark:text-stone-100">
														{user.name}
													</div>
													<div className="text-xs text-[#78716C] dark:text-stone-400">
														{user.email}
													</div>
												</div>
											</div>
										</td>

										{/* Phone Number */}
										<td className="py-3.5 px-5 text-xs md:text-sm font-medium text-[#1C1917] dark:text-stone-200 whitespace-nowrap">
											{user.phone}
										</td>

										{/* Occasions */}
										<td className="py-3.5 px-5 text-xs md:text-sm font-medium text-[#1C1917] dark:text-stone-200">
											{user.occasions}
										</td>

										{/* Booked */}
										<td className="py-3.5 px-5 text-xs md:text-sm font-bold text-[#1C1917] dark:text-stone-100 whitespace-nowrap">
											{user.booked}
										</td>

										{/* Status */}
										<td className="py-3.5 px-5 whitespace-nowrap">
											{user.status === "active" ? (
												<span className="inline-flex items-center rounded-full bg-[#EAF5EC] dark:bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-[#2D6A42] dark:text-emerald-300">
													active
												</span>
											) : (
												<span className="inline-flex items-center rounded-full bg-[#FDF0ED] dark:bg-red-950/50 px-3 py-1 text-xs font-semibold text-[#B83E28] dark:text-red-400">
													suspended
												</span>
											)}
										</td>

										{/* Action */}
										<td className="py-3.5 px-5 text-right whitespace-nowrap">
											<Link
												href={`/admin/users/${user.id}`}
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
		</div>
	);
}
