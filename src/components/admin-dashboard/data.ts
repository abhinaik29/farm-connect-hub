import type { GeoCollision, LedgerBlock, VerificationRow } from "./types";

function mockHash(seed: number) {
  // deterministic-looking fake sha256 for display
  const hex = (seed * 2654435761) >>> 0;
  return hex.toString(16).padStart(8, "0").repeat(4).slice(0, 64);
}

export const LEDGER_BLOCKS: LedgerBlock[] = Array.from({ length: 6 }, (_, i) => {
  const id = 849201 + i;
  return {
    id,
    hash: mockHash(id),
    prevHash: mockHash(id - 1),
    status: "validated" as const,
    timestamp: `16-Jul-2026 · ${10 + i}:0${i}:12 IST`,
  };
});

export const INITIAL_COLLISIONS: GeoCollision[] = [
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

export const VERIFICATION_STREAM: VerificationRow[] = [
  { rfid: "310492837192", genomicCert: "MAHISHCHIP-GN-88214", coords: "14.797°N, 74.129°E", lastDelivery: "16-Jul 08:30 · 8.5 L" },
  { rfid: "310492838910", genomicCert: "MAHISHCHIP-GN-88215", coords: "14.802°N, 74.141°E", lastDelivery: "16-Jul 08:12 · 9.1 L" },
  { rfid: "310492839044", genomicCert: "MAHISHCHIP-GN-88216", coords: "14.781°N, 74.117°E", lastDelivery: "16-Jul 07:58 · 2.5 L" },
];
