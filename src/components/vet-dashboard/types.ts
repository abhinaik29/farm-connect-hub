import type { LucideIcon } from "lucide-react";

export interface AnimalRecord {
  rfid: string;
  owner: string;
  village: string;
  pedigree: string;
  dob: string; // ISO
  labReceipts: string[]; // already-used lab receipt numbers, for dup checks
}

export type QueuedJobType = "Ear Tag Activation Record" | "Artificial Insemination Log" | "Genomic Sample Record";

export interface QueuedJob {
  id: string;
  rfid: string;
  type: QueuedJobType;
  queuedAt: string;
}

export type PageId = "scan" | "dna" | "queue";

export type NavItem = { id: PageId; label: string; icon: LucideIcon };
