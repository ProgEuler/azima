"use client";

import {
	CalendarBlankIcon,
	ChatCircleDotsIcon,
	CurrencyDollarIcon,
	HouseLineIcon,
	PackageIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import type { SidebarNavGroup } from "@/components/app-shared";

const providerNavGroups: SidebarNavGroup[] = [
	{
		items: [
			{
				title: "Dashboard",
				path: "/provider",
				icon: <HouseLineIcon />,
			},
			{
				title: "Requests",
				path: "/provider/requests",
				icon: <ChatCircleDotsIcon />,
			},
			{
				title: "Calendar",
				path: "/provider/calendar",
				icon: <CalendarBlankIcon />,
			},
			{
				title: "Earnings",
				path: "/provider/earnings",
				icon: <CurrencyDollarIcon />,
			},
			{
				title: "My Services",
				path: "/provider/services",
				icon: <PackageIcon />,
			},
			{
				title: "Account",
				path: "/provider/account",
				icon: <UserCircleIcon />,
			},
		],
	},
];

export default function ProviderLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const navGroups = providerNavGroups.map((group) => ({
		...group,
		items: group.items.map((item) => {
			const isActive =
				item.path === "/provider"
					? pathname === "/provider"
					: !!item.path && pathname.startsWith(item.path);
			return {
				...item,
				isActive,
			};
		}),
	}));

	return (
		<AppShell role="provider" navGroups={navGroups}>
			{children}
		</AppShell>
	);
}
