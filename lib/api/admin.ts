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
	applications: (signal?: AbortSignal) =>
		get<PendingApplication[]>("/admin/providers/applications/", undefined, signal),
	approveApplication: (id: string) =>
		post<{ provider_id: string }>(`/admin/providers/applications/${id}/approve/`),
	rejectApplication: (id: string, reason: string) =>
		post<{ status: string }>(`/admin/providers/applications/${id}/reject/`, { reason }),
}

// Re-exported so feature modules can share the delete helper without another import.
export { del }
