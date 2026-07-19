import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Account } from "@/lib/auth-store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ShieldCheck, AlertTriangle, Leaf, Database } from "lucide-react";

import { AdminSidebar } from "./AdminSidebar";
import { LedgerPage } from "./pages/LedgerPage";
import { SecurityPage } from "./pages/SecurityPage";
import { RegenPage } from "./pages/RegenPage";
import { VerificationPage } from "./pages/VerificationPage";
import type { NavItem, PageId } from "./types";

const NAV: NavItem[] = [
  { id: "ledger", label: "Ledger Audit Logs", icon: ShieldCheck },
  { id: "security", label: "Security Warnings", icon: AlertTriangle },
  { id: "regen", label: "Regen Network", icon: Leaf },
  { id: "verification", label: "Verification Stream", icon: Database },
];

const PAGE_TITLES: Record<PageId, string> = {
  ledger: "Crypto Ledger Tamper Audit Logs",
  security: "Flagged Security Warnings",
  regen: "Regen Network Protocol Hook",
  verification: "Verification Stream API Endpoint",
};

export function AdminDashboard({
  user,
  onSignOut,
}: {
  user: Account | null;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageId>("ledger");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar nav={NAV} page={page} setPage={setPage} onSignOut={onSignOut} />

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
                Signed in as {user?.name || user?.email || user?.phone || "…"}
              </p>
            </div>
            <button
              onClick={onSignOut}
              className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
            >
              Sign out
            </button>
          </header>

          <main className="mx-auto w-full max-w-4xl flex-1 space-y-5 px-4 py-6 pb-16 sm:px-6">
            {page === "ledger" && <LedgerPage />}
            {page === "security" && <SecurityPage />}
            {page === "regen" && <RegenPage />}
            {page === "verification" && <VerificationPage />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
