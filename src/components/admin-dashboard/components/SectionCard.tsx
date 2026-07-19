import type { ReactNode } from "react";

export function SectionCard({
  title,
  sub,
  children,
  tone,
}: {
  title: string;
  sub?: string;
  children: ReactNode;
  tone?: "warn";
}) {
  return (
    <section
      className={`rounded-2xl border p-4 shadow-sm ${
        tone === "warn" ? "border-destructive/40 bg-destructive/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h2 className={`font-display text-lg ${tone === "warn" ? "text-destructive" : ""}`}>{title}</h2>
        {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
