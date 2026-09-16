import { LogoIcon } from "@/components/logo"
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavGroup } from "@/components/nav-group"
import {
   footerNavLinks as defaultFooterNavLinks,
   navGroups as defaultNavGroups,
   type SidebarNavGroup,
   type SidebarNavItem,
} from "@/components/app-shared"
import { ShieldCheckIcon, CookingPotIcon } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type SidebarRole = "admin" | "provider"

const ROLE_META: Record<
   SidebarRole,
   { label: string; icon: React.ReactNode; }
> = {
   admin: {
      label: "Admin",
      icon: <ShieldCheckIcon weight="fill" />,
   },
   provider: {
      label: "Provider",
      icon: <CookingPotIcon weight="fill" />,
   },
}

export function AppSidebar({
   navGroups = defaultNavGroups,
   footerNavLinks = defaultFooterNavLinks,
   role,
}: {
   navGroups?: SidebarNavGroup[]
   footerNavLinks?: SidebarNavItem[]
   role?: SidebarRole
} = {}) {
   const roleMeta = role ? ROLE_META[role] : null

   return (
      <Sidebar collapsible="icon" variant="inset">
         <SidebarHeader className="h-24 justify-center">
            {/* <SidebarMenuButton render={<a href="#link" />}> */}
            <div className="flex items-center justify-center gap-2">
               <Image src="/logo.png" alt="Logo" width={90} height={90} />
               {/* <span className="font-medium">azim</span> */}
            </div>
            {/* </SidebarMenuButton> */}
         </SidebarHeader>
         <SidebarContent>
            {roleMeta && (
               <div
                  className={cn(
                     "flex justify-center items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium"
                  )}
               >
                  <span className="flex h-4 w-4 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                     {roleMeta.icon}
                  </span>
                  <span>{roleMeta.label}</span>
               </div>
            )}
            {navGroups.map((group, index) => (
               <NavGroup key={`sidebar-group-${index}`} {...group} />
            ))}
         </SidebarContent>
         <SidebarFooter>
            <SidebarMenu className="mt-2">
               {footerNavLinks.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton
                        className="text-red-800"
                        isActive={item.isActive}
                        size="sm"
                        tooltip={item.title}
                        onClick={item.onClick}
                        render={
                           item.path ? <Link href={item.path} /> : undefined
                        }
                     >
                        {item.icon}
                        <span>{item.title}</span>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   )
}
