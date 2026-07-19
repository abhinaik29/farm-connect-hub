import { useState } from "react";
import { TOTALS, WITHIN_BOUNDARY, fmt } from "../data";

export function ReconciliationPage() {
  const [flagAcknowledged, setFlagAcknowledged] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg">Mass-Balance Comparative Reconciliation Sheet</h2>
        <span className="text-[11px] text-muted-foreground">Date: 16-Jul-2026</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-3">
          <p className="text-[11px] text-muted-foreground">AMCU Telemetry Piped Sum</p>
          <p className="mt-0.5 font-display text-lg">{fmt(TOTALS.totalTelemetry)} Liters</p>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="text-[11px] text-muted-foreground">Main Dairy Factory Tanker Weigh-in</p>
          <p className="mt-0.5 font-display text-lg">{fmt(TOTALS.totalTanker)} Liters</p>
        </div>
        <div
          className={`rounded-xl border p-3 ${WITHIN_BOUNDARY ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}
        >
          <p className="text-[11px] text-muted-foreground">Unreconciled Variance</p>
          <p className={`mt-0.5 font-display text-lg ${WITHIN_BOUNDARY ? "text-primary" : "text-destructive"}`}>
            {TOTALS.variancePct > 0 ? "+" : ""}
            {TOTALS.variancePct.toFixed(2)}%{" "}
            <span className="text-xs font-sans font-normal">
              {WITHIN_BOUNDARY ? "✅ Safe boundary < 2%" : "🚩 Exceeds safe boundary"}
            </span>
          </p>
        </div>
      </div>

      {!WITHIN_BOUNDARY && (
        <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3">
          <p className="text-sm font-semibold text-destructive">
            Variance exceeds the 2.0% safe boundary — potential metrics fraud flagged
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Affected node{TOTALS.flagged.length > 1 ? "s" : ""}:{" "}
            {TOTALS.flagged.map((f) => f.village).join(", ")}. Carbon bonus accruals for{" "}
            {TOTALS.flagged.length > 1 ? "these nodes have" : "this node has"} been paused automatically,
            and the system administrator has been alerted to investigate.
          </p>
          {!flagAcknowledged ? (
            <button
              onClick={() => setFlagAcknowledged(true)}
              className="mt-3 rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground hover:brightness-110"
            >
              Acknowledge & escalate to admin
            </button>
          ) : (
            <p className="mt-3 text-xs text-primary">✓ Escalation sent to system administrator</p>
          )}
        </div>
      )}
    </section>
  );
}
