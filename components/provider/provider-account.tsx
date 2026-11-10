"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/form-error";
import { EditProfileDialog } from "@/components/provider/edit-profile-dialog";
import { ChangePasswordDialog } from "@/components/provider/change-password-dialog";
import { useApi } from "@/hooks/use-api";
import { mediaUrl } from "@/lib/api/client";
import { providerApi } from "@/lib/api/provider";
import { supportApi } from "@/lib/api/support";
import { dateLabel, guestRange, initials, money } from "@/lib/format";
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
	const profileQuery = useApi((signal) => providerApi.profile(signal), []);
	const support = useApi((signal) => supportApi.contacts(signal), []);
	const [editOpen, setEditOpen] = useState(false);
	const [passwordOpen, setPasswordOpen] = useState(false);
	const [whatsappError, setWhatsappError] = useState<string | null>(null);

	const profile = profileQuery.data;
	if (!profile) {
		return (
			<div className="mx-auto w-full max-w-3xl">
				<QueryState loading={profileQuery.loading} error={profileQuery.error} onRetry={profileQuery.reload} label="Loading your account…" />
			</div>
		);
	}

	const cover = mediaUrl(profile.cover_image);
	const contacts = support.data;

	async function setWhatsapp(next: boolean) {
		setWhatsappError(null);
		const previous = profile!;
		profileQuery.setData({ ...previous, whatsapp_notification: next });
		try {
			profileQuery.setData(await providerApi.updateProfile({ whatsapp_notification: next }));
		} catch (e) {
			profileQuery.setData(previous);
			setWhatsappError(e instanceof Error ? e.message : "Could not save.");
		}
	}

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6 pb-16 font-sans">
			{/* Business profile */}
			<section className="overflow-hidden rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
				<div className="relative aspect-[16/6] w-full overflow-hidden bg-[#EFECE6] dark:bg-stone-800">
					{cover ? (
						<Image src={cover} alt={`${profile.business_name} cover`} fill unoptimized className="object-cover" />
					) : (
						<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
							No cover photo yet
						</div>
					)}
				</div>

				<div className="flex items-start justify-between gap-4 px-5 pt-5">
					<div className="min-w-0">
						<h1 className="font-heading text-xl font-semibold tracking-tight text-[#1C1917] dark:text-stone-100">
							{profile.business_name}
						</h1>
						<div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
							{profile.city ? (
								<span className="inline-flex items-center gap-1">
									<MapPinIcon className="size-3.5" />
									{profile.city}
								</span>
							) : null}
							{profile.reviews_count > 0 ? (
								<span className="inline-flex items-center gap-1">
									<StarIcon className="size-3.5 fill-amber-400 text-amber-400" weight="fill" />
									<span className="font-semibold text-[#1C1917] dark:text-stone-100">
										{Number(profile.rating_avg).toFixed(1)}
									</span>
									<span>({profile.reviews_count})</span>
								</span>
							) : (
								<span>No reviews yet</span>
							)}
						</div>
					</div>
					<Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
						<PencilSimpleIcon className="size-4" />
						Edit details
					</Button>
				</div>

				{profile.description ? (
					<p className="px-5 pt-3 text-sm text-[#1C1917] dark:text-stone-200">{profile.description}</p>
				) : null}

				<div className="mt-4 divide-y divide-[#F5F2EC] dark:divide-stone-800">
					<DetailRow
						icon={<UsersThreeIcon />}
						label="Bookings you accept"
						value={
							<>
								{guestRange(profile.smallest_order, profile.largest_order)}
								<span className="ml-2 text-xs font-normal text-muted-foreground">
									Hosts outside this range cannot select you.
								</span>
							</>
						}
					/>
					<DetailRow
						icon={<TruckIcon />}
						label="Delivery"
						value={<>{profile.delivery_areas.length ? profile.delivery_areas.join(" · ") : "No delivery areas set"}</>}
						hint={`${money(profile.delivery_fee)} delivery fee`}
					/>
					<DetailRow
						icon={<PackageIcon />}
						label="Collection"
						value={<>{profile.allows_collection ? "Hosts can collect from you" : "Delivery only"}</>}
						hint={profile.allows_collection ? profile.collection_address : undefined}
					/>
					<DetailRow
						icon={<PhoneIcon />}
						label="Hosts call you on"
						value={<>{profile.phone || "—"}</>}
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
							<AvatarFallback className="bg-transparent font-semibold">
								{initials(profile.owner_name || profile.business_name)}
							</AvatarFallback>
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
							value={<>{profile.owner_name || "Not set"}</>}
						/>
						<DetailRow
							icon={<EnvelopeSimpleIcon />}
							label="Sign-in email"
							value={<>{profile.email ?? "—"}</>}
						/>
						<DetailRow
							icon={<PhoneIcon />}
							label="Phone hosts see"
							value={<>{profile.phone || "—"}</>}
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
							If a push alert does not reach you, azima messages {profile.phone || "your phone"} as well.
						</div>
						{whatsappError ? <div className="mt-1 text-xs text-destructive">{whatsappError}</div> : null}
					</div>
					<Toggle checked={profile.whatsapp_notification} onChange={(next) => void setWhatsapp(next)} />
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
							meta={profile.password_changed_at ? `Last changed ${dateLabel(profile.password_changed_at)}` : "Never changed"}
							onClick={() => setPasswordOpen(true)}
						/>
						{contacts?.whatsapp ? (
							<SupportRow
								icon={<ChatCircleDotsIcon />}
								title="WhatsApp azima support"
								meta={contacts.whatsapp}
								onClick={() => window.open(`https://wa.me/${contacts.whatsapp.replace(/[^0-9]/g, "")}`, "_blank", "noopener")}
							/>
						) : null}
						{contacts?.email ? (
							<SupportRow
								icon={<EnvelopeSimpleIcon />}
								title="Email support"
								meta={contacts.email}
								onClick={() => { window.location.href = `mailto:${contacts.email}`; }}
							/>
						) : null}
						{contacts?.phone ? (
							<SupportRow
								icon={<PhoneIcon />}
								title="Call support"
								meta={contacts.phone}
								onClick={() => { window.location.href = `tel:${contacts.phone}`; }}
							/>
						) : null}
					</div>
				</section>
			</div>

			<EditProfileDialog
				open={editOpen}
				onOpenChange={setEditOpen}
				profile={profile}
				onSaved={(saved) => profileQuery.setData(saved)}
			/>
			<ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} onChanged={profileQuery.reload} />
		</div>
	);
}
