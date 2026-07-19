import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import type { NavItem, PageId } from "./types";

export function FarmerSidebar({
  nav,
  page,
  setPage,
  onSignOut,
  signOutLabel,
}: {
  nav: NavItem[];
  page: PageId;
  setPage: (p: PageId) => void;
  onSignOut: () => void;
  signOutLabel: string;
}) {
  const { setOpenMobile, isMobile } = useSidebar();
  const go = (id: PageId) => {
    setPage(id);
    if (isMobile) setOpenMobile(false);
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg">
            B
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-display text-sm font-semibold leading-tight">One Buffalo</p>
            <p className="truncate text-[10px] text-muted-foreground">Karwar co-op</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Farm</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((n) => (
                <SidebarMenuItem key={n.id}>
                  <SidebarMenuButton isActive={page === n.id} onClick={() => go(n.id)} tooltip={n.label}>
                    <n.icon className="h-4 w-4" />
                    <span>{n.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSignOut} tooltip={signOutLabel}>
                  <LogOut className="h-4 w-4" />
                  <span>{signOutLabel}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
