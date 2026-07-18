import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Account } from "@/lib/auth-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** ---------- Mock data ---------- */

interface VillageNode {
  id: string;
  village: string;
  amcuTelemetryL: number;
  tankerWeighInL: number;
  herd: number;
  status: "reconciled" | "flagged";
}

const VILLAGE_NODES: VillageNode[] = [
  { id: "KWR-B01", village: "Karwar-Cluster-A", amcuTelemetryL: 42100, tankerWeighInL: 41960, herd: 2810, status: "reconciled" },
  { id: "KWR-B02", village: "Karwar-Cluster-B", amcuTelemetryL: 38700, tankerWeighInL: 38550, herd: 2540, status: "reconciled" },
  { id: "KWR-B03", village: "Ankola-Cluster-A", amcuTelemetryL: 29850, tankerWeighInL: 27100, herd: 1980, status: "flagged" },
  { id: "KWR-B04", village: "Sirsi-Cluster-C", amcuTelemetryL: 33420, tankerWeighInL: 33190, herd: 2260, status: "reconciled" },
  { id: "KWR-B05", village: "Yellapur-Cluster-A", amcuTelemetryL: 22300, tankerWeighInL: 22260, herd: 1510, status: "reconciled" },
  { id: "KWR-B06", village: "Dandeli-Cluster-B", amcuTelemetryL: 21130, tankerWeighInL: 21070, herd: 1380, status: "reconciled" },
];

const MAP_NODES = [
  { x: 22, y: 28, r: 9, status: "reconciled" as const, label: "Karwar-Cluster-A" },
  { x: 34, y: 18, r: 7, status: "reconciled" as const, label: "Karwar-Cluster-B" },
  { x: 58, y: 34, r: 10, status: "flagged" as const, label: "Ankola-Cluster-A" },
  { x: 71, y: 52, r: 8, status: "reconciled" as const, label: "Sirsi-Cluster-C" },
  { x: 46, y: 64, r: 6, status: "reconciled" as const, label: "Yellapur-Cluster-A" },
  { x: 63, y: 76, r: 6, status: "reconciled" as const, label: "Dandeli-Cluster-B" },
];

const HERD_TARGET = 25000;

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

/** ---------- Small shared bits ---------- */

function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "primary" | "accent" | "earth";
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "accent"
        ? "text-accent"
        : tone === "earth"
          ? "text-earth"
          : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-2xl ${toneClass}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function StatusPill({ status }: { status: "reconciled" | "flagged" }) {
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

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** ---------- Main component ---------- */

export function CoopDashboard({
  user,
  onSignOut,
}: {
  user: Account | null;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [flagAcknowledged, setFlagAcknowledged] = useState(false);

  const totals = useMemo(() => {
    const totalHerd = VILLAGE_NODES.reduce((s, v) => s + v.herd, 0);
    const totalTelemetry = VILLAGE_NODES.reduce((s, v) => s + v.amcuTelemetryL, 0);
    const totalTanker = VILLAGE_NODES.reduce((s, v) => s + v.tankerWeighInL, 0);
    const variancePct = ((totalTanker - totalTelemetry) / totalTelemetry) * 100;
    const flagged = VILLAGE_NODES.filter((v) => v.status === "flagged");
    return {
      totalHerd,
      totalTelemetry,
      totalTanker,
      variancePct,
      flagged,
      emissionsIntensity: 1.045,
      baselineAvoided: 37500,
    };
  }, []);

  const withinBoundary = Math.abs(totals.variancePct) < 2.0;
  const herdProgress = Math.min(100, Math.round((totals.totalHerd / HERD_TARGET) * 100));

  function exportScope3(format: "csv" | "json-ld") {
    if (format === "csv") {
      const header = "village_id,village,amcu_telemetry_l,tanker_weighin_l,herd,status\n";
      const rows = VILLAGE_NODES.map(
        (v) => `${v.id},${v.village},${v.amcuTelemetryL},${v.tankerWeighInL},${v.herd},${v.status}`,
      ).join("\n");
      downloadFile("scope3-ghg-protocol-export.csv", header + rows, "text/csv");
    } else {
      const payload = {
        "@context": "https://schema.org/",
        "@type": "Dataset",
        name: "Project One Buffalo — Scope 3 Emissions Report",
        conformsTo: ["SBTi", "GHG Protocol Scope 3"],
        dateGenerated: new Date().toISOString(),
        aggregate: {
          totalHerd: totals.totalHerd,
          emissionsIntensityKgCo2ePerLiter: totals.emissionsIntensity,
          baselineAvoidedTco2ePerYear: totals.baselineAvoided,
        },
        nodes: VILLAGE_NODES,
      };
      downloadFile("scope3-jsonld-export.json", JSON.stringify(payload, null, 2), "application/ld+json");
    }
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              aria-label="back"
              onClick={() => navigate({ to: "/" })}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border text-lg"
            >
              ‹
            </button>
            <div>
              <h1 className="font-display text-lg leading-tight">
                PROJECT ONE BUFFALO — <span className="text-primary">Cooperative Control Portal</span>
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Signed in as {user?.name || user?.phone || "…"}
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        {/* Union Scope 3 statistics */}
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl">Union Scope 3 Statistics</h2>
            <span className="text-xs text-muted-foreground">
              Aggregate target: {fmt(HERD_TARGET)} herd · {herdProgress}% enrolled
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${herdProgress}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total Milk Volume" value={`${fmt(totals.totalTelemetry)} L/d`} tone="primary" />
            <StatCard label="Total F1 Heifers" value={fmt(totals.totalHerd)} sub="head enrolled" />
            <StatCard
              label="Emissions Intensity"
              value={`${totals.emissionsIntensity.toFixed(3)} kg`}
              sub="CO₂e / Liter"
              tone="earth"
            />
            <StatCard
              label="Baseline Avoided"
              value={`${fmt(totals.baselineAvoided)} t`}
              sub="CO₂e / Year"
              tone="accent"
            />
          </div>
        </section>

        {/* Geographical PostGIS heatmap */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-display text-lg">Geographical PostGIS Heatmap</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Active coordinate clusters, geo-fences, and village milk collection routes
          </p>
          <div className="relative mt-3 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted/40">
            <svg viewBox="0 0 100 62.5" className="h-full w-full">
              <defs>
                <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M 6 0 L 0 0 0 6" fill="none" stroke="var(--border)" strokeWidth="0.2" />
                </pattern>
              </defs>
              <rect width="100" height="62.5" fill="url(#grid)" />
              {/* mock route lines connecting village nodes */}
              <polyline
                points={MAP_NODES.map((n) => `${n.x},${n.y}`).join(" ")}
                fill="none"
                stroke="var(--earth)"
                strokeWidth="0.5"
                strokeDasharray="1.5 1.5"
                opacity="0.5"
              />
              {MAP_NODES.map((n) => (
                <g
                  key={n.label}
                  onMouseEnter={() => setHoveredNode(n.label)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r / 2}
                    fill={n.status === "flagged" ? "var(--destructive)" : "var(--primary)"}
                    opacity="0.18"
                  />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r / 5}
                    fill={n.status === "flagged" ? "var(--destructive)" : "var(--primary)"}
                    stroke="var(--card)"
                    strokeWidth="0.6"
                  />
                </g>
              ))}
            </svg>
            {hoveredNode && (
              <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-md">
                {hoveredNode}
              </div>
            )}
            <div className="absolute bottom-2 right-2 flex items-center gap-3 rounded-lg border border-border bg-card/90 px-2.5 py-1.5 text-[10px] backdrop-blur">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" /> Reconciled node
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" /> Flagged node
              </span>
            </div>
          </div>
        </section>

        {/* Mass-balance reconciliation sheet */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg">Mass-Balance Comparative Reconciliation Sheet</h2>
            <span className="text-[11px] text-muted-foreground">Date: 16-Jul-2026</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">AMCU Telemetry Piped Sum</p>
              <p className="mt-0.5 font-display text-lg">{fmt(totals.totalTelemetry)} Liters</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">Main Dairy Factory Tanker Weigh-in</p>
              <p className="mt-0.5 font-display text-lg">{fmt(totals.totalTanker)} Liters</p>
            </div>
            <div
              className={`rounded-xl border p-3 ${withinBoundary ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}
            >
              <p className="text-[11px] text-muted-foreground">Unreconciled Variance</p>
              <p className={`mt-0.5 font-display text-lg ${withinBoundary ? "text-primary" : "text-destructive"}`}>
                {totals.variancePct > 0 ? "+" : ""}
                {totals.variancePct.toFixed(2)}%{" "}
                <span className="text-xs font-sans font-normal">
                  {withinBoundary ? "✅ Safe boundary < 2%" : "🚩 Exceeds safe boundary"}
                </span>
              </p>
            </div>
          </div>

          {!withinBoundary && (
            <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3">
              <p className="text-sm font-semibold text-destructive">
                Variance exceeds the 2.0% safe boundary — potential metrics fraud flagged
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Affected node{totals.flagged.length > 1 ? "s" : ""}:{" "}
                {totals.flagged.map((f) => f.village).join(", ")}. Carbon bonus accruals for{" "}
                {totals.flagged.length > 1 ? "these nodes have" : "this node has"} been paused automatically,
                and the system administrator has been alerted to investigate.
              </p>
              {!flagAcknowledged ? (
                <button
                  onClick={() => setFlagAcknowledged(true)}
                  className="mt-3 rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground hover:brightness-110"
                >
                  Acknowledge & escalate to admin
                </button>
              ) : (
                <p className="mt-3 text-xs text-primary">✓ Escalation sent to system administrator</p>
              )}
            </div>
          )}
        </section>

        {/* High-density village node table */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-display text-lg">Village AMCU Node Ledger</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node ID</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead className="text-right">Telemetry (L)</TableHead>
                  <TableHead className="text-right">Tanker (L)</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">Herd</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VILLAGE_NODES.map((v) => {
                  const variance = ((v.tankerWeighInL - v.amcuTelemetryL) / v.amcuTelemetryL) * 100;
                  return (
                    <TableRow key={v.id} className={v.status === "flagged" ? "bg-destructive/5" : undefined}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{v.id}</TableCell>
                      <TableCell className="font-medium">{v.village}</TableCell>
                      <TableCell className="text-right">{fmt(v.amcuTelemetryL)}</TableCell>
                      <TableCell className="text-right">{fmt(v.tankerWeighInL)}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${Math.abs(variance) >= 2 ? "text-destructive" : "text-primary"}`}
                      >
                        {variance > 0 ? "+" : ""}
                        {variance.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{fmt(v.herd)}</TableCell>
                      <TableCell>
                        <StatusPill status={v.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Scope 3 export panel */}
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
      </main>
    </div>
  );
}
