import type { LucideIcon } from "lucide-react";

export interface VillageNode {
  id: string;
  village: string;
  amcuTelemetryL: number;
  tankerWeighInL: number;
  herd: number;
  status: "reconciled" | "flagged";
}

export interface MapNode {
  x: number;
  y: number;
  r: number;
  status: "reconciled" | "flagged";
  label: string;
}

export type PageId = "overview" | "map" | "reconciliation" | "ledger" | "export";

export type NavItem = { id: PageId; label: string; icon: LucideIcon };
