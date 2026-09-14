"use client";

import { useEffect, useState } from "react";
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
import { CheckIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { MENU_COURSES, type MenuItem } from "@/components/provider/provider-mock-data";

export type NewMenuItemDraft = Omit<MenuItem, "id">;

const EMPTY_DRAFT: NewMenuItemDraft = {
	course: "Mezze & starters",
	title: "",
	description: "",
	pricePerGuest: 0,
};

export function NewMenuItemDialog({
	open,
	onOpenChange,
	editingItem,
	onSubmit,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingItem?: MenuItem | null;
	onSubmit: (draft: NewMenuItemDraft, id: string | null) => void;
}) {
	const [draft, setDraft] = useState<NewMenuItemDraft>(EMPTY_DRAFT);
	const isEditMode = Boolean(editingItem);

	useEffect(() => {
		if (!open) return;
		if (editingItem) {
			const { id: _id, ...rest } = editingItem;
			setDraft(rest);
		} else {
			setDraft(EMPTY_DRAFT);
		}
	}, [open, editingItem]);

	const isValid = draft.title.trim().length > 0 && draft.pricePerGuest > 0;

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!isValid) return;
		onSubmit(draft, editingItem?.id ?? null);
		setDraft(EMPTY_DRAFT);
		onOpenChange(false);
	}

	function handleCancel() {
		setDraft(EMPTY_DRAFT);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg p-0 overflow-hidden">
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
						<button
							type="button"
							className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#EFECE6] dark:border-stone-700 bg-[#FAF8F5] dark:bg-stone-900/40 px-4 py-8 text-center transition-colors hover:bg-[#F5F2EC] dark:hover:bg-stone-800/40"
						>
							<div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-stone-800 text-[#915B1E] dark:text-amber-400 shadow-2xs">
								<UploadSimpleIcon className="size-5" />
							</div>
							<div className="text-sm font-medium text-foreground">
								{isEditMode ? "Replace dish photo" : "Add a dish photo"}
							</div>
							<div className="text-xs text-muted-foreground">JPG or PNG, up to 6 MB</div>
						</button>
					</Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<Field label="Item name">
							<Input
								placeholder="Mixed mezze platter"
								value={draft.title}
								onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
							/>
						</Field>
						<Field label="Per guest">
							<Input
								type="number"
								min="0"
								step="0.5"
								placeholder="9"
								value={draft.pricePerGuest || ""}
								onChange={(e) =>
									setDraft((d) => ({
										...d,
										pricePerGuest: Number(e.target.value) || 0,
									}))
								}
							/>
						</Field>
					</div>

					<Field
						label="What arrives"
						hint="One line. A name on its own means nothing to a host who does not already know the dish."
					>
						<Input
							placeholder="Hummus, moutabal, vine leaves and warm pita"
							value={draft.description}
							onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
						/>
					</Field>

					<Field label="Course">
						<div className="flex flex-wrap gap-1.5">
							{MENU_COURSES.map((course) => {
								const isActive = course === draft.course;
								return (
									<button
										key={course}
										type="button"
										onClick={() => setDraft((d) => ({ ...d, course }))}
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

					<div className="flex items-center gap-2 pt-2">
						<Button type="button" variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!isValid}
							className="bg-[#FAF8F5] dark:bg-stone-800 text-muted-foreground hover:bg-[#F5F2EC] dark:hover:bg-stone-700"
						>
							<CheckIcon className="size-4" />
							{isEditMode ? "Save changes" : "Add to menu"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
