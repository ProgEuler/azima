import { getPage, post, type Paginated } from "@/lib/api/client"

export type AppNotification = {
	id: string
	type: "order" | "payment" | "event" | "system" | "promotion"
	title: string
	body: string
	data: { order_id?: string; order_number?: string } | null
	is_read: boolean
	read_at: string | null
	created_at: string
}

export type NotificationPage = Paginated<AppNotification> & { unread_count: number }

export const notificationsApi = {
	list: (query: { unread?: boolean; page_size?: number } = {}, signal?: AbortSignal) =>
		getPage<AppNotification>("/notifications/", { page_size: 10, ...query }, signal) as Promise<NotificationPage>,
	markRead: (id: string) => post<AppNotification>(`/notifications/${id}/read/`),
	markAllRead: () => post<{ updated: number }>("/notifications/read-all/"),
}
