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
import Image from "next/image"

export function AppSidebar({
   navGroups = defaultNavGroups,
   footerNavLinks = defaultFooterNavLinks,
}: {
   navGroups?: SidebarNavGroup[]
   footerNavLinks?: SidebarNavItem[]
} = {}) {
   return (
      <Sidebar collapsible="icon" variant="inset">
         <SidebarHeader className="h-24 justify-center">
            {/* <SidebarMenuButton render={<a href="#link" />}> */}
            <div className="flex items-center gap-2">
               <Image src="/logo.png" alt="Logo" width={62} height={62} />
               <span className="font-medium">azim</span>
            </div>
            {/* </SidebarMenuButton> */}
         </SidebarHeader>
         <SidebarContent>
            {navGroups.map((group, index) => (
               <NavGroup key={`sidebar-group-${index}`} {...group} />
            ))}
         </SidebarContent>
         <SidebarFooter>
            <SidebarMenu className="mt-2">
               {footerNavLinks.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton
                        className="text-muted-foreground"
                        isActive={item.isActive}
                        size="sm"
                        render={<a href={item.path} />}
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
