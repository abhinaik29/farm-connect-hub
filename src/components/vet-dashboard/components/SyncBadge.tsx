export function SyncBadge({ online, pending }: { online: boolean; pending: number }) {
  if (!online) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-semibold text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        Offline{pending > 0 ? ` · ${pending} queued` : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      Sync: OK
    </span>
  );
}
