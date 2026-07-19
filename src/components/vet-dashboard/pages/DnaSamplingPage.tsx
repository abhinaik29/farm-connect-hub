import { useState } from "react";
import { TextField } from "../components/TextField";
import type { AnimalRecord, QueuedJobType } from "../types";

export function DnaSamplingPage({
  animal,
  queueJob,
}: {
  animal: AnimalRecord | undefined;
  queueJob: (rfid: string, type: QueuedJobType) => void;
}) {
  const [labReceipt, setLabReceipt] = useState("");
  const [tsuBarcode, setTsuBarcode] = useState("");
  const [genomicError, setGenomicError] = useState<string | null>(null);
  const [genomicSuccess, setGenomicSuccess] = useState(false);

  function commitGenomicRecord() {
    if (!animal) return;
    if (!labReceipt.trim() || !tsuBarcode.trim()) {
      setGenomicError("Lab receipt number and TSU barcode are both required.");
      return;
    }
    if (animal.labReceipts.includes(labReceipt.trim())) {
      setGenomicError("Duplicate tissue registration — this receipt is already logged for this animal.");
      return;
    }
    animal.labReceipts.push(labReceipt.trim());
    queueJob(animal.rfid, "Genomic Sample Record");
    setGenomicError(null);
    setGenomicSuccess(true);
    setLabReceipt("");
    setTsuBarcode("");
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="font-display text-lg">DNA Sampling Control Panel</h2>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {animal ? `For ${animal.owner}'s animal · ${animal.rfid}` : "Scan an animal to enable sampling"}
      </p>
      <div className="mt-3 space-y-3">
        <TextField
          label="Lab Receipt Number"
          value={labReceipt}
          onChange={setLabReceipt}
          placeholder="NDRI-M60K-849201"
          mono
        />
        <TextField
          label="NDDB TSU Sample Barcode"
          value={tsuBarcode}
          onChange={setTsuBarcode}
          placeholder="||||||||||||||||||"
          mono
        />
        {genomicError && (
          <p className="rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive">{genomicError}</p>
        )}
        {genomicSuccess && (
          <p className="rounded-xl bg-primary/10 p-2.5 text-xs text-primary">
            ✓ Genomic record queued for ledger commit
          </p>
        )}
        <button
          onClick={commitGenomicRecord}
          disabled={!animal}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 disabled:opacity-40"
        >
          Commit Genomic Record to Ledger
        </button>
      </div>
    </section>
  );
}
