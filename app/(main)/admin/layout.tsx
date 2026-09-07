"use client";

import {
	BellRingingIcon,
	LifebuoyIcon,
	PulseIcon,
	ReceiptIcon,
	SquaresFourIcon,
	StethoscopeIcon,
	UserCircleIcon,
	UsersFourIcon,
} from "@phosphor-icons/react";
import { AppShell } from "@/components/app-shell";
import type { SidebarNavGroup, SidebarNavItem } from "@/components/app-shared";

const adminNavGroups: SidebarNavGroup[] = [
	{
		items: [
			{
				title: "Overview",
				path: "/admin",
				icon: <SquaresFourIcon />,
				isActive: true,
			},
			{
				title: "Users",
				path: "/admin/users",
				icon: <UsersFourIcon />,
			},
			{
				title: "Providers",
				path: "/admin/providers",
				icon: <StethoscopeIcon />,
			},
			{
				title: "Orders",
				path: "/admin/orders",
				icon: <ReceiptIcon />,
			},
			{
				title: "Notification Delivery",
				path: "/admin/notification-delivery",
				icon: <BellRingingIcon />,
			},
			{
				title: "Account",
				path: "/admin/account",
				icon: <UserCircleIcon />,
			},
		],
	},
];

const adminFooterNavLinks: SidebarNavItem[] = [
	{
		title: "Help Center",
		path: "/admin/help",
		icon: <LifebuoyIcon />,
	},
	{
		title: "System status",
		path: "/admin/status",
		icon: <PulseIcon />,
	},
];

import { usePathname } from "next/navigation";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const navGroups = adminNavGroups.map((group) => ({
		...group,
		items: group.items.map((item) => {
			const isActive =
				item.path === "/admin"
					? pathname === "/admin"
					: !!item.path && pathname.startsWith(item.path);
			return {
				...item,
				isActive,
			};
		}),
	}));

	return (
		<AppShell navGroups={navGroups} footerNavLinks={adminFooterNavLinks}>
			{children}
		</AppShell>
	);
}
