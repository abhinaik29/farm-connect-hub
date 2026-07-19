import type { ReactNode } from "react";

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{children}</p>;
}
