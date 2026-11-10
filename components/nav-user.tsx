"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SignOutIcon,
	StorefrontIcon,
	UserIcon,
} from "@phosphor-icons/react";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { mediaUrl } from "@/lib/api/client";

export function NavUser() {
	const { user: account, signOut } = useAuth();
	const isProvider = account?.role === "provider";
	const user = {
		name: account?.business_name || account?.full_name || account?.email || "Account",
		email: account?.email ?? "",
		avatar: mediaUrl(account?.logo) ?? undefined,
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<Avatar className="size-8">
							<AvatarImage src={user.avatar} />
							<AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
					</button>
				}
			/>
			<DropdownMenuContent align="end" className="w-60">
				<div className="flex items-center gap-3 px-3 py-2.5">
					<Avatar className="size-10">
						<AvatarImage src={user.avatar} />
						<AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<div className="font-medium text-foreground truncate">{user.name}</div>
						<div className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-muted-foreground text-xs">
							{user.email}
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{isProvider ? (
						<>
							<DropdownMenuItem render={<Link href="/provider/account" />}>
								<UserIcon />
								My profile
							</DropdownMenuItem>
							<DropdownMenuItem render={<Link href="/provider/services" />}>
								<StorefrontIcon />
								Business page & menu
							</DropdownMenuItem>
						</>
					) : null}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="w-full cursor-pointer"
						variant="destructive"
						onClick={() => void signOut()}
					>
						<SignOutIcon />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
