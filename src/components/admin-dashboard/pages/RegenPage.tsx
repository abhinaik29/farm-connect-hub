import { useState } from "react";
import { SectionCard } from "../components/SectionCard";

const CREDITS_READY = 12482;

export function RegenPage() {
  const [mintingEnabled, setMintingEnabled] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [pushed, setPushed] = useState(false);

  function pushToRegen() {
    setPushing(true);
    setTimeout(() => {
      setPushing(false);
      setPushed(true);
    }, 900);
  }

  return (
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
          <p className="mt-2 font-display text-lg text-accent">{CREDITS_READY.toLocaleString("en-IN")} tCO₂e</p>
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
  );
}
