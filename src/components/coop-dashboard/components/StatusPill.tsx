export function StatusPill({ status }: { status: "reconciled" | "flagged" }) {
  if (status === "flagged") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-0.5 text-[11px] font-semibold text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        Flagged
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      Reconciled
    </span>
  );
}
