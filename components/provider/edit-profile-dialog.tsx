"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/form-error";
import { mediaUrl } from "@/lib/api/client";
import { providerApi, type ProviderProfile } from "@/lib/api/provider";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Edit the kitchen's public details, trading terms and contact numbers. */
export function EditProfileDialog({
	open,
	onOpenChange,
	profile,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	profile: ProviderProfile;
	onSaved: (profile: ProviderProfile) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
				<ProfileForm profile={profile} onCancel={() => onOpenChange(false)} onSaved={(p) => { onSaved(p); onOpenChange(false); }} />
			</DialogContent>
		</Dialog>
	);
}

function ProfileForm({
	profile,
	onCancel,
	onSaved,
}: {
	profile: ProviderProfile;
	onCancel: () => void;
	onSaved: (profile: ProviderProfile) => void;
}) {
	const fileInput = useRef<HTMLInputElement>(null);
	const [form, setForm] = useState({
		business_name: profile.business_name,
		owner_name: profile.owner_name,
		phone: profile.phone,
		city: profile.city,
		description: profile.description,
		smallest_order: profile.smallest_order?.toString() ?? "",
		largest_order: profile.largest_order?.toString() ?? "",
		delivery_areas: profile.delivery_areas.join(", "),
		delivery_fee: profile.delivery_fee,
		allows_collection: profile.allows_collection,
		collection_address: profile.collection_address,
	});
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverPreview, setCoverPreview] = useState<string | null>(mediaUrl(profile.cover_image));
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<unknown>(null);
	const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [key]: value }));

	function pickCover(file: File | undefined) {
		if (!file) return;
		if (!file.type.startsWith("image/")) return setError(new Error("Choose a JPG, PNG or WebP image."));
		if (file.size > MAX_IMAGE_BYTES) return setError(new Error("Images must be 5 MB or smaller."));
		setError(null);
		setCoverFile(file);
		setCoverPreview(URL.createObjectURL(file));
	}

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		setBusy(true);
		setError(null);
		try {
			let saved = await providerApi.updateProfile({
				business_name: form.business_name.trim(),
				owner_name: form.owner_name.trim(),
				phone: form.phone.trim(),
				city: form.city.trim(),
				description: form.description.trim(),
				smallest_order: form.smallest_order ? Number(form.smallest_order) : null,
				largest_order: form.largest_order ? Number(form.largest_order) : null,
				delivery_areas: form.delivery_areas.split(",").map((a) => a.trim()).filter(Boolean),
				delivery_fee: Number(form.delivery_fee) || 0,
				allows_collection: form.allows_collection,
				collection_address: form.collection_address.trim(),
			});
			if (coverFile) saved = await providerApi.uploadCover(coverFile);
			onSaved(saved);
		} catch (e) {
			setError(e);
			setBusy(false);
		}
	}

	return (
		<>
			<DialogHeader className="px-6 pt-5 pb-2">
				<DialogTitle className="text-lg font-semibold">Edit your details</DialogTitle>
				<DialogDescription>What hosts see, and the terms you take orders on.</DialogDescription>
			</DialogHeader>
			<form onSubmit={submit} className="space-y-4 px-6 pb-6">
				<Field label="Cover photo">
					<input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pickCover(e.target.files?.[0])} />
					<button
						type="button"
						onClick={() => fileInput.current?.click()}
						className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#EFECE6] dark:border-stone-700 bg-[#FAF8F5] dark:bg-stone-900/40 text-sm font-medium"
					>
						{coverPreview ? <Image src={coverPreview} alt="Cover preview" fill unoptimized className="object-cover opacity-80" /> : null}
						<span className="relative inline-flex items-center gap-2 rounded-md bg-white/85 px-3 py-1 dark:bg-stone-900/80">
							<UploadSimpleIcon className="size-4" />
							{coverPreview ? "Replace cover photo" : "Add a cover photo"}
						</span>
					</button>
				</Field>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field label="Business name"><Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} /></Field>
					<Field label="City"><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
					<Field label="Your name"><Input value={form.owner_name} onChange={(e) => set("owner_name", e.target.value)} /></Field>
					<Field label="Phone hosts call"><Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
				</div>
				<Field label="What you are known for">
					<Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
				</Field>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field label="Smallest order (guests)"><Input type="number" min="1" value={form.smallest_order} onChange={(e) => set("smallest_order", e.target.value)} /></Field>
					<Field label="Largest order (guests)"><Input type="number" min="1" value={form.largest_order} onChange={(e) => set("largest_order", e.target.value)} /></Field>
				</div>
				<div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
					<Field label="Areas you deliver to" hint="Separate with commas."><Input placeholder="Hamra, Verdun, Manara" value={form.delivery_areas} onChange={(e) => set("delivery_areas", e.target.value)} /></Field>
					<Field label="Delivery fee ($)"><Input type="number" min="0" step="0.5" value={form.delivery_fee} onChange={(e) => set("delivery_fee", e.target.value)} /></Field>
				</div>
				<label className="flex items-center gap-2 text-sm">
					<input type="checkbox" checked={form.allows_collection} onChange={(e) => set("allows_collection", e.target.checked)} className="size-4" />
					Hosts can collect from me
				</label>
				{form.allows_collection ? (
					<Field label="Collection address"><Input value={form.collection_address} onChange={(e) => set("collection_address", e.target.value)} /></Field>
				) : null}

				<FormError error={error} />
				<div className="flex items-center gap-2 pt-1">
					<Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
					<Button type="submit" disabled={busy || !form.business_name.trim()}>{busy ? "Saving…" : "Save changes"}</Button>
				</div>
			</form>
		</>
	);
}
