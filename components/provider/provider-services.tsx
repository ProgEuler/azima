"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FormError, QueryState } from "@/components/form-error";
import { MediaThumb } from "@/components/media-thumb";
import {
	EyeIcon,
	EyeSlashIcon,
	PencilSimpleIcon,
	PlusIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { NewMenuItemDialog } from "@/components/provider/new-menu-item-dialog";
import { useApi } from "@/hooks/use-api";
import {
	MENU_COURSES,
	menuApi,
	type MenuItem,
	type MenuItemInput,
} from "@/lib/api/provider";
import { money } from "@/lib/format";

export function ProviderServices() {
	const menu = useApi((signal) => menuApi.list(signal), []);
	const items: MenuItem[] = menu.data ?? [];
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
	const [actionError, setActionError] = useState<unknown>(null);

	function openAddDialog() {
		setEditingItem(null);
		setDialogOpen(true);
	}

	function openEditDialog(item: MenuItem) {
		setEditingItem(item);
		setDialogOpen(true);
	}

	async function handleSubmit(input: MenuItemInput, id: string | null) {
		if (id) await menuApi.update(id, input);
		else await menuApi.create(input);
		menu.reload();
	}

	async function run(action: () => Promise<unknown>) {
		setActionError(null);
		try {
			await action();
			menu.reload();
		} catch (error) {
			setActionError(error);
		}
	}

	function handleDelete(item: MenuItem) {
		if (!window.confirm(`Remove "${item.name}" from your menu? Past orders keep their record.`)) return;
		void run(() => menuApi.remove(item.id));
	}

	const orderableCount = items.filter((item) => item.is_available).length;
	const extraCourses = [...new Set(items.map((i) => i.category || "Other"))].filter(
		(c) => !(MENU_COURSES as readonly string[]).includes(c),
	);
	const coursesWithItems = [...MENU_COURSES, ...extraCourses].filter((course) =>
		items.some((item) => (item.category || "Other") === course),
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

			<FormError error={actionError} />
			<QueryState loading={menu.loading && !menu.data} error={menu.error} onRetry={menu.reload} label="Loading your menu…" />

			{menu.data && items.length === 0 ? (
				<EmptyState
					title="No menu items yet"
					description='Click "Add item" to create your first dish.'
				/>
			) : menu.data ? (
				<div className="space-y-8">
					{coursesWithItems.map((course) => {
						const courseItems = items.filter((item) => (item.category || "Other") === course);
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
											className={`group overflow-hidden rounded-2xl border border-[#EFECE6] dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] ${item.is_available ? "" : "opacity-60"}`}
										>
											<MediaThumb
												src={item.image}
												label={item.name}
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
												className="aspect-4/3 w-full rounded-none border-0"
											/>
											<div className="p-4 space-y-2">
												<h3 className="font-semibold text-sm text-[#1C1917] dark:text-stone-100">
													{item.name}
													{item.is_available ? null : (
														<span className="ml-2 text-[11px] font-medium text-muted-foreground">Hidden</span>
													)}
												</h3>
												<p className="text-xs text-muted-foreground line-clamp-2">
													{item.description}
												</p>
												<div className="flex items-baseline gap-1 pt-1">
													<span className="font-heading text-base font-semibold text-[#1C1917] dark:text-stone-100">
														{money(item.price)}
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
													onClick={() => void run(() => menuApi.setAvailable(item.id, !item.is_available))}
													className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[#1C1917] dark:text-stone-200 hover:bg-[#FAF8F5] dark:hover:bg-stone-800"
												>
													{item.is_available ? <EyeSlashIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
													{item.is_available ? "Hide" : "Show"}
												</button>
												<button
													type="button"
													onClick={() => handleDelete(item)}
													aria-label={`Delete ${item.name}`}
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
			) : null}

			<NewMenuItemDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				editingItem={editingItem}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
