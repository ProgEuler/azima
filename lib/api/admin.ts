import { del, get, getPage, post, type Paginated } from "@/lib/api/client"

export type RequestMode = "review" | "auto" | "not_accepting"
export type NoticePeriod = "instant" | "at_least_48_hours"

export type AdminProvider = {
	id: string
	business_name: string
	owner_name: string
	city: string
	phone: string
	email: string | null
	logo: string | null
	cover_image: string | null
	service_types: string[]
	rating_avg: string
	reviews_count: number
	smallest_order: number | null
	largest_order: number | null
	request_mode: RequestMode
	order_notice_period: NoticePeriod
	is_suspended: boolean
	live_orders: number
	delivered_orders: number
}

export type AdminProviderDetail = AdminProvider & {
	description: string
	created_at: string
	suspension_reason: string
	suspended_at: string | null
	stats: {
		acceptance_rate: number | null
		acceptance_decisions: number
		menu_items_count: number
		price_min: string | null
		price_max: string | null
	}
	trading_terms: {
		request_mode: RequestMode
		order_notice_period: NoticePeriod
		smallest_order: number | null
		largest_order: number | null
		delivery_areas: string[]
		delivery_fee: string
		allows_collection: boolean
		collection_address: string
		close_dates: string[]
	}
	menu: Array<{
		id: string
		name: string
		description: string
		image: string | null
		category: string
		price: string
		is_available: boolean
	}>
	orders: Array<{
		id: string
		order_number: string
		title: string
		delivery_date: string
		guest_count: number
		total_amount: string
		status: string
		status_label: string
	}>
}

export type PendingApplication = {
	id: string
	business_name: string
	email: string | null
	phone: string
	service_types: string[]
	city: string
	description: string
	smallest_order: number | null
	largest_order: number | null
	order_notice_period: NoticePeriod
	status: string
	created_at: string
}

export type ProviderList = Paginated<AdminProvider> & {
	counts: { all: number; active: number; suspended: number }
}

export type AdminUser = {
	id: string
	full_name: string
	email: string | null
	phone: string | null
	avatar: string | null
	address: string
	created_at: string
	is_suspended: boolean
	occasions_count: number
	orders_count: number
	cancelled_orders: number
	booked_total: string
}

export type AdminUserDetail = AdminUser & {
	live_occasions: number
	cancellation_rate: number
	suspension_reason: string
	suspended_at: string | null
	occasions: Array<{
		id: string
		title: string
		event_date: string
		meal_type: string
		guests: number | null
		is_active: boolean
		amount: string
		status: string | null
		status_label: string | null
	}>
}

export type UserList = Paginated<AdminUser> & {
	counts: { all: number; active: number; suspended: number }
}

export type PaymentInfo = {
	method: "cash_on_delivery" | "online"
	method_label: string
	status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded"
	amount: string
	paid_at: string | null
} | null

export type AdminOrderRow = {
	id: string
	order_number: string
	title: string
	meal_type: string
	delivery_date: string
	delivery_time: string | null
	guest_count: number
	total_amount: string
	status: string
	status_label: string
	status_changed_at: string
	created_at: string
	host: { id: string; name: string }
	provider: { id: string; business_name: string }
	payment: PaymentInfo
}

export type OrderEvent = {
	id: string
	actor: "customer" | "provider" | "admin" | "system"
	message: string
	created_at: string
}

export type AdminOrderDetail = Omit<AdminOrderRow, "host" | "provider"> & {
	host: { id: string; name: string; email: string | null; phone: string | null }
	provider: { id: string; business_name: string; city: string; phone: string }
	fulfillment: "delivery" | "pickup"
	delivery_address: string
	special_instructions: string
	subtotal: string
	delivery_fee: string
	milestones: {
		caterer_decision: { state: "accepted" | "declined" | "pending"; at: string | null }
		host_contacted: { note: string; at: string | null }
		delivery: { at: string | null; status: string }
	}
	items: Array<{
		id: string
		item_name: string
		unit_price: string
		quantity: number
		total_price: string
		image: string | null
	}>
	events: OrderEvent[]
	audit_records: Array<{
		id: string
		action: string
		message: string
		reason: string
		actor: string | null
		created_at: string
	}>
	cancelled_reason: string
	cancelled_by: string
}

export type OrderTab = "all" | "awaiting" | "in_progress" | "delivered" | "declined"
export type OrderScope = "any" | "open" | "week"

export type OrderList = Paginated<AdminOrderRow> & {
	counts: Record<OrderTab, number>
}

export type Overview = {
	money: {
		cash_to_collect: { amount: string; orders: number }
		paid_online: { amount: string; orders: number }
		cash_owed: { amount: string; orders: number }
		booked_this_month: { amount: string; last_month: string }
	}
	pipeline: Array<{ id: string; label: string; count: number }>
	overdue_replies: number
	orders_in_progress: {
		total: number
		items: Array<{
			id: string
			order_number: string
			host: string
			provider: string
			title: string
			guest_count: number
			total_amount: string
			stage: string
			status: string
			hours_in_stage: number
			is_overdue: boolean
		}>
	}
	upcoming_seven_days: Array<{
		id: string
		title: string
		meal_type: string
		event_date: string
		start_time: string | null
		guests: number | null
		host: string
		caterers: string[]
		amount: string | number
		state: "covered" | "awaiting" | "nofood"
	}>
}

export type DeliveryAttempt = {
	channel: "push" | "whatsapp" | "sms"
	status: "queued" | "delivered" | "failed"
	error: string
	created_at: string
}

export type DeliveryItem = {
	id: string
	type: string
	title: string
	body: string
	delivery_state: "sending" | "first_try" | "backup" | "failed"
	created_at: string
	recipient: { id: string; name: string; role: string }
	attempts: DeliveryAttempt[]
}

export type NotificationDelivery = {
	days: number
	summary: { total: number; first_try: number; backup: number; failed: number; sending: number }
	never_arrived: DeliveryItem[]
	needed_backup: DeliveryItem[]
	still_sending: DeliveryItem[]
}

export const adminApi = {
	providers: (
		query: { status?: string; q?: string; page?: number; page_size?: number },
		signal?: AbortSignal,
	) => getPage<AdminProvider>("/admin/providers/", query, signal) as Promise<ProviderList>,
	provider: (id: string, signal?: AbortSignal) =>
		get<AdminProviderDetail>(`/admin/providers/${id}/`, undefined, signal),
	suspendProvider: (id: string, reason: string) =>
		post<AdminProvider>(`/admin/providers/${id}/suspend/`, { reason }),
	reinstateProvider: (id: string) =>
		post<AdminProvider>(`/admin/providers/${id}/reinstate/`),
	users: (
		query: { status?: string; q?: string; page?: number; page_size?: number },
		signal?: AbortSignal,
	) => getPage<AdminUser>("/admin/users/", query, signal) as Promise<UserList>,
	user: (id: string, signal?: AbortSignal) =>
		get<AdminUserDetail>(`/admin/users/${id}/`, undefined, signal),
	suspendUser: (id: string, reason: string) =>
		post<AdminUserDetail>(`/admin/users/${id}/suspend/`, { reason }),
	reinstateUser: (id: string) => post<AdminUserDetail>(`/admin/users/${id}/reinstate/`),
	orders: (
		query: { tab?: OrderTab; scope?: OrderScope; q?: string; page?: number; page_size?: number },
		signal?: AbortSignal,
	) => getPage<AdminOrderRow>("/admin/orders/", query, signal) as Promise<OrderList>,
	order: (id: string, signal?: AbortSignal) =>
		get<AdminOrderDetail>(`/admin/orders/${id}/`, undefined, signal),
	cancelOrder: (id: string, reason: string) =>
		post<AdminOrderDetail>(`/admin/orders/${id}/cancel/`, { reason }),
	overview: (signal?: AbortSignal) => get<Overview>("/admin/overview/", undefined, signal),
	notificationDelivery: (days = 7, signal?: AbortSignal) =>
		get<NotificationDelivery>("/admin/notification-delivery/", { days }, signal),
	applications: (signal?: AbortSignal) =>
		get<PendingApplication[]>("/admin/providers/applications/", undefined, signal),
	approveApplication: (id: string) =>
		post<{ provider_id: string }>(`/admin/providers/applications/${id}/approve/`),
	rejectApplication: (id: string, reason: string) =>
		post<{ status: string }>(`/admin/providers/applications/${id}/reject/`, { reason }),
}

// Re-exported so feature modules can share the delete helper without another import.
export { del }
