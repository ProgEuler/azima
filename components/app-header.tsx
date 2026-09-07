"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/nav-user";
import {
	SquaresFourIcon,
	UsersFourIcon,
	StethoscopeIcon,
	ReceiptIcon,
	BellRingingIcon,
	UserCircleIcon,
	PaperPlaneTiltIcon,
	BellIcon,
} from "@phosphor-icons/react";

export function AppHeader() {
	const pathname = usePathname();

	let activeItem = { title: "Overview", icon: <SquaresFourIcon /> };

	if (pathname.startsWith("/admin/users")) {
		activeItem = { title: "Users", icon: <UsersFourIcon /> };
	} else if (pathname.startsWith("/admin/providers")) {
		activeItem = { title: "Providers", icon: <StethoscopeIcon /> };
	} else if (pathname.startsWith("/admin/orders")) {
		activeItem = { title: "Orders", icon: <ReceiptIcon /> };
	} else if (pathname.startsWith("/admin/notification-delivery")) {
		activeItem = { title: "Notification Delivery", icon: <BellRingingIcon /> };
	} else if (pathname.startsWith("/admin/account")) {
		activeItem = { title: "Account", icon: <UserCircleIcon /> };
	}
	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6"
			)}
		>
			<div className="flex items-center gap-3">
				<CustomSidebarTrigger />
				<Separator
					className="mr-2 h-4 data-[orientation=vertical]:self-center"
					orientation="vertical"
				/>
				<AppBreadcrumbs page={activeItem} />
			</div>
			<div className="flex items-center gap-3">
				<Button size="icon-sm" variant="outline">
					<PaperPlaneTiltIcon
					/>
				</Button>
				<Button aria-label="Notifications" size="icon-sm" variant="outline">
					<BellIcon
					/>
				</Button>
				<Separator
					className="h-4 data-[orientation=vertical]:self-center"
					orientation="vertical"
				/>
				<NavUser />
			</div>
		</header>
	);
}
