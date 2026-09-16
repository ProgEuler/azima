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

const user = {
	name: "Saruf Khan",
	email: "saruf700@gmail.com",
	avatar: "https://res.cloudinary.com/dicqtpu0g/image/upload/v1772311122/image-removebg-preview_2_ej36dj.png",
};

export function NavUser() {
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
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
						</Avatar>
					</button>
				}
			/>
			<DropdownMenuContent align="end" className="w-60">
				<div className="flex items-center gap-3 px-3 py-2.5">
					<Avatar className="size-10">
						<AvatarImage src={user.avatar} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
					<DropdownMenuItem>
						<UserIcon />
						My profile
					</DropdownMenuItem>
					<DropdownMenuItem>
						<StorefrontIcon />
						Business page & menu
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="w-full cursor-pointer"
						variant="destructive"
					>
						<SignOutIcon />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
