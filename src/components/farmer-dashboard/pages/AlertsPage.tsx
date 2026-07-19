import type { T } from "../types";

export function AlertsPage({ t }: { t: T }) {
  return (
    <section className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">⚠</span>
        <div className="min-w-0">
          <h2 className="font-display text-base"><span className="text-accent">{t.alerts}</span></h2>
          <p className="mt-1 text-sm text-foreground">{t.alertMsg}</p>
        </div>
      </div>
    </section>
  );
}
