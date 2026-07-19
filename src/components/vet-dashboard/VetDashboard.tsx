import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Account } from "@/lib/auth-store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ScanLine, Dna, ListTodo } from "lucide-react";

import { VetSidebar } from "./VetSidebar";
import { SyncBadge } from "./components/SyncBadge";
import { TextField } from "./components/TextField";
import { SelectField } from "./components/SelectField";
import { Sheet } from "./components/Sheet";
import { ScanPage } from "./pages/ScanPage";
import { DnaSamplingPage } from "./pages/DnaSamplingPage";
import { QueuePage } from "./pages/QueuePage";
import { KNOWN_ANIMALS } from "./data";
import type { NavItem, PageId, QueuedJob, QueuedJobType } from "./types";

const NAV: NavItem[] = [
  { id: "scan", label: "Scan & Record", icon: ScanLine },
  { id: "dna", label: "DNA Sampling", icon: Dna },
  { id: "queue", label: "Offline Queue", icon: ListTodo },
];

const PAGE_TITLES: Record<PageId, string> = {
  scan: "Scan & Animal Record",
  dna: "DNA Sampling Control Panel",
  queue: "Offline Queued Jobs",
};

export function VetDashboard({
  user,
  onSignOut,
}: {
  user: Account | null;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageId>("scan");

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

  const [aiStraw, setAiStraw] = useState("");
  const [aiDate, setAiDate] = useState("");
  const [aiBrand, setAiBrand] = useState("");

  const [onbDob, setOnbDob] = useState("");
  const [onbSireBatch, setOnbSireBatch] = useState("");
  const [onbDamClass, setOnbDamClass] = useState("");

  const animal = activeRfid ? KNOWN_ANIMALS[activeRfid] : undefined;
  const lookupAttempted = activeRfid !== null;
  const pendingCount = queue.length;

  function queueJob(rfid: string, type: QueuedJobType) {
    setQueue((q) => [
      { id: `q${Date.now()}`, rfid, type, queuedAt: "Just now" },
      ...q,
    ]);
  }

  function handleScan() {
    if (!rfidInput.trim()) return;
    setScanning(true);
    // simulate wand-read latency
    setTimeout(() => {
      setActiveRfid(rfidInput.trim());
      setScanning(false);
    }, 500);
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <VetSidebar nav={NAV} page={page} setPage={setPage} pendingCount={pendingCount} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card/95 px-3 py-3 backdrop-blur">
            <SidebarTrigger />
            <button
              aria-label="back"
              onClick={() => navigate({ to: "/" })}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border text-lg"
            >
              ‹
            </button>
            <h1 className="min-w-0 flex-1 truncate font-display text-sm font-semibold tracking-wide sm:text-base">
              {PAGE_TITLES[page]}
            </h1>
            <SyncBadge online={online} pending={pendingCount} />
            <button
              onClick={onSignOut}
              className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
            >
              Sign out
            </button>
          </header>

          <main className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-4 pb-24">
            {page === "scan" && (
              <ScanPage
                online={online}
                setOnline={setOnline}
                readerPaired={readerPaired}
                rfidInput={rfidInput}
                setRfidInput={setRfidInput}
                scanning={scanning}
                onScan={handleScan}
                activeRfid={activeRfid}
                animal={animal}
                lookupAttempted={lookupAttempted}
                onLogBreeding={() => setBreedingOpen(true)}
                onGoToDna={() => setPage("dna")}
                onOnboard={() => setOnboardOpen(true)}
              />
            )}
            {page === "dna" && <DnaSamplingPage animal={animal} queueJob={queueJob} />}
            {page === "queue" && <QueuePage queue={queue} />}
          </main>
        </div>

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
    </SidebarProvider>
  );
}
