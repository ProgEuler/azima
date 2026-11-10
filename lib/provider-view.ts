import type { AdminProviderDetail } from "@/lib/api/admin"
import {
	dateLabel,
	guestRange,
	money,
	occasionImage,
	requestStatusMeta,
	servicesLabel,
} from "@/lib/format"

/** Collapse sorted ISO dates into "5 Sep 2026 - 12 Sep 2026" style ranges. */
export function formatDateRanges(dates: string[]): string {
	if (!dates.length) return "None"
	const sorted = [...dates].sort()
	const ranges: Array<[string, string]> = []
	for (const date of sorted) {
		const last = ranges[ranges.length - 1]
		if (last) {
			const prev = new Date(`${last[1]}T00:00:00`)
			prev.setDate(prev.getDate() + 1)
			const next = new Date(`${date}T00:00:00`)
			if (prev.getTime() === next.getTime()) {
				last[1] = date
				continue
			}
		}
		ranges.push([date, date])
	}
	return ranges
		.map(([from, to]) =>
			from === to ? dateLabel(from) : `${dateLabel(from)} - ${dateLabel(to)}`,
		)
		.join(", ")
}

const AVAILABILITY_NOTE = {
	review: "They reply to each request themselves.",
	auto: "Requests are accepted the moment they arrive.",
	not_accepting: "They are hidden from hosts for now.",
} as const

/** Reshape the admin provider payload into display strings for the detail page. */
export function toProviderView(d: AdminProviderDetail) {
	const status = requestStatusMeta(d.request_mode, d.order_notice_period)
	const terms = d.trading_terms
	const byCategory = new Map<string, AdminProviderDetail["menu"]>()
	for (const item of d.menu) {
		const key = item.category || "Menu"
		byCategory.set(key, [...(byCategory.get(key) ?? []), item])
	}
	const instant = terms.order_notice_period === "instant"
	const rate = d.stats.acceptance_rate

	return {
		id: d.id,
		name: d.business_name,
		rating: Number(d.rating_avg).toFixed(1),
		reviewsCount: d.reviews_count,
		category: servicesLabel(d.service_types),
		isSuspended: d.is_suspended,
		ownerName: d.owner_name,
		description: d.description,
		phone: d.phone,
		email: d.email ?? "",
		city: d.city,
		imageSrc: d.cover_image ?? d.logo,
		liveOrders: d.live_orders,
		deliveredOrders: d.delivered_orders,
		acceptanceRate: rate == null ? "—" : `${rate}%`,
		acceptanceDecisions: d.stats.acceptance_decisions,
		menuItemsCount: d.stats.menu_items_count,
		priceRange:
			d.stats.price_min && d.stats.price_max
				? d.stats.price_min === d.stats.price_max
					? `${money(d.stats.price_min)} per guest`
					: `${money(d.stats.price_min)}–${money(d.stats.price_max)} per guest`
				: "",
		tradingTerms: {
			availabilityMode: status.label,
			availabilityNote: AVAILABILITY_NOTE[terms.request_mode],
			bookingLeadTime: status.subtext,
			bookingLeadNote: instant
				? "Hosts can book them for any date, including tomorrow."
				: "Hosts must book at least 48 hours ahead.",
			bookingsAccepted: guestRange(terms.smallest_order, terms.largest_order),
			bookingsNote: "Hosts outside this range cannot select them.",
			deliversTo: terms.delivery_areas.length ? terms.delivery_areas.join(" · ") : "—",
			deliveryFee: money(terms.delivery_fee),
			hostCollection: terms.allows_collection
				? terms.collection_address || "Hosts can collect"
				: "Delivery only",
			blackoutDates: formatDateRanges(terms.close_dates),
		},
		menuCategories: [...byCategory.entries()].map(([title, items]) => ({
			title,
			items: items.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: money(item.price),
				imageSrc: item.image,
				available: item.is_available,
			})),
		})),
		ordersList: d.orders.map((o) => ({
			id: o.id,
			code: o.order_number,
			eventName: o.title || "Order",
			date: dateLabel(o.delivery_date),
			guests: o.guest_count,
			amount: money(o.total_amount),
			status: o.status,
			imageSrc: occasionImage(null),
		})),
	}
}
