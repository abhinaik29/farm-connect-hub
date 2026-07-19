import type { Wallet } from "lucide-react";
import type { LANGS } from "./data";

export type Efficiency = "Efficient" | "Baseline" | "Watch";

export interface Animal {
  rfid: string;
  nickname: string;
  breed: string;
  pedigree: { maternal: string; sire: string };
  dob: string;
  gebv: number;
  yieldLpd: number;
  status: Efficiency;
}

export type Lang = keyof typeof LANGS;
export type PageId = "overview" | "wallet" | "herd" | "performance" | "alerts" | "climate";

export type T = (typeof LANGS)[Lang];

export type Totals = {
  totalYield: string;
  fat: number;
  snf: number;
  pay: string;
  carbon: number;
  methaneKg: number;
  tco2e: number;
};

export type NavItem = { id: PageId; label: string; icon: typeof Wallet };
