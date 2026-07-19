import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Account } from "@/lib/auth-store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Map, Scale, Table2, FileDown } from "lucide-react";

import { CoopSidebar } from "./CoopSidebar";
import { OverviewPage } from "./pages/OverviewPage";
import { MapPage } from "./pages/MapPage";
import { ReconciliationPage } from "./pages/ReconciliationPage";
import { LedgerPage } from "./pages/LedgerPage";
import { ExportPage } from "./pages/ExportPage";
import type { NavItem, PageId } from "./types";

const NAV: NavItem[] = [
  { id: "overview", label: "Union Statistics", icon: LayoutDashboard },
  { id: "map", label: "PostGIS Heatmap", icon: Map },
  { id: "reconciliation", label: "Mass-Balance Sheet", icon: Scale },
  { id: "ledger", label: "Village Node Ledger", icon: Table2 },
  { id: "export", label: "Scope 3 Export", icon: FileDown },
];

const PAGE_TITLES: Record<PageId, string> = {
  overview: "Union Scope 3 Statistics",
  map: "Geographical PostGIS Heatmap",
  reconciliation: "Mass-Balance Comparative Reconciliation Sheet",
  ledger: "Village AMCU Node Ledger",
  export: "Scope 3 Export Panel",
};

export function CoopDashboard({
  user,
  onSignOut,
}: {
  user: Account | null;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageId>("overview");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CoopSidebar nav={NAV} page={page} setPage={setPage} onSignOut={onSignOut} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card/95 px-3 py-3 backdrop-blur">
            <SidebarTrigger />
            <button
              aria-label="back"
              onClick={() => navigate({ to: "/" })}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border text-lg"
            >
              ‹
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-sm font-semibold tracking-wide sm:text-base">
                {PAGE_TITLES[page]}
              </h1>
              <p className="truncate text-[11px] text-muted-foreground">
                Signed in as {user?.name || user?.phone || "…"}
              </p>
            </div>
            <button
              onClick={onSignOut}
              className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
            >
              Sign out
            </button>
          </header>

          <main className="mx-auto w-full max-w-5xl flex-1 space-y-5 px-4 py-6 pb-16 sm:px-6">
            {page === "overview" && <OverviewPage />}
            {page === "map" && <MapPage />}
            {page === "reconciliation" && <ReconciliationPage />}
            {page === "ledger" && <LedgerPage />}
            {page === "export" && <ExportPage />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
