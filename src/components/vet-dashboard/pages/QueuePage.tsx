import type { QueuedJob } from "../types";

export function QueuePage({ queue }: { queue: QueuedJob[] }) {
  return (
    <section className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-base text-accent-foreground/90">
          <span className="text-accent">Offline Queued Jobs</span>
        </h2>
        <span className="text-xs text-muted-foreground">{queue.length} pending uploads</span>
      </div>
      <ul className="mt-3 space-y-2">
        {queue.map((job) => (
          <li
            key={job.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-sm">
              {job.type === "Artificial Insemination Log" ? "🧬" : job.type === "Genomic Sample Record" ? "🧫" : "🏷️"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{job.type}</span>
              <span className="block font-mono text-[11px] text-muted-foreground">RFID {job.rfid}</span>
            </span>
            <span className="shrink-0 text-[10px] text-muted-foreground">{job.queuedAt}</span>
          </li>
        ))}
        {queue.length === 0 && (
          <li className="rounded-xl border border-dashed border-border bg-card px-3 py-4 text-center text-xs text-muted-foreground">
            All caught up — nothing queued.
          </li>
        )}
      </ul>
    </section>
  );
}
