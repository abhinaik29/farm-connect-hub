import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function SectionCard({
  title,
  desc,
  onClick,
  tone = "default",
  children,
}: {
  title: string;
  desc?: string;
  onClick: () => void;
  tone?: "default" | "primary" | "accent";
  children?: ReactNode;
}) {
  const toneCls =
    tone === "primary"
      ? "border-primary/30 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
      : tone === "accent"
      ? "border-accent/40 bg-accent/10"
      : "border-border bg-card";
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md active:scale-[0.99] ${toneCls}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-base font-semibold">{title}</p>
          {desc && <p className="mt-0.5 text-xs opacity-80">{desc}</p>}
        </div>
        <ChevronRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5" />
      </div>
      {children && <div className="mt-3">{children}</div>}
    </button>
  );
}
