/** Display helpers shared by the admin and provider screens. */

const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
})

/** "$1,440", "$4.50" — whole amounts drop the decimals. */
export function money(value: string | number | null | undefined): string {
	if (value === null || value === undefined || value === "") return "—"
	const n = typeof value === "number" ? value : Number(value)
	if (Number.isNaN(n)) return "—"
	return Number.isInteger(n)
		? usd.format(n)
		: new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 2,
			}).format(n)
}

function toDate(value: string | Date): Date {
	// Bare dates ("2026-09-08") are local calendar days, not UTC midnight.
	if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const [y, m, d] = value.split("-").map(Number)
		return new Date(y, m - 1, d)
	}
	return new Date(value)
}

/** "8 Sep 2026" */
export function dateLabel(value: string | Date | null | undefined): string {
	if (!value) return "—"
	return toDate(value).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	})
}

/** "8 Sep" */
export function dayMonth(value: string | Date): string {
	return toDate(value).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	})
}

/** "28 Aug 2026 · 10:06 AM" */
export function dateTimeLabel(value: string | Date | null | undefined): string {
	if (!value) return "—"
	const d = new Date(value)
	return `${dateLabel(d)} · ${timeLabel(d)}`
}

/** "6:30 PM" from a Date or an "HH:MM[:SS]" string. */
export function timeLabel(value: string | Date | null | undefined): string {
	if (!value) return ""
	let d: Date
	if (typeof value === "string" && /^\d{2}:\d{2}/.test(value)) {
		const [h, m] = value.split(":").map(Number)
		d = new Date()
		d.setHours(h, m, 0, 0)
	} else {
		d = new Date(value)
	}
	return d.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
	})
}

/** "35m ago", "6h ago", "3d ago" */
export function ago(value: string | Date | null | undefined): string {
	if (!value) return ""
	const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000)
	if (seconds < 60) return "just now"
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	return `${Math.floor(hours / 24)}d ago`
}

/** Whole hours since a timestamp, for "40h in this stage". */
export function hoursSince(value: string | Date): number {
	return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3_600_000))
}

/** "In 3 days", "Today", "Tomorrow", "2 days ago" for a calendar day. */
export function inDays(value: string | Date): string {
	const target = toDate(value)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	target.setHours(0, 0, 0, 0)
	const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000)
	if (diff === 0) return "Today"
	if (diff === 1) return "Tomorrow"
	if (diff === -1) return "Yesterday"
	return diff > 0 ? `In ${diff} days` : `${-diff} days ago`
}

const SERVICE_LABELS: Record<string, string> = {
	catering: "Catering",
	sweets: "Sweets",
	drinks: "Drinks",
}

/** ["catering", "sweets"] -> "Catering · Sweets" */
export function servicesLabel(types: string[] | null | undefined): string {
	if (!types?.length) return "Catering"
	return types.map((t) => SERVICE_LABELS[t] ?? t).join(" · ")
}

export function initials(name: string | null | undefined): string {
	const parts = (name ?? "").trim().split(/\s+/).filter(Boolean)
	if (!parts.length) return "?"
	return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

/** Capacity range, e.g. "10–300 guests". */
export function guestRange(min: number | null, max: number | null): string {
	if (min == null && max == null) return "Any size"
	if (min != null && max != null) return `${min}–${max} guests`
	return min != null ? `From ${min} guests` : `Up to ${max} guests`
}

/** Fallback artwork for occasions by meal type. */
export function occasionImage(mealType: string | null | undefined): string {
	const meal = (mealType ?? "").toLowerCase()
	if (meal.includes("breakfast")) return "/images/overview/corporate-breakfast.jpg"
	if (meal.includes("lunch")) return "/images/overview/team-lunch.jpg"
	return "/images/overview/birthday-dinner.jpg"
}

/** Join defined strings with a separator. */
export function joinParts(parts: Array<string | null | undefined | false>, sep = " · ") {
	return parts.filter(Boolean).join(sep)
}

export function pluralize(n: number, one: string, many = `${one}s`) {
	return `${n} ${n === 1 ? one : many}`
}

export type RequestStatusMeta = {
	label: string
	subtext: string
	color: "green" | "red"
}

/** How a caterer currently takes requests, as shown in admin lists. */
export function requestStatusMeta(
	mode: "review" | "auto" | "not_accepting",
	notice: "instant" | "at_least_48_hours",
): RequestStatusMeta {
	if (mode === "not_accepting") {
		return { label: "Not accepting", subtext: "Hidden from hosts", color: "red" }
	}
	return {
		label: mode === "auto" ? "Auto-accepting" : "Reviews each request",
		subtext: notice === "instant" ? "Books any date" : "Needs 48h notice",
		color: "green",
	}
}

type PaymentLike = {
	method: string
	method_label: string
	status: string
} | null

/** One-line payment description: "Cash on delivery", "Paid online". */
export function paymentMethodLabel(payment: PaymentLike): string {
	if (!payment) return "No payment"
	return payment.method === "online" ? "Paid online" : "Cash on delivery"
}

/** Cash-flow note for an order: whether the money has been collected. */
export function paymentStateLabel(payment: PaymentLike): {
	text: string
	tone: "amber" | "green" | "red" | "neutral"
} {
	if (!payment) return { text: "No payment recorded", tone: "neutral" }
	if (payment.status === "paid") {
		return payment.method === "online"
			? { text: "Paid online", tone: "green" }
			: { text: "Cash collected", tone: "green" }
	}
	if (payment.status === "pending") return { text: "Cash not yet collected", tone: "amber" }
	if (payment.status === "refunded" || payment.status === "partially_refunded") {
		return { text: "Refunded", tone: "neutral" }
	}
	return { text: "No payment taken", tone: "neutral" }
}
