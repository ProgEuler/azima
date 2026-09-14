"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BellIcon, ClockIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Notification = {
	id: string;
	title: string;
	description: string;
	time: string;
	avatar: string;
	unread?: boolean;
	permission?: {
		accept?: string;
		decline?: string;
	};
};

const notifications: Notification[] = [
	{
		id: "1",
		title: "Your order is placed",
		description: "Amet minim mollit non deser unt ullamco...",
		time: "2 days ago",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
		unread: false,
	},
	{
		id: "2",
		title: "Congratulations Darlene 🎉",
		description: "Won the monthly best seller badge",
		time: "11 am",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face",
		unread: true,
	},
	{
		id: "3",
		title: "Joaquina Weisenborn",
		description: "Requesting access permission",
		time: "12 pm",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
		unread: true,
		permission: {
			accept: "Accept",
			decline: "Decline",
		},
	},
	{
		id: "4",
		title: "Brooklyn Simmons",
		description: "Added you to Top Secret Project...",
		time: "1 pm",
		avatar:
			"https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face",
		unread: true,
	},
];

const UNREAD_COUNT = notifications.filter((n) => n.unread).length;

export function Notifications() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button aria-label="Notifications" size="icon-sm" variant="outline">
						<BellIcon />
						{UNREAD_COUNT > 0 && (
							<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
						)}
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
						className="text-sm font-medium text-foreground hover:underline"
					>
						View all
					</button>
				</div>
				<div className="max-h-[480px] overflow-y-auto">
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className={cn(
								"relative flex gap-3 px-4 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors",
								notification.permission && "bg-muted/20"
							)}
						>
							<Avatar className="size-10 shrink-0">
								<AvatarImage src={notification.avatar} alt={notification.title} />
								<AvatarFallback>{notification.title.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2">
									<p className="text-sm font-semibold text-foreground truncate">
										{notification.title}
									</p>
									{notification.unread && (
										<span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-500" />
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
									{notification.description}
								</p>
								{notification.permission ? (
									<div className="flex items-center gap-2 mt-2">
										<Button size="sm" variant="outline" className="h-7 px-3 text-xs">
											{notification.permission.accept}
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="h-7 px-3 text-xs text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
										>
											{notification.permission.decline}
										</Button>
									</div>
								) : null}
								<div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
									<ClockIcon className="size-3" />
									<span>{notification.time}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
