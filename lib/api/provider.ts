import { del, get, patch, post } from "@/lib/api/client"

export const MENU_COURSES = [
	"Mezze & starters",
	"Mains",
	"Sides",
	"Desserts",
	"Drinks",
] as const

export type MenuItem = {
	id: string
	name: string
	description: string
	category: string
	price: string
	image: string | null
	is_vegetarian: boolean
	is_available: boolean
	created_at: string
}

export type MenuItemInput = {
	name: string
	description: string
	category: string
	price: number
	/** New picture to upload. */
	imageFile?: File | null
	/** Clear the existing picture. */
	removeImage?: boolean
}

function toFormData(input: Partial<MenuItemInput>): FormData {
	const form = new FormData()
	if (input.name !== undefined) form.set("name", input.name)
	if (input.description !== undefined) form.set("description", input.description)
	if (input.category !== undefined) form.set("category", input.category)
	if (input.price !== undefined) form.set("price", String(input.price))
	if (input.imageFile) form.set("image", input.imageFile)
	if (input.removeImage) form.set("remove_image", "true")
	return form
}

export const menuApi = {
	list: (signal?: AbortSignal) =>
		get<MenuItem[]>("/provider/menu-items/", undefined, signal),
	create: (input: MenuItemInput) =>
		post<MenuItem>("/provider/menu-items/", toFormData(input)),
	update: (id: string, input: Partial<MenuItemInput>) =>
		patch<MenuItem>(`/provider/menu-items/${id}/`, toFormData(input)),
	setAvailable: (id: string, available: boolean) =>
		patch<MenuItem>(`/provider/menu-items/${id}/`, { is_available: available }),
	remove: (id: string) => del(`/provider/menu-items/${id}/`),
}
