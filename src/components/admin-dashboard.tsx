import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Account } from "@/lib/auth-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/** ---------- Mock data ---------- */

interface LedgerBlock {
  id: number;
  hash: string;
  prevHash: string;
  status: "validated" | "mismatch";
  timestamp: string;
}

function mockHash(seed: number) {
  // deterministic-looking fake sha256 for display
  const hex = (seed * 2654435761) >>> 0;
  return hex.toString(16).padStart(8, "0").repeat(4).slice(0, 64);
}

const LEDGER_BLOCKS: LedgerBlock[] = Array.from({ length: 6 }, (_, i) => {
  const id = 849201 + i;
  return {
    id,
    hash: mockHash(id),
    prevHash: mockHash(id - 1),
    status: "validated" as const,
    timestamp: `16-Jul-2026 · ${10 + i}:0${i}:12 IST`,
  };
});

interface GeoCollision {
  id: string;
  farmerA: string;
  farmerB: string;
  distanceM: number;
  detectedAt: string;
  landDocUploaded: boolean;
  landDocBy: string;
  resolved: boolean;
}

const INITIAL_COLLISIONS: GeoCollision[] = [
  {
    id: "GF-4471",
    farmerA: "US-49201",
    farmerB: "US-49283",
    distanceM: 50,
    detectedAt: "16-Jul-2026 · 07:22 IST",
    landDocUploaded: true,
    landDocBy: "Dr. Aditi Rao (Field Vet)",
    resolved: false,
  },
];

interface VerificationRow {
  rfid: string;
  genomicCert: string;
  coords: string;
  lastDelivery: string;
}

const VERIFICATION_STREAM: VerificationRow[] = [
  { rfid: "310492837192", genomicCert: "MAHISHCHIP-GN-88214", coords: "14.797°N, 74.129°E", lastDelivery: "16-Jul 08:30 · 8.5 L" },
  { rfid: "310492838910", genomicCert: "MAHISHCHIP-GN-88215", coords: "14.802°N, 74.141°E", lastDelivery: "16-Jul 08:12 · 9.1 L" },
  { rfid: "310492839044", genomicCert: "MAHISHCHIP-GN-88216", coords: "14.781°N, 74.117°E", lastDelivery: "16-Jul 07:58 · 2.5 L" },
];

/** ---------- Small shared bits ---------- */

function SectionCard({
  title,
  sub,
  children,
  tone,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-[11px] hover:bg-muted"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
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

/** ---------- Main component ---------- */

export function AdminDashboard({
  user,
  onSignOut,
}: {
  user: Account | null;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const [collisions, setCollisions] = useState<GeoCollision[]>(INITIAL_COLLISIONS);
  const [disputeTarget, setDisputeTarget] = useState<GeoCollision | null>(null);
  const [docReviewed, setDocReviewed] = useState(false);
  const [auditTriggered, setAuditTriggered] = useState<Set<string>>(new Set());

  const [mintingEnabled, setMintingEnabled] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [pushed, setPushed] = useState(false);

  const unresolvedCount = collisions.filter((c) => !c.resolved).length;
  const creditsReady = 12482;

  function triggerFieldAudit(id: string) {
    setAuditTriggered((prev) => new Set(prev).add(id));
  }

  function openDispute(c: GeoCollision) {
    setDisputeTarget(c);
    setDocReviewed(false);
  }

  function resolveDispute(action: "override" | "reject") {
    if (!disputeTarget) return;
    setCollisions((prev) =>
      prev.map((c) => (c.id === disputeTarget.id ? { ...c, resolved: true } : c)),
    );
    setDisputeTarget(null);
  }

  function pushToRegen() {
    setPushing(true);
    setTimeout(() => {
      setPushing(false);
      setPushed(true);
    }, 900);
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
                ADMINISTRATION &amp; <span className="text-primary">AUDIT SECURITY PANEL</span>
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Signed in as {user?.name || user?.email || user?.phone || "…"}
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
        {/* Crypto ledger audit logs */}
        <SectionCard title="Crypto Ledger Tamper Audit Logs" sub={`${LEDGER_BLOCKS.length} most recent blocks`}>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {LEDGER_BLOCKS.map((b) => (
              <li key={b.id} className="flex items-center gap-3 bg-card px-3 py-2.5">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                    b.status === "validated" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {b.status === "validated" ? "✓" : "✕"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-semibold">Block #{b.id}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        b.status === "validated" ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {b.status === "validated" ? "VALIDATED" : "HASH MISMATCH"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{b.timestamp}</span>
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
                    SHA-256 {b.hash}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Flagged security warnings */}
        <SectionCard
          title="Flagged Security Warnings"
          sub={`${unresolvedCount} unresolved exception${unresolvedCount === 1 ? "" : "s"}`}
          tone={unresolvedCount > 0 ? "warn" : undefined}
        >
          {collisions.length === 0 && (
            <p className="text-sm text-muted-foreground">No active security exceptions.</p>
          )}
          <div className="space-y-3">
            {collisions.map((c) => (
              <div
                key={c.id}
                className={`rounded-xl border p-3 ${
                  c.resolved ? "border-border bg-muted/30" : "border-destructive/40 bg-destructive/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      c.resolved ? "bg-muted text-muted-foreground" : "bg-destructive text-destructive-foreground"
                    }`}
                  >
                    ⚠
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      Geo-Fencing Collision Detected {c.resolved && <span className="font-normal text-muted-foreground">— resolved</span>}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      Farmer ID: <span className="font-mono">{c.farmerA}</span> and{" "}
                      <span className="font-mono">{c.farmerB}</span> overlap within {c.distanceM}m.
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Detected {c.detectedAt} · Case {c.id}
                    </p>
                  </div>
                </div>
                {!c.resolved && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => triggerFieldAudit(c.id)}
                      disabled={auditTriggered.has(c.id)}
                      className="rounded-xl border border-border bg-card py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-50"
                    >
                      {auditTriggered.has(c.id) ? "✓ Field audit dispatched" : "Trigger Field Audit"}
                    </button>
                    <button
                      onClick={() => openDispute(c)}
                      className="rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground shadow-md hover:brightness-110"
                    >
                      Resolve Dispute Manually
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Regen Network protocol hook */}
        <SectionCard title="Regen Network Protocol Hook">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">Ecological Asset Minting State</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setMintingEnabled((v) => !v)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    mintingEnabled ? "bg-primary" : "bg-muted"
                  }`}
                  aria-pressed={mintingEnabled}
                  aria-label="toggle minting"
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                      mintingEnabled ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className={`text-sm font-semibold ${mintingEnabled ? "text-primary" : "text-muted-foreground"}`}>
                  {mintingEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">Active Credit Class Schema</p>
              <p className="mt-2 font-mono text-sm">SMIAC-v1.0.0</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">Credits Ready for Verification</p>
              <p className="mt-2 font-display text-lg text-accent">{creditsReady.toLocaleString("en-IN")} tCO₂e</p>
            </div>
          </div>
          <div className="mt-3">
            {pushed ? (
              <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">
                ✓ Verified data ledger pushed to Regen Registry
              </p>
            ) : (
              <button
                onClick={pushToRegen}
                disabled={!mintingEnabled || pushing}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 disabled:opacity-40 sm:w-auto sm:px-6"
              >
                {pushing ? "Pushing…" : "Push Verified Data Ledger to Regen Registry"}
              </button>
            )}
          </div>
        </SectionCard>

        {/* Verification stream endpoint */}
        <SectionCard title="Verification Stream API Endpoint" sub="Read-only, transparent pipeline access">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
              GET
            </span>
            <span className="flex-1 truncate font-mono text-xs">/api/v1/audit/verification-stream</span>
            <CopyButton text="GET /api/v1/audit/verification-stream" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Links Pashu Aadhaar RFID identifiers to their MAHISHCHIP genomic certificates, PostGIS coordinates, and
            milk delivery logs — for auditors such as Regen Network, Ivy Protocol, or external verifiers.
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pashu Aadhaar RFID</TableHead>
                  <TableHead>MAHISHCHIP Genomic Cert</TableHead>
                  <TableHead>PostGIS Coordinates</TableHead>
                  <TableHead>Last Milk Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VERIFICATION_STREAM.map((r) => (
                  <TableRow key={r.rfid}>
                    <TableCell className="font-mono text-xs">{r.rfid}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.genomicCert}</TableCell>
                    <TableCell className="text-xs">{r.coords}</TableCell>
                    <TableCell className="text-xs">{r.lastDelivery}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </main>

      {/* Dispute resolution sheet */}
      {disputeTarget && (
        <Sheet title="Dispute Resolution Control Panel" onClose={() => setDisputeTarget(null)}>
          <p className="text-sm text-muted-foreground">
            Case <span className="font-mono">{disputeTarget.id}</span> — Farmer{" "}
            <span className="font-mono">{disputeTarget.farmerA}</span> vs.{" "}
            <span className="font-mono">{disputeTarget.farmerB}</span>, {disputeTarget.distanceM}m overlap
          </p>

          <div className="rounded-xl border border-border p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Land Ownership Document</p>
            {disputeTarget.landDocUploaded ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-sm">📄</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">land-title-scan-{disputeTarget.id}.pdf</p>
                  <p className="text-[11px] text-muted-foreground">Uploaded by {disputeTarget.landDocBy}</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-destructive">
                No land ownership document has been uploaded by a field vet yet — override is unavailable.
              </p>
            )}
          </div>

          {disputeTarget.landDocUploaded && (
            <label className="flex items-start gap-2 rounded-xl border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={docReviewed}
                onChange={(e) => setDocReviewed(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                I have reviewed the physical land ownership document and confirm the spatial flag may be overridden.
              </span>
            </label>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => resolveDispute("reject")}
              className="rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted"
            >
              Uphold Flag
            </button>
            <button
              onClick={() => resolveDispute("override")}
              disabled={!disputeTarget.landDocUploaded || !docReviewed}
              className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 disabled:opacity-40"
            >
              Override Spatial Flag
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
