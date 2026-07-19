import { StatCard } from "../components/StatCard";
import { HERD_TARGET, HERD_PROGRESS, TOTALS, fmt } from "../data";

export function OverviewPage() {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl">Union Scope 3 Statistics</h2>
        <span className="text-xs text-muted-foreground">
          Aggregate target: {fmt(HERD_TARGET)} herd · {HERD_PROGRESS}% enrolled
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${HERD_PROGRESS}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Milk Volume" value={`${fmt(TOTALS.totalTelemetry)} L/d`} tone="primary" />
        <StatCard label="Total F1 Heifers" value={fmt(TOTALS.totalHerd)} sub="head enrolled" />
        <StatCard
          label="Emissions Intensity"
          value={`${TOTALS.emissionsIntensity.toFixed(3)} kg`}
          sub="CO₂e / Liter"
          tone="earth"
        />
        <StatCard
          label="Baseline Avoided"
          value={`${fmt(TOTALS.baselineAvoided)} t`}
          sub="CO₂e / Year"
          tone="accent"
        />
      </div>
    </section>
  );
}
