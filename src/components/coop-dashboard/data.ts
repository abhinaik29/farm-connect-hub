import type { MapNode, VillageNode } from "./types";

export const VILLAGE_NODES: VillageNode[] = [
  { id: "KWR-B01", village: "Karwar-Cluster-A", amcuTelemetryL: 42100, tankerWeighInL: 41960, herd: 2810, status: "reconciled" },
  { id: "KWR-B02", village: "Karwar-Cluster-B", amcuTelemetryL: 38700, tankerWeighInL: 38550, herd: 2540, status: "reconciled" },
  { id: "KWR-B03", village: "Ankola-Cluster-A", amcuTelemetryL: 29850, tankerWeighInL: 27100, herd: 1980, status: "flagged" },
  { id: "KWR-B04", village: "Sirsi-Cluster-C", amcuTelemetryL: 33420, tankerWeighInL: 33190, herd: 2260, status: "reconciled" },
  { id: "KWR-B05", village: "Yellapur-Cluster-A", amcuTelemetryL: 22300, tankerWeighInL: 22260, herd: 1510, status: "reconciled" },
  { id: "KWR-B06", village: "Dandeli-Cluster-B", amcuTelemetryL: 21130, tankerWeighInL: 21070, herd: 1380, status: "reconciled" },
];

export const MAP_NODES: MapNode[] = [
  { x: 22, y: 28, r: 9, status: "reconciled", label: "Karwar-Cluster-A" },
  { x: 34, y: 18, r: 7, status: "reconciled", label: "Karwar-Cluster-B" },
  { x: 58, y: 34, r: 10, status: "flagged", label: "Ankola-Cluster-A" },
  { x: 71, y: 52, r: 8, status: "reconciled", label: "Sirsi-Cluster-C" },
  { x: 46, y: 64, r: 6, status: "reconciled", label: "Yellapur-Cluster-A" },
  { x: 63, y: 76, r: 6, status: "reconciled", label: "Dandeli-Cluster-B" },
];

export const HERD_TARGET = 25000;

export function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Derived aggregate totals — VILLAGE_NODES is static, so these are computed
// once at module load rather than recomputed via useMemo in every consumer.
function computeTotals() {
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
}

export const TOTALS = computeTotals();
export const WITHIN_BOUNDARY = Math.abs(TOTALS.variancePct) < 2.0;
export const HERD_PROGRESS = Math.min(100, Math.round((TOTALS.totalHerd / HERD_TARGET) * 100));

export function exportScope3(format: "csv" | "json-ld") {
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
        totalHerd: TOTALS.totalHerd,
        emissionsIntensityKgCo2ePerLiter: TOTALS.emissionsIntensity,
        baselineAvoidedTco2ePerYear: TOTALS.baselineAvoided,
      },
      nodes: VILLAGE_NODES,
    };
    downloadFile("scope3-jsonld-export.json", JSON.stringify(payload, null, 2), "application/ld+json");
  }
}
