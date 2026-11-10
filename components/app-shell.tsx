"use client";

import { SignOutIcon } from "@phosphor-icons/react";
import { useAuth } from "@/components/auth-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar, type SidebarRole } from "@/components/app-sidebar";
import type { SidebarNavGroup, SidebarNavItem } from "@/components/app-shared";

export function AppShell({
	children,
	navGroups,
	footerNavLinks,
	role,
}: {
	children: React.ReactNode;
	navGroups: SidebarNavGroup[];
	footerNavLinks?: SidebarNavItem[];
	role?: SidebarRole;
}) {
	const { signOut } = useAuth();
	const links =
		footerNavLinks ?? [
			{ title: "Sign out", icon: <SignOutIcon />, onClick: () => void signOut() },
		];

	return (
		<div className="overflow-hidden">
			<SidebarProvider className="relative h-svh">
				<AppSidebar role={role} navGroups={navGroups} footerNavLinks={links} />
				<SidebarInset className="md:peer-data-[variant=inset]:ml-0">
					<AppHeader />
					<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
