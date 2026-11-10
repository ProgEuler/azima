import type { ProviderOrder } from "@/lib/api/provider"
import { ago, dateLabel, inDays, money, timeLabel } from "@/lib/format"

/** "Morning", "Lunch", "Afternoon" or "Evening" for a delivery time. */
export function timeOfDay(time: string | null): string {
	if (!time) return ""
	const hour = Number(time.split(":")[0])
	if (hour < 11) return "Morning"
	if (hour < 15) return "Lunch"
	if (hour < 18) return "Afternoon"
	return "Evening"
}

export function paymentSuffix(order: Pick<ProviderOrder, "payment">): string {
	if (!order.payment) return ""
	return order.payment.method === "online" ? "paid online" : "in cash"
}

/** Everything the request card shows, already formatted. */
export function toRequestView(order: ProviderOrder) {
	const isNew =
		order.status === "pending" &&
		Date.now() - new Date(order.created_at).getTime() < 60 * 60 * 1000
	return {
		id: order.id,
		code: order.order_number,
		title: order.title || "Order",
		askedTime: `asked ${ago(order.created_at)}`,
		dueTime: inDays(order.delivery_date),
		mealTag: (order.meal_type || "event").toUpperCase(),
		isNew,
		dateTime: [dateLabel(order.delivery_date), timeLabel(order.delivery_time)]
			.filter(Boolean)
			.join(" · "),
		timeSubtext: timeOfDay(order.delivery_time),
		guests: `${order.guest_count} to cook for`,
		guestCount: order.guest_count,
		delivery:
			order.fulfillment === "pickup" ? "Host collects" : order.delivery_address || "Venue to be confirmed",
		deliveryType: order.fulfillment === "pickup" ? ("pickup" as const) : ("venue" as const),
		total: `${money(order.total_amount)} ${paymentSuffix(order)}`.trim(),
		hostNote: order.special_instructions || null,
		items: order.items.map((item) => ({
			id: item.id,
			name: item.item_name,
			rate: `${money(item.unit_price)} per guest × ${item.quantity} guests`,
			price: money(item.total_price),
			image: item.image,
		})),
	}
}

export type RequestView = ReturnType<typeof toRequestView>

/** "This week" / "This month" / "Later" grouping for the requests list. */
export function timelineGroup(deliveryDate: string): "This week" | "This month" | "Later" {
	const [y, m, d] = deliveryDate.split("-").map(Number)
	const date = new Date(y, m - 1, d)
	const now = new Date()
	now.setHours(0, 0, 0, 0)
	const days = Math.round((date.getTime() - now.getTime()) / 86_400_000)
	if (days <= 7) return "This week"
	if (days <= 31) return "This month"
	return "Later"
}
