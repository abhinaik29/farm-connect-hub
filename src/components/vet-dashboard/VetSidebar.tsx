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
import type { NavItem, PageId } from "./types";

export function VetSidebar({
  nav,
  page,
  setPage,
  pendingCount,
}: {
  nav: NavItem[];
  page: PageId;
  setPage: (p: PageId) => void;
  pendingCount: number;
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
            V
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-display text-sm font-semibold leading-tight">Vet Companion</p>
            <p className="truncate text-[10px] text-muted-foreground">Field visit toolkit</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((n) => (
                <SidebarMenuItem key={n.id}>
                  <SidebarMenuButton isActive={page === n.id} onClick={() => go(n.id)} tooltip={n.label}>
                    <n.icon className="h-4 w-4" />
                    <span>{n.label}</span>
                    {n.id === "queue" && pendingCount > 0 && (
                      <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground group-data-[collapsible=icon]:hidden">
                        {pendingCount}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
