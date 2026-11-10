import type { Event } from "@/components/event-manager"
import type { CloseDate, ProviderOrder } from "@/lib/api/provider"

const STATUS_COLOR: Record<string, string> = {
	pending: "orange",
	reconfirming: "orange",
	accepted: "blue",
	confirmed: "blue",
	preparing: "purple",
	on_the_way: "pink",
	delivered: "green",
}

function startOf(order: ProviderOrder): Date {
	const [y, m, d] = order.delivery_date.split("-").map(Number)
	const [h, min] = (order.delivery_time ?? "12:00:00").split(":").map(Number)
	return new Date(y, m - 1, d, h, min, 0, 0)
}

/** A booking or request as a calendar entry (two hours long by default). */
export function orderToEvent(order: ProviderOrder): Event {
	const start = startOf(order)
	const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
	const cashPending =
		order.payment?.method === "cash_on_delivery" && order.payment.status === "pending"
	return {
		id: order.id,
		title: order.title || order.order_number,
		description: `${order.host.name} · ${order.fulfillment === "pickup" ? "Host collects" : order.delivery_address}`,
		startTime: start,
		endTime: end,
		color: STATUS_COLOR[order.status] ?? "blue",
		category: order.status === "pending" ? "Request" : "Booking",
		tags: [order.meal_type, order.status_label].filter(Boolean),
		guestCount: order.guest_count,
		cashAmount: cashPending ? Number(order.total_amount) : 0,
		data: order,
	}
}

/** A closed date as an all-day entry. */
export function closeDateToEvent(closed: CloseDate): Event {
	const [y, m, d] = closed.date.split("-").map(Number)
	return {
		id: `closed-${closed.id}`,
		title: closed.reason ? `Closed · ${closed.reason}` : "Closed to new requests",
		startTime: new Date(y, m - 1, d, 0, 0, 0),
		endTime: new Date(y, m - 1, d, 23, 59, 0),
		color: "red",
		category: "Closed",
		data: closed,
	}
}

export function isoDate(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}
