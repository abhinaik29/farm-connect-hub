import { TextField } from "../components/TextField";
import { ageFromDob, KNOWN_ANIMALS } from "../data";
import type { AnimalRecord } from "../types";

export function ScanPage({
  online,
  setOnline,
  readerPaired,
  rfidInput,
  setRfidInput,
  scanning,
  onScan,
  activeRfid,
  animal,
  lookupAttempted,
  onLogBreeding,
  onGoToDna,
  onOnboard,
}: {
  online: boolean;
  setOnline: (v: boolean | ((prev: boolean) => boolean)) => void;
  readerPaired: boolean;
  rfidInput: string;
  setRfidInput: (v: string) => void;
  scanning: boolean;
  onScan: () => void;
  activeRfid: string | null;
  animal: AnimalRecord | undefined;
  lookupAttempted: boolean;
  onLogBreeding: () => void;
  onGoToDna: () => void;
  onOnboard: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Reader status */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-lg">🔗</span>
            <div>
              <p className="text-sm font-semibold">
                {readerPaired ? "Bluetooth wand reader paired" : "No reader paired"}
              </p>
              <p className="text-[11px] text-muted-foreground">Active reader</p>
            </div>
          </div>
          <button
            onClick={() => setOnline((v) => !v)}
            className="text-[11px] text-muted-foreground underline decoration-dotted underline-offset-2"
          >
            simulate {online ? "offline" : "online"}
          </button>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <div className="flex-1">
            <TextField
              label="Current RFID scan"
              value={rfidInput}
              onChange={setRfidInput}
              placeholder="Scan or type tag number"
              mono
            />
          </div>
          <button
            onClick={onScan}
            disabled={scanning || !rfidInput.trim()}
            className="h-[42px] shrink-0 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 disabled:opacity-50"
          >
            {scanning ? "Scanning…" : "Scan"}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Object.keys(KNOWN_ANIMALS).map((rfid) => (
            <button
              key={rfid}
              onClick={() => setRfidInput(rfid)}
              className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground hover:bg-muted/70"
            >
              try {rfid}
            </button>
          ))}
        </div>
      </section>

      {/* Animal record */}
      {lookupAttempted && (
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          {animal ? (
            <>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-lg">Animal Record Found</h2>
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {animal.rfid}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[11px] text-muted-foreground">Owner</dt>
                  <dd className="font-medium">{animal.owner}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground">Village</dt>
                  <dd className="font-medium">{animal.village}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground">Pedigree</dt>
                  <dd className="font-medium">{animal.pedigree}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground">Age</dt>
                  <dd className="font-medium">{ageFromDob(animal.dob)}</dd>
                </div>
              </dl>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={onLogBreeding}
                  className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110"
                >
                  Log Breeding Event
                </button>
                <button
                  onClick={onGoToDna}
                  className="rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  TSU DNA Notch
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display text-lg text-destructive">No Record Found</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                RFID <span className="font-mono">{activeRfid}</span> isn't in the registry yet.
              </p>
              <button
                onClick={onOnboard}
                className="mt-4 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-md hover:brightness-110"
              >
                Onboard New Animal
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}
