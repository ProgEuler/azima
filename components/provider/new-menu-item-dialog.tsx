"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/form-error";
import { CheckIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { mediaUrl } from "@/lib/api/client";
import {
	MENU_COURSES,
	type MenuItem,
	type MenuItemInput,
} from "@/lib/api/provider";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function NewMenuItemDialog({
	open,
	onOpenChange,
	editingItem,
	onSubmit,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingItem?: MenuItem | null;
	onSubmit: (input: MenuItemInput, id: string | null) => Promise<void>;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg p-0 overflow-hidden">
				{/* Remounting per item resets the form without effects. */}
				<MenuItemForm
					key={editingItem?.id ?? "new"}
					editingItem={editingItem ?? null}
					onCancel={() => onOpenChange(false)}
					onSubmit={async (input) => {
						await onSubmit(input, editingItem?.id ?? null);
						onOpenChange(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}

function MenuItemForm({
	editingItem,
	onCancel,
	onSubmit,
}: {
	editingItem: MenuItem | null;
	onCancel: () => void;
	onSubmit: (input: MenuItemInput) => Promise<void>;
}) {
	const isEditMode = Boolean(editingItem);
	const fileInput = useRef<HTMLInputElement>(null);
	const [name, setName] = useState(editingItem?.name ?? "");
	const [price, setPrice] = useState(editingItem ? Number(editingItem.price) : 0);
	const [description, setDescription] = useState(editingItem?.description ?? "");
	const [category, setCategory] = useState(editingItem?.category || MENU_COURSES[0]);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(mediaUrl(editingItem?.image));
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const isValid = name.trim().length > 0 && price > 0;

	function pickImage(file: File | undefined) {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setError(new Error("Choose a JPG, PNG or WebP image."));
			return;
		}
		if (file.size > MAX_IMAGE_BYTES) {
			setError(new Error("Images must be 5 MB or smaller."));
			return;
		}
		setError(null);
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!isValid || busy) return;
		setBusy(true);
		setError(null);
		try {
			await onSubmit({
				name: name.trim(),
				description: description.trim(),
				category,
				price,
				imageFile,
			});
		} catch (e) {
			setError(e);
			setBusy(false);
		}
	}

	return (
		<>
			<DialogHeader className="px-6 pt-5 pb-2">
				<DialogTitle className="text-lg font-semibold">
					{isEditMode ? "Edit menu item" : "New menu item"}
				</DialogTitle>
				<DialogDescription>
					Hosts order against this price, multiplied by their guest count.
				</DialogDescription>
			</DialogHeader>

			<form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
				<Field label="Photo" hint="A stand-in is used until you add one.">
					<input
						ref={fileInput}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						className="sr-only"
						onChange={(e) => pickImage(e.target.files?.[0])}
					/>
					<button
						type="button"
						onClick={() => fileInput.current?.click()}
						className="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-[#EFECE6] dark:border-stone-700 bg-[#FAF8F5] dark:bg-stone-900/40 px-4 py-8 text-center transition-colors hover:bg-[#F5F2EC] dark:hover:bg-stone-800/40"
					>
						{imagePreview ? (
							<Image
								src={imagePreview}
								alt="Dish photo preview"
								fill
								unoptimized
								className="object-cover opacity-90"
							/>
						) : null}
						<div className="relative flex size-10 items-center justify-center rounded-full bg-white dark:bg-stone-800 text-[#915B1E] dark:text-amber-400 shadow-2xs">
							<UploadSimpleIcon className="size-5" />
						</div>
						<div className="relative rounded-md bg-white/80 px-2 text-sm font-medium text-foreground dark:bg-stone-900/70">
							{imagePreview ? "Replace dish photo" : "Add a dish photo"}
						</div>
						<div className="relative text-xs text-muted-foreground">JPG, PNG or WebP, up to 5 MB</div>
					</button>
				</Field>

				<div className="grid gap-4 sm:grid-cols-2">
					<Field label="Item name">
						<Input
							placeholder="Mixed mezze platter"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Field>
					<Field label="Per guest">
						<Input
							type="number"
							min="0"
							step="0.5"
							placeholder="9"
							value={price || ""}
							onChange={(e) => setPrice(Number(e.target.value) || 0)}
						/>
					</Field>
				</div>

				<Field
					label="What arrives"
					hint="One line. A name on its own means nothing to a host who does not already know the dish."
				>
					<Input
						placeholder="Hummus, moutabal, vine leaves and warm pita"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</Field>

				<Field label="Course">
					<div className="flex flex-wrap gap-1.5">
						{MENU_COURSES.map((course) => {
							const isActive = course === category;
							return (
								<button
									key={course}
									type="button"
									onClick={() => setCategory(course)}
									className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
										isActive
											? "bg-[#8B351F] text-white"
											: "bg-[#FAF8F5] dark:bg-stone-900/60 text-[#1C1917] dark:text-stone-200 border border-[#EFECE6] dark:border-stone-800 hover:bg-[#F5F2EC] dark:hover:bg-stone-800"
									}`}
								>
									{isActive ? <CheckIcon className="size-3" /> : null}
									{course}
								</button>
							);
						})}
					</div>
				</Field>

				<FormError error={error} />

				<div className="flex items-center gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={!isValid || busy}
						className="bg-[#8B351F] text-white hover:bg-[#6B2817] disabled:bg-[#FAF8F5] disabled:text-muted-foreground dark:disabled:bg-stone-800"
					>
						<CheckIcon className="size-4" />
						{busy ? "Saving…" : isEditMode ? "Save changes" : "Add to menu"}
					</Button>
				</div>
			</form>
		</>
	);
}
