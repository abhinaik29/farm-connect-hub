import { exportScope3 } from "../data";

export function ExportPage() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="font-display text-lg">Scope 3 Export Panel</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Generates reports conforming to Science Based Targets initiative (SBTi) and GHG Protocol Scope 3
        reporting guidelines.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:w-96">
        <button
          onClick={() => exportScope3("csv")}
          className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportScope3("json-ld")}
          className="rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted"
        >
          Export JSON-LD
        </button>
      </div>
    </section>
  );
}
