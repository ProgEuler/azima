import type { ReactNode } from "react";
import { SquaresFourIcon, ListChecksIcon, ChartBarIcon, ChatIcon, UsersIcon, PlugIcon, GearIcon, SignOutIcon } from "@phosphor-icons/react";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
	onClick?: () => void;
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		items: [
			{
				title: "Overview",
				path: "/overview",
				icon: (
					<SquaresFourIcon
					/>
				),
				isActive: true,
			},
		],
	},
	{
		label: "Today",
		items: [
			{
				title: "Queue",
				path: "/queue",
				icon: (
					<ListChecksIcon
					/>
				),
			},
			{
				title: "Team insights",
				path: "#/team-insights",
				icon: (
					<ChartBarIcon
					/>
				),
			},
		],
	},
	{
		label: "Inbox",
		items: [
			{
				title: "Conversations",
				icon: (
					<ChatIcon
					/>
				),
				subItems: [
					{ title: "Unassigned", path: "#/inbox/unassigned" },
					{ title: "Assigned to me", path: "#/inbox/assigned" },
					{ title: "Recently closed", path: "#/inbox/closed" },
				],
			},
			{
				title: "Customers",
				path: "#/customers",
				icon: (
					<UsersIcon
					/>
				),
			},
			{
				title: "Channels",
				path: "#/channels",
				icon: (
					<PlugIcon
					/>
				),
			},
		],
	},
	{
		label: "Organization",
		items: [
			{
				title: "Workspace",
				icon: (
					<GearIcon
					/>
				),
				subItems: [
					{ title: "Branding", path: "#/workspace/branding" },
					{ title: "Team & roles", path: "#/workspace/team" },
					{ title: "API keys", path: "#/workspace/api-keys" },
					{ title: "Webhooks", path: "#/workspace/webhooks" },
					{ title: "Billing", path: "#/workspace/billing" },
				],
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Sign out",
		path: "/signin",
		icon: (
			<SignOutIcon
			/>
		),
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
