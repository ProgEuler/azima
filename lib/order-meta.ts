/** Order lifecycle labels shared by the admin and provider screens. */

export type OrderStatus =
	| "pending"
	| "reconfirming"
	| "accepted"
	| "confirmed"
	| "preparing"
	| "on_the_way"
	| "delivered"
	| "cancelled"
	| "rejected"

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
	pending: "Awaiting reply",
	reconfirming: "Re-confirming",
	accepted: "Awaiting call",
	confirmed: "Contact confirmed",
	preparing: "Preparing",
	on_the_way: "On the way",
	delivered: "Delivered",
	cancelled: "Cancelled",
	rejected: "Declined",
}

export type StatusTone = "amber" | "green" | "neutral" | "red"

export const ORDER_STATUS_TONE: Record<OrderStatus, StatusTone> = {
	pending: "amber",
	reconfirming: "neutral",
	accepted: "neutral",
	confirmed: "neutral",
	preparing: "neutral",
	on_the_way: "green",
	delivered: "green",
	cancelled: "red",
	rejected: "red",
}

/** Who the order is currently waiting on (admin list column). */
export const ORDER_WAITING_ON: Record<OrderStatus, string> = {
	pending: "Waiting on caterer",
	reconfirming: "Waiting on caterer",
	accepted: "Caterer to call the host",
	confirmed: "Host contacted",
	preparing: "In the kitchen",
	on_the_way: "On the way",
	delivered: "—",
	cancelled: "—",
	rejected: "—",
}

export const TONE_CLASSES: Record<StatusTone, string> = {
	amber: "bg-[#FCF4E7] dark:bg-amber-950/50 text-[#915B1E] dark:text-amber-300",
	green: "bg-[#EAF5EC] dark:bg-emerald-950/50 text-[#2D6A42] dark:text-emerald-300",
	neutral: "bg-[#F3F0EC] dark:bg-stone-800 text-[#666059] dark:text-stone-300",
	red: "bg-[#FDF2F0] dark:bg-rose-950/50 text-[#B83E28] dark:text-rose-300",
}

export function orderStatusLabel(status: string): string {
	return ORDER_STATUS_LABEL[status as OrderStatus] ?? status
}

export function orderStatusTone(status: string): StatusTone {
	return ORDER_STATUS_TONE[status as OrderStatus] ?? "neutral"
}

/** Statuses where the caterer has accepted and the order is not yet delivered. */
export const LIVE_STATUSES: OrderStatus[] = [
	"reconfirming",
	"accepted",
	"confirmed",
	"preparing",
	"on_the_way",
]
