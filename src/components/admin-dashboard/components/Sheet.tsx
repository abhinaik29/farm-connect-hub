import type { ReactNode } from "react";

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            onClick={onClose}
            aria-label="close"
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-sm text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}
