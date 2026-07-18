import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Account } from "@/lib/auth-store";

/** ---------- Mock data ---------- */

interface AnimalRecord {
  rfid: string;
  owner: string;
  village: string;
  pedigree: string;
  dob: string; // ISO
  labReceipts: string[]; // already-used lab receipt numbers, for dup checks
}

const KNOWN_ANIMALS: Record<string, AnimalRecord> = {
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

type QueuedJobType = "Ear Tag Activation Record" | "Artificial Insemination Log" | "Genomic Sample Record";

interface QueuedJob {
  id: string;
  rfid: string;
  type: QueuedJobType;
  queuedAt: string;
}

function ageFromDob(dob: string): string {
  const then = new Date(dob).getTime();
  const now = Date.now();
  const months = Math.max(0, Math.round((now - then) / (1000 * 60 * 60 * 24 * 30.44)));
  if (months < 12) return `${months} Months`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${years} yr` : `${years} yr ${rem} mo`;
}

/** ---------- Small shared bits ---------- */

function SyncBadge({ online, pending }: { online: boolean; pending: number }) {
  if (!online) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-semibold text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        Offline{pending > 0 ? ` · ${pending} queued` : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      Sync: OK
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{children}</p>;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            onClick={onClose}
            aria-label="close"
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-sm text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}

/** ---------- Main component ---------- */

export function VetDashboard({
  user,
  onSignOut,
}: {
  user: Account | null;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const [online, setOnline] = useState(true);
  const [readerPaired] = useState(true);

  const [rfidInput, setRfidInput] = useState("");
  const [activeRfid, setActiveRfid] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const [queue, setQueue] = useState<QueuedJob[]>([
    { id: "q1", rfid: "310492838910", type: "Ear Tag Activation Record", queuedAt: "Today · 09:12" },
    { id: "q2", rfid: "310492837192", type: "Artificial Insemination Log", queuedAt: "Today · 10:40" },
  ]);

  const [breedingOpen, setBreedingOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [labReceipt, setLabReceipt] = useState("");
  const [tsuBarcode, setTsuBarcode] = useState("");
  const [genomicError, setGenomicError] = useState<string | null>(null);
  const [genomicSuccess, setGenomicSuccess] = useState(false);

  const [aiStraw, setAiStraw] = useState("");
  const [aiDate, setAiDate] = useState("");
  const [aiBrand, setAiBrand] = useState("");

  const [onbDob, setOnbDob] = useState("");
  const [onbSireBatch, setOnbSireBatch] = useState("");
  const [onbDamClass, setOnbDamClass] = useState("");

  const animal = activeRfid ? KNOWN_ANIMALS[activeRfid] : undefined;
  const lookupAttempted = activeRfid !== null;

  function queueJob(rfid: string, type: QueuedJobType) {
    setQueue((q) => [
      { id: `q${Date.now()}`, rfid, type, queuedAt: "Just now" },
      ...q,
    ]);
  }

  function handleScan() {
    if (!rfidInput.trim()) return;
    setScanning(true);
    setGenomicSuccess(false);
    setGenomicError(null);
    // simulate wand-read latency
    setTimeout(() => {
      setActiveRfid(rfidInput.trim());
      setScanning(false);
    }, 500);
  }

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

  function submitBreedingEvent() {
    if (!animal) return;
    queueJob(animal.rfid, "Artificial Insemination Log");
    setBreedingOpen(false);
    setAiStraw("");
    setAiDate("");
    setAiBrand("");
  }

  function submitOnboarding() {
    if (!activeRfid) return;
    queueJob(activeRfid, "Ear Tag Activation Record");
    setOnboardOpen(false);
    setOnbDob("");
    setOnbSireBatch("");
    setOnbDamClass("");
  }

  const pendingCount = queue.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <button
            aria-label="back"
            onClick={() => navigate({ to: "/" })}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-lg"
          >
            ‹
          </button>
          <h1 className="truncate text-center font-display text-sm font-semibold tracking-wide sm:text-base">
            VET COMPANION
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <SyncBadge online={online} pending={pendingCount} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-4">
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
              onClick={handleScan}
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
                    onClick={() => setBreedingOpen(true)}
                    className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110"
                  >
                    Log Breeding Event
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById("genomic-panel")?.scrollIntoView({ behavior: "smooth", block: "center" })
                    }
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
                  onClick={() => setOnboardOpen(true)}
                  className="mt-4 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-md hover:brightness-110"
                >
                  Onboard New Animal
                </button>
              </>
            )}
          </section>
        )}

        {/* DNA Sampling control panel */}
        <section id="genomic-panel" className="rounded-2xl border border-border bg-card p-4 shadow-sm">
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

        {/* Offline queue */}
        <section className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-base text-accent-foreground/90">
              <span className="text-accent">Offline Queued Jobs</span>
            </h2>
            <span className="text-xs text-muted-foreground">{pendingCount} pending uploads</span>
          </div>
          <ul className="mt-3 space-y-2">
            {queue.map((job) => (
              <li
                key={job.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-sm">
                  {job.type === "Artificial Insemination Log" ? "🧬" : job.type === "Genomic Sample Record" ? "🧫" : "🏷️"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{job.type}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">RFID {job.rfid}</span>
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">{job.queuedAt}</span>
              </li>
            ))}
            {queue.length === 0 && (
              <li className="rounded-xl border border-dashed border-border bg-card px-3 py-4 text-center text-xs text-muted-foreground">
                All caught up — nothing queued.
              </li>
            )}
          </ul>
        </section>
      </main>

      {/* Breeding event sheet */}
      {breedingOpen && animal && (
        <Sheet title="Log Breeding Event" onClose={() => setBreedingOpen(false)}>
          <p className="text-xs text-muted-foreground">
            For <span className="font-mono">{animal.rfid}</span> · {animal.owner}
          </p>
          <TextField label="AI Straw Batch Number" value={aiStraw} onChange={setAiStraw} placeholder="AIB-2291-K" mono />
          <TextField label="Date of Insemination" value={aiDate} onChange={setAiDate} type="date" />
          <TextField label="Semen Brand Identity" value={aiBrand} onChange={setAiBrand} placeholder="e.g. NDDB Elite Murrah" />
          <p className="text-[11px] text-muted-foreground">
            Will auto-sync to India's National Digital Livestock Mission (NDLM / INAPH) once online.
          </p>
          <button
            onClick={submitBreedingEvent}
            disabled={!aiStraw.trim() || !aiDate || !aiBrand.trim()}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 disabled:opacity-40"
          >
            Queue Breeding Event
          </button>
        </Sheet>
      )}

      {/* Onboarding sheet */}
      {onboardOpen && activeRfid && (
        <Sheet title="Animal Onboarding" onClose={() => setOnboardOpen(false)}>
          <p className="text-xs text-muted-foreground">
            RFID ear-tag payload: <span className="font-mono">{activeRfid}</span>
          </p>
          <TextField label="Date of Birth" value={onbDob} onChange={setOnbDob} type="date" />
          <TextField
            label="Sire Semen Batch Code"
            value={onbSireBatch}
            onChange={setOnbSireBatch}
            placeholder="Verified against elite registry"
            mono
          />
          <SelectField
            label="Dam Native Breed Class"
            value={onbDamClass}
            onChange={setOnbDamClass}
            options={["Native Dharwadi", "Indigenous", "F1 Hybrid", "Nili-Ravi", "Murrah"]}
          />
          <button
            onClick={submitOnboarding}
            disabled={!onbDob || !onbSireBatch.trim() || !onbDamClass}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-md hover:brightness-110 disabled:opacity-40"
          >
            Submit to Registry
          </button>
        </Sheet>
      )}
    </div>
  );
}
