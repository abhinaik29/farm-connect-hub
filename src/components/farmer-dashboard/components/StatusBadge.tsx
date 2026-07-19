import type { Efficiency } from "../types";

export function StatusBadge({ s }: { s: Efficiency }) {
  const map: Record<Efficiency, string> = {
    Efficient: "bg-primary/15 text-primary",
    Baseline: "bg-earth/20 text-earth",
    Watch: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${map[s]}`}>{s}</span>
  );
}
