import { StatusBadge } from "../components/StatusBadge";
import { HERD } from "../data";
import type { Animal, T } from "../types";

export function HerdPage({ t, onOpen }: { t: T; onOpen: (a: Animal) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-sm active:scale-[0.98]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-lg">📡</span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{t.scan}</span>
            <span className="block text-[11px] text-muted-foreground">EID / RFID</span>
          </span>
        </button>
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-sm active:scale-[0.98]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-lg">🥛</span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{t.logMilk}</span>
            <span className="block text-[11px] text-muted-foreground">Touch to record</span>
          </span>
        </button>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg">{t.herd}</h2>
          <span className="text-xs text-muted-foreground">
            {HERD.length} {t.active}
          </span>
        </div>
        <ul className="mt-3 divide-y divide-border">
          {HERD.map((a) => (
            <li key={a.rfid}>
              <button
                onClick={() => onOpen(a)}
                className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 text-left hover:bg-muted/50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-earth/15 text-xl">🐄</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-semibold">{a.nickname}</span>
                    <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {a.rfid}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {a.breed} · {t.yield} {a.yieldLpd}L/d
                  </span>
                </span>
                <StatusBadge s={a.status} />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
