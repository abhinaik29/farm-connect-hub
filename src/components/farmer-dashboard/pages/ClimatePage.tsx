import type { T, Totals } from "../types";

export function ClimatePage({ t, totals }: { t: T; totals: Totals }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="font-display text-lg">{t.climate}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-primary/10 p-3">
          <p className="text-[11px] text-muted-foreground">{t.methane}</p>
          <p className="mt-0.5 font-display text-xl text-primary">
            {totals.methaneKg} <span className="text-xs">kg CH₄</span>
          </p>
        </div>
        <div className="rounded-xl bg-earth/15 p-3">
          <p className="text-[11px] text-muted-foreground">{t.offset}</p>
          <p className="mt-0.5 font-display text-xl text-earth">
            {totals.tco2e} <span className="text-xs">tCO₂e</span>
          </p>
        </div>
      </div>
    </section>
  );
}
