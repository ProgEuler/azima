"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
	EyeSlashIcon,
	PencilSimpleIcon,
	PlusIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { NewMenuItemDialog, type NewMenuItemDraft } from "@/components/provider/new-menu-item-dialog";
import {
	INITIAL_MENU_ITEMS,
	MENU_COURSES,
	type MenuItem,
} from "@/components/provider/provider-mock-data";

function formatPrice(value: number) {
	return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

export function ProviderServices() {
	const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

	function openAddDialog() {
		setEditingItem(null);
		setDialogOpen(true);
	}

	function openEditDialog(item: MenuItem) {
		setEditingItem(item);
		setDialogOpen(true);
	}

	function handleSubmit(draft: NewMenuItemDraft, id: string | null) {
		if (id) {
			setItems((prev) =>
				prev.map((item) => (item.id === id ? { ...item, ...draft } : item)),
			);
		} else {
			setItems((prev) => [...prev, { ...draft, id: crypto.randomUUID() }]);
		}
		setEditingItem(null);
	}

	function handleDelete(id: string) {
		setItems((prev) => prev.filter((item) => item.id !== id));
	}

	const orderableCount = items.length;
	const coursesWithItems = MENU_COURSES.filter((course) =>
		items.some((item) => item.course === course),
	);

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 pb-16 font-sans">
			<SectionHeader
				title="Menu"
				description={`${orderableCount} orderable items`}
				action={
					<Button
						onClick={openAddDialog}
						className="bg-[#8B351F] hover:bg-[#6B2817] text-white"
					>
						<PlusIcon className="size-4" />
						Add item
					</Button>
				}
			/>

			{items.length === 0 ? (
				<EmptyState
					title="No menu items yet"
					description='Click "Add item" to create your first dish.'
				/>
			) : (
				<div className="space-y-8">
					{coursesWithItems.map((course) => {
						const courseItems = items.filter((item) => item.course === course);
						return (
							<section key={course} className="space-y-3">
								<h2 className="font-medium text-sm text-[#1C1917] dark:text-stone-200">
									{course} <span className="text-muted-foreground">· {courseItems.length}</span>
								</h2>
								<div
									className={`grid gap-4 ${
										courseItems.length === 1
											? "grid-cols-1 sm:max-w-sm"
											: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
									}`}
								>
									{courseItems.map((item) => (
										<article
											key={item.id}
											className="group overflow-hidden rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]"
										>
											<div className="relative aspect-4/3 w-full overflow-hidden bg-[#EFECE6] dark:bg-stone-800">
												{item.imageSrc ? (
													<Image
														src={item.imageSrc}
														alt={item.title}
														fill
														sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
														className="object-cover"
													/>
												) : null}
											</div>
											<div className="p-4 space-y-2">
												<h3 className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
													{item.title}
												</h3>
												<p className="text-xs text-muted-foreground line-clamp-2">
													{item.description}
												</p>
												<div className="flex items-baseline gap-1 pt-1">
													<span className="font-heading text-base font-semibold text-[#1C1917] dark:text-stone-100">
														{formatPrice(item.pricePerGuest)}
													</span>
													<span className="text-xs text-muted-foreground">per guest</span>
												</div>
											</div>
											<div className="flex items-center justify-between border-t border-[#F5F2EC] dark:border-stone-800 px-4 py-2">
												<button
													type="button"
													onClick={() => openEditDialog(item)}
													className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[#1C1917] dark:text-stone-200 hover:bg-[#FAF8F5] dark:hover:bg-stone-800"
												>
													<PencilSimpleIcon className="size-3.5" />
													Edit
												</button>
												<button
													type="button"
													className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[#1C1917] dark:text-stone-200 hover:bg-[#FAF8F5] dark:hover:bg-stone-800"
												>
													<EyeSlashIcon className="size-3.5" />
													Hide
												</button>
												<button
													type="button"
													onClick={() => handleDelete(item.id)}
													aria-label={`Delete ${item.title}`}
													className="inline-flex size-7 items-center justify-center rounded-md text-[#915B1E] dark:text-amber-400 hover:bg-[#FCF4E7] dark:hover:bg-amber-950/40"
												>
													<TrashIcon className="size-3.5" />
												</button>
											</div>
										</article>
									))}
								</div>
							</section>
						);
					})}
				</div>
			)}

			<NewMenuItemDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				editingItem={editingItem}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
