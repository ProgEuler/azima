"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import {
	CaretRightIcon,
	ChatCircleDotsIcon,
	EnvelopeSimpleIcon,
	LockKeyIcon,
	MapPinIcon,
	PackageIcon,
	PencilSimpleIcon,
	PhoneIcon,
	StarIcon,
	TruckIcon,
	UserIcon,
	UsersThreeIcon,
} from "@phosphor-icons/react";

type DetailRowProps = {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
	hint?: string;
};

function DetailRow({ icon, label, value, hint }: DetailRowProps) {
	return (
		<div className="flex items-start gap-3 px-5 py-4">
			<div className="mt-0.5 shrink-0 text-[#78716C] dark:text-stone-400 [&_svg]:size-4.5">
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<div className="text-xs font-medium text-[#78716C] dark:text-stone-400">
					{label}
				</div>
				<div className="mt-0.5 text-sm font-semibold text-[#1C1917] dark:text-stone-100">
					{value}
				</div>
				{hint ? (
					<div className="mt-1 text-xs text-muted-foreground">{hint}</div>
				) : null}
			</div>
		</div>
	);
}

type SupportRowProps = {
	icon: React.ReactNode;
	title: string;
	meta?: string;
	onClick?: () => void;
};

function SupportRow({ icon, title, meta, onClick }: SupportRowProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#FAF8F5] dark:hover:bg-stone-800/40"
		>
			<div className="shrink-0 text-[#78716C] dark:text-stone-400 [&_svg]:size-5">
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<div className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
					{title}
				</div>
				{meta ? (
					<div className="mt-0.5 text-xs text-muted-foreground">{meta}</div>
				) : null}
			</div>
			<CaretRightIcon className="size-4 text-[#A8A29E] dark:text-stone-500 transition-transform group-hover:translate-x-0.5" />
		</button>
	);
}

function Toggle({
	checked,
	onChange,
}: {
	checked: boolean;
	onChange: (next: boolean) => void;
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={() => onChange(!checked)}
			className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
				checked ? "bg-[#8B351F]" : "bg-[#E7E5E4] dark:bg-stone-700"
			}`}
		>
			<span
				className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
					checked ? "translate-x-5" : "translate-x-0"
				}`}
			/>
		</button>
	);
}

export function ProviderAccount() {
	const [whatsappEnabled, setWhatsappEnabled] = useState(true);

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6 pb-16 font-sans">
			{/* Business profile */}
			<section className="overflow-hidden rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
				<div className="relative aspect-[16/6] w-full overflow-hidden bg-[#EFECE6] dark:bg-stone-800">
					<img
						src="/images/providers/mixed-grill.jpg"
						alt="Yummy Catering cover"
						className="h-full w-full object-cover"
					/>
				</div>

				<div className="flex items-start justify-between gap-4 px-5 pt-5">
					<div className="min-w-0">
						<h1 className="font-heading text-xl font-semibold tracking-tight text-[#1C1917] dark:text-stone-100">
							Yummy Catering
						</h1>
						<div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
							<span className="inline-flex items-center gap-1">
								<MapPinIcon className="size-3.5" />
								Beirut
							</span>
							<span className="inline-flex items-center gap-1">
								<StarIcon className="size-3.5 fill-amber-400 text-amber-400" weight="fill" />
								<span className="font-semibold text-[#1C1917] dark:text-stone-100">
									4.6
								</span>
								<span>(98)</span>
							</span>
						</div>
					</div>
					<Button variant="outline" size="sm">
						<PencilSimpleIcon className="size-4" />
						Edit details
					</Button>
				</div>

				<p className="px-5 pt-3 text-sm text-[#1C1917] dark:text-stone-200">
					Live grill stations and hot mains prepared on site, with a uniformed serving team.
				</p>

				<div className="mt-4 divide-y divide-[#F5F2EC] dark:divide-stone-800">
					<DetailRow
						icon={<UsersThreeIcon />}
						label="Bookings you accept"
						value={
							<>
								10–300 guests
								<span className="ml-2 text-xs font-normal text-muted-foreground">
									Hosts outside this range cannot select you.
								</span>
							</>
						}
					/>
					<DetailRow
						icon={<TruckIcon />}
						label="Delivery"
						value={<>Hamra · Verdun · Ras Beirut · Manara</>}
						hint="$15 delivery fee"
					/>
					<DetailRow
						icon={<PackageIcon />}
						label="Collection"
						value={<>Hosts can collect from you</>}
						hint="Hamra Street 118, Beirut"
					/>
					<DetailRow
						icon={<PhoneIcon />}
						label="Hosts call you on"
						value={<>+961 3 991 204</>}
					/>
				</div>
			</section>

			{/* Account details */}
			<div className="space-y-2">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-stone-400">
					Your details
				</h2>
				<section className="overflow-hidden rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
					<div className="flex items-center gap-4 px-5 py-4 border-b border-[#F5F2EC] dark:border-stone-800">
						<Avatar size="lg" className="bg-[#FCF4E7] dark:bg-amber-950/40 text-[#915B1E] dark:text-amber-300">
							<AvatarFallback className="bg-transparent font-semibold">HN</AvatarFallback>
						</Avatar>
						<div>
							<div className="text-xs font-medium text-[#78716C] dark:text-stone-400">
								Your photo
							</div>
							<div className="mt-0.5 text-sm font-semibold text-[#1C1917] dark:text-stone-100">
								No photo yet — your initials are shown
							</div>
						</div>
					</div>
					<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800">
						<DetailRow
							icon={<UserIcon />}
							label="Your name"
							value={<>Hadi Nassar</>}
						/>
						<DetailRow
							icon={<EnvelopeSimpleIcon />}
							label="Sign-in email"
							value={<>kitchen@yummy.example</>}
						/>
						<DetailRow
							icon={<PhoneIcon />}
							label="Phone hosts see"
							value={<>+961 3 991 204</>}
						/>
					</div>
				</section>
			</div>

			{/* How azima reaches you */}
			<div className="space-y-2">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-stone-400">
					How azima reaches you
				</h2>
				<section className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
					<div className="min-w-0 flex-1">
						<div className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
							Also message me on WhatsApp
						</div>
						<div className="mt-0.5 text-xs text-muted-foreground">
							If a push alert does not reach you, azima messages +961 3 991 204 as well.
						</div>
					</div>
					<Toggle checked={whatsappEnabled} onChange={setWhatsappEnabled} />
				</section>
			</div>

			{/* Support & security */}
			<div className="space-y-2">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-stone-400">
					Support &amp; security
				</h2>
				<section className="overflow-hidden rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
					<div className="divide-y divide-[#F5F2EC] dark:divide-stone-800">
						<SupportRow
							icon={<LockKeyIcon />}
							title="Change password"
							meta="Never changed"
						/>
						<SupportRow
							icon={<ChatCircleDotsIcon />}
							title="WhatsApp azima support"
							meta="+961 1 447 200"
						/>
						<SupportRow
							icon={<EnvelopeSimpleIcon />}
							title="Email support"
							meta="support@azima.app"
						/>
						<SupportRow
							icon={<PhoneIcon />}
							title="Call support"
							meta="+961 1 447 200"
						/>
					</div>
				</section>
			</div>
		</div>
	);
}
