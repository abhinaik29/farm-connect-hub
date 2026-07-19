import { useState } from "react";
import { SectionCard } from "../components/SectionCard";
import { Sheet } from "../components/Sheet";
import { INITIAL_COLLISIONS } from "../data";
import type { GeoCollision } from "../types";

export function SecurityPage() {
  const [collisions, setCollisions] = useState<GeoCollision[]>(INITIAL_COLLISIONS);
  const [disputeTarget, setDisputeTarget] = useState<GeoCollision | null>(null);
  const [docReviewed, setDocReviewed] = useState(false);
  const [auditTriggered, setAuditTriggered] = useState<Set<string>>(new Set());

  const unresolvedCount = collisions.filter((c) => !c.resolved).length;

  function triggerFieldAudit(id: string) {
    setAuditTriggered((prev) => new Set(prev).add(id));
  }

  function openDispute(c: GeoCollision) {
    setDisputeTarget(c);
    setDocReviewed(false);
  }

  function resolveDispute(_action: "override" | "reject") {
    if (!disputeTarget) return;
    setCollisions((prev) =>
      prev.map((c) => (c.id === disputeTarget.id ? { ...c, resolved: true } : c)),
    );
    setDisputeTarget(null);
  }

  return (
    <>
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
    </>
  );
}
