import { TRANSACTIONS } from "../data";
import type { T } from "../types";

export function WalletPage({ t }: { t: T }) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-lg">
        <p className="text-xs uppercase tracking-wider opacity-80">{t.wallet}</p>
        <p className="mt-1 text-xs opacity-80">{t.balance}</p>
        <p className="mt-1 font-display text-4xl font-semibold">₹ 4,850.00</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-primary-foreground/15 px-3 py-2.5 text-sm font-medium ring-1 ring-primary-foreground/20 hover:bg-primary-foreground/25">
            {t.withdraw}
          </button>
          <button className="rounded-xl bg-primary-foreground/15 px-3 py-2.5 text-sm font-medium ring-1 ring-primary-foreground/20 hover:bg-primary-foreground/25">
            {t.history}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="font-display text-lg">{t.history}</h2>
        <ul className="mt-3 divide-y divide-border">
          {TRANSACTIONS.map((tx, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{tx.label}</p>
                <p className="text-[11px] text-muted-foreground">{tx.d}</p>
              </div>
              <p className={`font-display text-base ${tx.amt < 0 ? "text-destructive" : "text-primary"}`}>
                {tx.amt < 0 ? "−" : "+"}₹ {Math.abs(tx.amt).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
