import type { NoticePeriod, OrderEvent, PaymentInfo, RequestMode } from "@/lib/api/admin"
import { del, get, getPage, patch, post, type Paginated } from "@/lib/api/client"

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

// ------------------------------------------------------------------
// Requests / orders
// ------------------------------------------------------------------

export type ProviderOrder = {
	id: string
	order_number: string
	title: string
	meal_type: string
	status: string
	status_label: string
	status_changed_at: string
	created_at: string
	fulfillment: "delivery" | "pickup"
	guest_count: number
	delivery_date: string
	delivery_time: string | null
	delivery_address: string
	special_instructions: string
	subtotal: string
	delivery_fee: string
	total_amount: string
	payment: PaymentInfo
	host: { name: string; phone: string | null }
	items: Array<{
		id: string
		item_name: string
		unit_price: string
		quantity: number
		total_price: string
		image: string | null
	}>
	next_action:
		| { type: "respond"; label: string }
		| { type: "advance"; to: string; label: string }
		| null
	responded_at: string | null
	contacted_at: string | null
	contact_note: string
	delivered_at: string | null
	cancelled_reason: string
}

export type ProviderOrderDetail = ProviderOrder & { events: OrderEvent[] }

export type OrderTabId = "needs_response" | "active" | "completed"

export type ProviderOrderList = Paginated<ProviderOrder> & {
	counts: Record<OrderTabId, number>
}

export const ordersApi = {
	list: (
		query: { tab: OrderTabId; q?: string; sort?: "soonest" | "newest"; page_size?: number },
		signal?: AbortSignal,
	) => getPage<ProviderOrder>("/provider/orders/", query, signal) as Promise<ProviderOrderList>,
	detail: (id: string, signal?: AbortSignal) =>
		get<ProviderOrderDetail>(`/provider/orders/${id}/`, undefined, signal),
	accept: (id: string) => post<ProviderOrderDetail>(`/provider/orders/${id}/accept/`),
	reject: (id: string, reason = "") =>
		post<ProviderOrderDetail>(`/provider/orders/${id}/reject/`, { reason }),
	advance: (id: string, body: { note?: string; cash_collected?: boolean } = {}) =>
		post<ProviderOrderDetail>(`/provider/orders/${id}/advance/`, body),
}

// ------------------------------------------------------------------
// Dashboard, profile, availability, calendar, earnings
// ------------------------------------------------------------------

export type Dashboard = {
	waiting_for_reply: { count: number; total_amount: string }
	money_on_accepted_work: {
		cash_to_collect: string
		cash_orders: number
		paid_online: string
		online_orders: number
	}
	earned_this_month: {
		amount: string
		orders_completed: number
		next_7_days: { jobs: number; guests: number }
	}
	settings: {
		request_mode: RequestMode
		order_notice_period: NoticePeriod
		closed_dates_count: number
	}
}

export type ProviderProfile = {
	id: string
	business_name: string
	owner_name: string
	email: string | null
	phone: string
	description: string
	city: string
	service_types: string[]
	cover_image: string | null
	logo: string | null
	smallest_order: number | null
	largest_order: number | null
	order_notice_period: NoticePeriod
	request_mode: RequestMode
	delivery_areas: string[]
	delivery_fee: string
	allows_collection: boolean
	collection_address: string
	rating_avg: string
	reviews_count: number
	whatsapp_notification: boolean
	password_changed_at: string | null
	closed_dates_count: number
}

export type ProfileUpdate = Partial<
	Pick<
		ProviderProfile,
		| "business_name"
		| "owner_name"
		| "phone"
		| "description"
		| "city"
		| "service_types"
		| "smallest_order"
		| "largest_order"
		| "order_notice_period"
		| "request_mode"
		| "delivery_areas"
		| "allows_collection"
		| "collection_address"
		| "whatsapp_notification"
	>
> & { delivery_fee?: number }

export type CloseDate = { id: string; date: string; reason: string }

export type CalendarData = {
	events: ProviderOrder[]
	closed_dates: CloseDate[]
}

export type MonthEarnings = {
	month: string
	total: string
	jobs_delivered: number
	cash_amount: string
	online_amount: string
	jobs: Array<{
		order_id: string
		order_number: string
		title: string
		date: string
		guests: number
		amount: string
		method: "cash_on_delivery" | "online"
	}>
}

export const providerApi = {
	dashboard: (signal?: AbortSignal) => get<Dashboard>("/provider/dashboard/", undefined, signal),
	profile: (signal?: AbortSignal) => get<ProviderProfile>("/provider/profile/", undefined, signal),
	updateProfile: (body: ProfileUpdate) => patch<ProviderProfile>("/provider/profile/", body),
	uploadCover: (file: File) => {
		const form = new FormData()
		form.set("cover_image", file)
		return patch<ProviderProfile>("/provider/profile/", form)
	},
	closeDates: (signal?: AbortSignal) => get<CloseDate[]>("/provider/close-dates/", undefined, signal),
	closeDate: (body: { date_from: string; date_to?: string; reason?: string }) =>
		post<CloseDate[]>("/provider/close-dates/", body),
	reopenDate: (id: string) => del(`/provider/close-dates/${id}/`),
	calendar: (start: string, end: string, signal?: AbortSignal) =>
		get<CalendarData>("/provider/calendar/", { start, end }, signal),
	earnings: (months = 6, signal?: AbortSignal) =>
		get<MonthEarnings[]>("/provider/earnings/", { months }, signal),
	changePassword: (oldPassword: string, newPassword: string) =>
		post<null>("/accounts/user/change-password/", {
			old_password: oldPassword,
			new_password: newPassword,
		}),
}
