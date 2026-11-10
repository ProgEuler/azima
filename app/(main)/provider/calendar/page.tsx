"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { EventManager, type Event } from "@/components/event-manager"
import { TodayCard } from "@/components/provider/today-card"
import { OrderStatusPill } from "@/components/order-status-pill"
import { Button } from "@/components/event-manager/ui/button"
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/event-manager/ui/dialog"
import { QueryState } from "@/components/form-error"
import { useApi } from "@/hooks/use-api"
import { providerApi, type CloseDate, type ProviderOrder } from "@/lib/api/provider"
import { closeDateToEvent, isoDate, orderToEvent } from "@/lib/calendar"
import { dateLabel, money, timeLabel } from "@/lib/format"

function monthRange(d = new Date()) {
	const start = new Date(d.getFullYear(), d.getMonth(), 1)
	start.setDate(start.getDate() - 7)
	const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
	end.setDate(end.getDate() + 7)
	return { start: isoDate(start), end: isoDate(end) }
}

export default function ProviderCalendarPage() {
	const [range, setRange] = useState(() => monthRange())
	const today = isoDate(new Date())

	const calendar = useApi(
		(signal) => providerApi.calendar(range.start, range.end, signal),
		[range.start, range.end],
	)
	const todayData = useApi((signal) => providerApi.calendar(today, today, signal), [today])

	const events: Event[] = useMemo(
		() => [
			...(calendar.data?.events ?? []).map(orderToEvent),
			...(calendar.data?.closed_dates ?? []).map(closeDateToEvent),
		],
		[calendar.data],
	)
	const todayEvents: Event[] = useMemo(
		() => (todayData.data?.events ?? []).map(orderToEvent),
		[todayData.data],
	)
	const closedToday: CloseDate | null =
		todayData.data?.closed_dates.find((d) => d.date === today) ?? null

	const onRange = useCallback((start: Date, end: Date) => {
		const next = { start: isoDate(start), end: isoDate(end) }
		setRange((prev) => (prev.start === next.start && prev.end === next.end ? prev : next))
	}, [])

	const refresh = () => {
		calendar.reload()
		todayData.reload()
	}

	async function toggleToday() {
		if (closedToday) await providerApi.reopenDate(closedToday.id)
		else await providerApi.closeDate({ date_from: today })
		refresh()
	}

	return (
		<div className="container mx-auto grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_340px]">
			<div className="space-y-3">
				{calendar.error ? (
					<QueryState loading={false} error={calendar.error} onRetry={calendar.reload} />
				) : null}
				<EventManager
					events={events}
					readOnly
					onVisibleRangeChange={onRange}
					categories={["Booking", "Request", "Closed"]}
					availableTags={[]}
					defaultView="month"
					renderEventDetails={(event, close) => (
						<EventDetails event={event} close={close} onChanged={refresh} />
					)}
				/>
			</div>
			<div className="lg:sticky lg:top-4 lg:self-start">
				<TodayCard
					events={todayEvents}
					closed={Boolean(closedToday)}
					onToggleClosed={toggleToday}
				/>
			</div>
		</div>
	)
}

function EventDetails({
	event,
	close,
	onChanged,
}: {
	event: Event
	close: () => void
	onChanged: () => void
}) {
	if (event.category === "Closed") {
		const closed = event.data as CloseDate
		return (
			<>
				<DialogHeader>
					<DialogTitle>Closed to new requests</DialogTitle>
					<DialogDescription>{dateLabel(closed.date)}</DialogDescription>
				</DialogHeader>
				{closed.reason ? <p className="text-sm">{closed.reason}</p> : null}
				<p className="text-xs text-muted-foreground">
					Hosts cannot request you for this date. Orders you already accepted are not affected.
				</p>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={close}>
						Close
					</Button>
					<Button
						onClick={async () => {
							await providerApi.reopenDate(closed.id)
							close()
							onChanged()
						}}
					>
						Re-open this date
					</Button>
				</div>
			</>
		)
	}

	const order = event.data as ProviderOrder
	return (
		<>
			<DialogHeader>
				<DialogTitle>{order.title || order.order_number}</DialogTitle>
				<DialogDescription>
					{order.order_number} · {dateLabel(order.delivery_date)} {timeLabel(order.delivery_time)}
				</DialogDescription>
			</DialogHeader>
			<div className="space-y-3 text-sm">
				<OrderStatusPill status={order.status} />
				<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
					<dt className="text-muted-foreground">Host</dt>
					<dd className="font-medium">{order.host.name}</dd>
					{order.host.phone ? (
						<>
							<dt className="text-muted-foreground">Phone</dt>
							<dd className="font-medium">{order.host.phone}</dd>
						</>
					) : null}
					<dt className="text-muted-foreground">Guests</dt>
					<dd className="font-medium">{order.guest_count}</dd>
					<dt className="text-muted-foreground">Where</dt>
					<dd className="font-medium">
						{order.fulfillment === "pickup" ? "Host collects" : order.delivery_address}
					</dd>
					<dt className="text-muted-foreground">Total</dt>
					<dd className="font-medium">
						{money(order.total_amount)}{" "}
						{order.payment?.method === "online" ? "paid online" : "in cash"}
					</dd>
				</dl>
			</div>
			<div className="flex justify-end gap-2">
				<Button variant="outline" onClick={close}>
					Close
				</Button>
				<Link
					href={`/provider/requests/${order.id}`}
					className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				>
					Open order
				</Link>
			</div>
		</>
	)
}
