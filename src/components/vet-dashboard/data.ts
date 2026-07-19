import type { AnimalRecord } from "./types";

export const KNOWN_ANIMALS: Record<string, AnimalRecord> = {
  "310492837192": {
    rfid: "310492837192",
    owner: "Raman Gowda",
    village: "Karwar-Cluster-B",
    pedigree: "F1 Cross",
    dob: "2025-05-18", // ~14 months before demo "today"
    labReceipts: [],
  },
  "310492838910": {
    rfid: "310492838910",
    owner: "Lakshmi Naik",
    village: "Karwar-Cluster-A",
    pedigree: "Indigenous",
    dob: "2023-02-02",
    labReceipts: ["NDRI-M60K-001177"],
  },
};

export function ageFromDob(dob: string): string {
  const then = new Date(dob).getTime();
  const now = Date.now();
  const months = Math.max(0, Math.round((now - then) / (1000 * 60 * 60 * 24 * 30.44)));
  if (months < 12) return `${months} Months`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${years} yr` : `${years} yr ${rem} mo`;
}
