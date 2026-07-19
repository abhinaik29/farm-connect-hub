import { StatusBadge } from "./components/StatusBadge";
import type { Animal, T } from "./types";

export function CattleModal({
  animal,
  t,
  vetRequested,
  onRequestVet,
  onClose,
}: {
  animal: Animal;
  t: T;
  vetRequested: string | null;
  onRequestVet: () => void;
  onClose: () => void;
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{t.details}</p>
            <p className="mt-0.5 truncate font-display text-2xl">{animal.nickname}</p>
            <p className="font-mono text-xs text-muted-foreground">{animal.rfid}</p>
          </div>
          <StatusBadge s={animal.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[11px] text-muted-foreground">Breed</dt>
            <dd className="font-medium">{animal.breed}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted-foreground">DOB</dt>
            <dd className="font-medium">{animal.dob}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] text-muted-foreground">Pedigree</dt>
            <dd className="font-medium">
              Maternal: {animal.pedigree.maternal} · Sire: {animal.pedigree.sire}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted-foreground">GEBV Index</dt>
            <dd className="font-display text-lg text-primary">{animal.gebv}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted-foreground">Yield</dt>
            <dd className="font-display text-lg">{animal.yieldLpd} L/d</dd>
          </div>
        </dl>

        {vetRequested === animal.rfid ? (
          <p className="mt-5 rounded-xl bg-primary/10 p-3 text-center text-sm text-primary">
            ✓ Vet notified for {animal.nickname}
          </p>
        ) : (
          <button
            onClick={onRequestVet}
            className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110"
          >
            {t.reqVet}
          </button>
        )}
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
