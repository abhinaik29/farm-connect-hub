import { SectionCard } from "../components/SectionCard";
import { LEDGER_BLOCKS } from "../data";

export function LedgerPage() {
  return (
    <SectionCard title="Crypto Ledger Tamper Audit Logs" sub={`${LEDGER_BLOCKS.length} most recent blocks`}>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {LEDGER_BLOCKS.map((b) => (
          <li key={b.id} className="flex items-center gap-3 bg-card px-3 py-2.5">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                b.status === "validated" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
              }`}
            >
              {b.status === "validated" ? "✓" : "✕"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold">Block #{b.id}</span>
                <span
                  className={`text-[11px] font-semibold ${
                    b.status === "validated" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {b.status === "validated" ? "VALIDATED" : "HASH MISMATCH"}
                </span>
                <span className="text-[10px] text-muted-foreground">{b.timestamp}</span>
              </span>
              <span className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
                SHA-256 {b.hash}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
