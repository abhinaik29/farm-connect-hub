import { Sparkline } from "../components/Sparkline";
import { YIELD_30D } from "../data";
import type { T, Totals } from "../types";

export function PerformancePage({ t, totals }: { t: T; totals: Totals }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg">{t.perf}</h2>
        <span className="text-[11px] text-muted-foreground">{t.lastDrop}: 16-Jul, 08:30 AM</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { l: t.yield, v: `${totals.totalYield} L` },
          { l: t.fat, v: `${totals.fat}%` },
          { l: t.snf, v: `${totals.snf}%` },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-muted p-2.5">
            <p className="text-[10px] text-muted-foreground">{s.l}</p>
            <p className="mt-0.5 font-display text-base">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border p-3">
          <p className="text-[11px] text-muted-foreground">{t.pay}</p>
          <p className="mt-0.5 font-display text-lg text-primary">₹ {totals.pay}</p>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="text-[11px] text-muted-foreground">{t.carbon}</p>
          <p className="mt-0.5 font-display text-lg text-accent">₹ {totals.carbon}.00</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{t.yield30}</p>
        <Sparkline data={YIELD_30D} />
      </div>
    </section>
  );
}
