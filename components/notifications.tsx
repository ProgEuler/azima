"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	BellIcon,
	ClockIcon,
	CreditCardIcon,
	CalendarBlankIcon,
	ReceiptIcon,
	MegaphoneIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/components/auth-provider";
import {
	notificationsApi,
	type AppNotification,
	type NotificationPage,
} from "@/lib/api/notifications";
import { ago } from "@/lib/format";

const POLL_MS = 60_000;

const TYPE_ICON: Record<AppNotification["type"], React.ReactNode> = {
	order: <ReceiptIcon />,
	payment: <CreditCardIcon />,
	event: <CalendarBlankIcon />,
	system: <BellIcon />,
	promotion: <MegaphoneIcon />,
};

export function Notifications() {
	const router = useRouter();
	const { user } = useAuth();
	const [page, setPage] = useState<NotificationPage | null>(null);

	const load = useCallback(async () => {
		try {
			setPage(await notificationsApi.list());
		} catch {
			// The bell is best-effort; a failed poll keeps the last known state.
		}
	}, []);

	useEffect(() => {
		void Promise.resolve().then(load);
		const timer = setInterval(() => void load(), POLL_MS);
		return () => clearInterval(timer);
	}, [load]);

	const unread = page?.unread_count ?? 0;
	const items = page?.results ?? [];

	async function open(notification: AppNotification) {
		if (!notification.is_read) {
			try {
				await notificationsApi.markRead(notification.id);
			} catch {
				// Navigating still works if marking read fails.
			}
			void load();
		}
		const orderId = notification.data?.order_id;
		if (orderId && user) {
			router.push(user.role === "admin" ? `/admin/orders/${orderId}` : `/provider/requests/${orderId}`);
		}
	}

	async function markAll() {
		try {
			await notificationsApi.markAllRead();
		} finally {
			void load();
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} size="icon-sm" variant="outline" className="relative">
						<BellIcon />
						{unread > 0 ? (
							<span className="absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white">
								{unread > 9 ? "9+" : unread}
							</span>
						) : null}
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-80 p-0">
				<div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
					<span className="text-sm font-medium text-muted-foreground">
						Notifications
					</span>
					<button
						type="button"
						onClick={() => void markAll()}
						disabled={unread === 0}
						className="text-sm font-medium text-foreground hover:underline disabled:opacity-40 disabled:no-underline"
					>
						Mark all read
					</button>
				</div>
				<div className="max-h-[480px] overflow-y-auto">
					{page && items.length === 0 ? (
						<p className="px-4 py-8 text-center text-sm text-muted-foreground">
							You&apos;re all caught up.
						</p>
					) : null}
					{items.map((notification) => (
						<button
							type="button"
							key={notification.id}
							onClick={() => void open(notification)}
							className="relative flex w-full gap-3 px-4 py-3 text-left border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors"
						>
							<Avatar className="size-10 shrink-0">
								<AvatarFallback className="[&_svg]:size-5">{TYPE_ICON[notification.type]}</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2">
									<p className="text-sm font-semibold text-foreground truncate">
										{notification.title}
									</p>
									{!notification.is_read && (
										<span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-500" />
									)}
								</div>
								{notification.body ? (
									<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
										{notification.body}
									</p>
								) : null}
								<div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
									<ClockIcon className="size-3" />
									<span>{ago(notification.created_at)}</span>
								</div>
							</div>
						</button>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
