import { SectionCard } from "../components/SectionCard";
import { Sparkline } from "../components/Sparkline";
import { HERD, YIELD_30D } from "../data";
import type { PageId, T, Totals } from "../types";

export function OverviewPage({ t, totals, setPage }: { t: T; totals: Totals; setPage: (p: PageId) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.overview}</p>
      <SectionCard title={t.wallet} desc={t.balance} onClick={() => setPage("wallet")} tone="primary">
        <p className="font-display text-3xl font-semibold">₹ 4,850.00</p>
      </SectionCard>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SectionCard title={t.herd} desc={`${HERD.length} ${t.active}`} onClick={() => setPage("herd")}>
          <div className="flex -space-x-1 text-xl">
            {HERD.map((a) => (
              <span key={a.rfid} className="grid h-8 w-8 place-items-center rounded-full border border-border bg-earth/15">🐄</span>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t.perf} desc={`${t.yield} ${totals.totalYield} L`} onClick={() => setPage("performance")}>
          <Sparkline data={YIELD_30D} />
        </SectionCard>
        <SectionCard title={t.alerts} desc={t.alertMsg} onClick={() => setPage("alerts")} tone="accent" />
        <SectionCard title={t.climate} desc={`${totals.methaneKg} kg CH₄ · ${totals.tco2e} tCO₂e`} onClick={() => setPage("climate")} />
      </div>
    </div>
  );
}
