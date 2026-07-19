import type { LucideIcon } from "lucide-react";

export interface LedgerBlock {
  id: number;
  hash: string;
  prevHash: string;
  status: "validated" | "mismatch";
  timestamp: string;
}

export interface GeoCollision {
  id: string;
  farmerA: string;
  farmerB: string;
  distanceM: number;
  detectedAt: string;
  landDocUploaded: boolean;
  landDocBy: string;
  resolved: boolean;
}

export interface VerificationRow {
  rfid: string;
  genomicCert: string;
  coords: string;
  lastDelivery: string;
}

export type PageId = "ledger" | "security" | "regen" | "verification";

export type NavItem = { id: PageId; label: string; icon: LucideIcon };
