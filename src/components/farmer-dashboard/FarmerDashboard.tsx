import { useMemo, useState } from "react";
import type { Account } from "@/lib/auth-store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Wallet,
  Beef,
  LineChart,
  BellRing,
  Leaf,
} from "lucide-react";

import { FarmerSidebar } from "./FarmerSidebar";
import { CattleModal } from "./CattleModal";
import { OverviewPage } from "./pages/OverviewPage";
import { WalletPage } from "./pages/WalletPage";
import { HerdPage } from "./pages/HerdPage";
import { PerformancePage } from "./pages/PerformancePage";
import { AlertsPage } from "./pages/AlertsPage";
import { ClimatePage } from "./pages/ClimatePage";
import { HERD, LANGS } from "./data";
import type { Animal, Lang, NavItem, PageId } from "./types";

export function FarmerDashboard({ user, onSignOut }: { user: Account | null; onSignOut: () => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const [page, setPage] = useState<PageId>("overview");
  const [openAnimal, setOpenAnimal] = useState<Animal | null>(null);
  const [vetRequested, setVetRequested] = useState<string | null>(null);
  const t = LANGS[lang];

  const totals = useMemo(() => {
    const totalYield = HERD.reduce((s, a) => s + a.yieldLpd, 0);
    return {
      totalYield: totalYield.toFixed(1),
      fat: 7.8,
      snf: 9.1,
      pay: (totalYield * 45).toFixed(2),
      carbon: 88,
      methaneKg: 42.6,
      tco2e: 1.19,
    };
  }, []);

  const nav: NavItem[] = [
    { id: "overview", label: t.overview, icon: LayoutDashboard },
    { id: "wallet", label: t.wallet, icon: Wallet },
    { id: "herd", label: t.herd, icon: Beef },
    { id: "performance", label: t.perf, icon: LineChart },
    { id: "alerts", label: t.alerts, icon: BellRing },
    { id: "climate", label: t.climate, icon: Leaf },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <FarmerSidebar nav={nav} page={page} setPage={setPage} onSignOut={onSignOut} signOutLabel={t.signOut} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card/95 px-3 py-3 backdrop-blur">
            <SidebarTrigger />
            <h1 className="min-w-0 flex-1 truncate font-display text-sm font-semibold tracking-wide sm:text-base">
              {t.header}
            </h1>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
              aria-label="language"
            >
              <option value="en">EN</option>
              <option value="hi">हिं</option>
              <option value="kn">ಕನ್ನ</option>
              <option value="kok">कोंक</option>
            </select>
            <button
              onClick={onSignOut}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border"
              aria-label="profile"
              title={user?.name || user?.phone || "profile"}
            >
              👤
            </button>
          </header>

          <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-4 pb-16">
            {page === "overview" && <OverviewPage t={t} totals={totals} setPage={setPage} />}
            {page === "wallet" && <WalletPage t={t} />}
            {page === "herd" && <HerdPage t={t} onOpen={setOpenAnimal} />}
            {page === "performance" && <PerformancePage t={t} totals={totals} />}
            {page === "alerts" && <AlertsPage t={t} />}
            {page === "climate" && <ClimatePage t={t} totals={totals} />}
          </main>
        </div>

        {openAnimal && (
          <CattleModal
            animal={openAnimal}
            t={t}
            vetRequested={vetRequested}
            onRequestVet={() => setVetRequested(openAnimal.rfid)}
            onClose={() => setOpenAnimal(null)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
