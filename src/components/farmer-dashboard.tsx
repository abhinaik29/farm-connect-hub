import { useMemo, useState } from "react";
import type { Account } from "@/lib/auth-store";

type Efficiency = "Efficient" | "Baseline" | "Watch";

interface Animal {
  rfid: string;
  nickname: string;
  breed: string;
  pedigree: { maternal: string; sire: string };
  dob: string;
  gebv: number;
  yieldLpd: number;
  status: Efficiency;
}

const HERD: Animal[] = [
  {
    rfid: "POB-9283",
    nickname: "Gauri",
    breed: "F1 Hybrid",
    pedigree: { maternal: "Native Dharwadi", sire: "Elite Murrah" },
    dob: "2021-03-14",
    gebv: 118,
    yieldLpd: 8.5,
    status: "Efficient",
  },
  {
    rfid: "POB-7192",
    nickname: "Ganga",
    breed: "F1 Hybrid",
    pedigree: { maternal: "Native Dharwadi", sire: "Nili-Ravi" },
    dob: "2020-11-02",
    gebv: 122,
    yieldLpd: 9.1,
    status: "Efficient",
  },
  {
    rfid: "POB-0481",
    nickname: "Kali",
    breed: "Indigenous",
    pedigree: { maternal: "Native Dharwadi", sire: "Native Dharwadi" },
    dob: "2019-08-21",
    gebv: 96,
    yieldLpd: 2.5,
    status: "Baseline",
  },
];

const YIELD_30D = [
  6.2, 6.4, 6.8, 7.1, 7.0, 7.4, 7.8, 8.0, 7.6, 7.9, 8.2, 8.4, 8.1, 8.6, 8.9,
  9.1, 8.8, 9.0, 9.3, 9.0, 8.7, 9.1, 9.4, 9.2, 8.9, 9.1, 9.3, 9.0, 8.8, 9.1,
];

const LANGS = {
  en: {
    header: "PROJECT ONE BUFFALO (KARWAR)",
    wallet: "My Climate Wallet",
    balance: "Total Balance accrued",
    withdraw: "Withdraw to Bank",
    history: "Transaction History",
    herd: "My Decentralized Herd",
    active: "Active Animals",
    perf: "Daily Performance Sheet",
    lastDrop: "Last Milk Drop",
    yield: "Yield",
    fat: "Avg Fat",
    snf: "Avg SNF",
    pay: "Daily Payment",
    carbon: "Carbon Bonus",
    alerts: "Vet & Breeding Alerts",
    alertMsg: "Ganga is entering her optimal artificial insemination window. Breed-code lock active.",
    climate: "Climate Performance",
    methane: "Methane avoided",
    offset: "Carbon offset",
    reqVet: "Request Vet Visit",
    close: "Close",
    scan: "Scan EID Tag",
    logMilk: "Log Milk Drop",
    yield30: "Yield · Last 30 days",
    details: "Cattle Detail",
  },
  hi: {
    header: "प्रोजेक्ट वन बफ़ेलो (कारवार)",
    wallet: "मेरा क्लाइमेट वॉलेट",
    balance: "कुल संचित शेष",
    withdraw: "बैंक में भेजें",
    history: "लेन-देन इतिहास",
    herd: "मेरा झुंड",
    active: "सक्रिय पशु",
    perf: "दैनिक प्रदर्शन",
    lastDrop: "अंतिम दूध",
    yield: "उपज",
    fat: "औसत वसा",
    snf: "औसत SNF",
    pay: "दैनिक भुगतान",
    carbon: "कार्बन बोनस",
    alerts: "पशु-चिकित्सक अलर्ट",
    alertMsg: "गंगा AI विंडो में प्रवेश कर रही है। ब्रीड-कोड लॉक सक्रिय।",
    climate: "क्लाइमेट प्रदर्शन",
    methane: "मीथेन बचाई",
    offset: "कार्बन ऑफ़सेट",
    reqVet: "पशु चिकित्सक बुलाएँ",
    close: "बंद",
    scan: "EID टैग स्कैन",
    logMilk: "दूध दर्ज करें",
    yield30: "उपज · 30 दिन",
    details: "पशु विवरण",
  },
  kn: {
    header: "ಪ್ರಾಜೆಕ್ಟ್ ಒನ್ ಬಫೆಲೊ (ಕಾರವಾರ)",
    wallet: "ನನ್ನ ಕ್ಲೈಮೇಟ್ ವಾಲೆಟ್",
    balance: "ಒಟ್ಟು ಶಿಲ್ಕು",
    withdraw: "ಬ್ಯಾಂಕಿಗೆ ಕಳುಹಿಸಿ",
    history: "ವಹಿವಾಟು ಇತಿಹಾಸ",
    herd: "ನನ್ನ ಹಿಂಡು",
    active: "ಸಕ್ರಿಯ ಪ್ರಾಣಿಗಳು",
    perf: "ದೈನಂದಿನ ಪ್ರದರ್ಶನ",
    lastDrop: "ಕೊನೆಯ ಹಾಲು",
    yield: "ಇಳುವರಿ",
    fat: "ಸರಾಸರಿ ಕೊಬ್ಬು",
    snf: "ಸರಾಸರಿ SNF",
    pay: "ದೈನಂದಿನ ಪಾವತಿ",
    carbon: "ಕಾರ್ಬನ್ ಬೋನಸ್",
    alerts: "ಪಶುವೈದ್ಯ ಎಚ್ಚರಿಕೆಗಳು",
    alertMsg: "ಗಂಗಾ AI ವಿಂಡೋ ಪ್ರವೇಶಿಸುತ್ತಿದೆ. ಬ್ರೀಡ್-ಕೋಡ್ ಲಾಕ್ ಸಕ್ರಿಯ.",
    climate: "ಕ್ಲೈಮೇಟ್ ಪ್ರದರ್ಶನ",
    methane: "ಮೀಥೇನ್ ಉಳಿಸಲಾಗಿದೆ",
    offset: "ಕಾರ್ಬನ್ ಆಫ್‌ಸೆಟ್",
    reqVet: "ಪಶುವೈದ್ಯರನ್ನು ಕರೆಸಿ",
    close: "ಮುಚ್ಚಿ",
    scan: "EID ಸ್ಕ್ಯಾನ್",
    logMilk: "ಹಾಲು ದಾಖಲಿಸಿ",
    yield30: "ಇಳುವರಿ · 30 ದಿನ",
    details: "ಪ್ರಾಣಿ ವಿವರ",
  },
  kok: {
    header: "प्रोजेक्ट वन बफ़ेलो (कारवार)",
    wallet: "म्हजो क्लायमेट वॉलेट",
    balance: "एकूण शिल्लक",
    withdraw: "बँकेक धाड",
    history: "व्यवहार इतिहास",
    herd: "म्हजो कळप",
    active: "सक्रीय जनावरां",
    perf: "दिसाळें प्रदर्शन",
    lastDrop: "निमाणें दूद",
    yield: "उत्पादन",
    fat: "सरासरी फॅट",
    snf: "सरासरी SNF",
    pay: "दिसाळें पेमेंट",
    carbon: "कार्बन बोनस",
    alerts: "पशुवैद्य सूचना",
    alertMsg: "गंगा AI विंडोंत प्रवेश करता. ब्रीड-कोड लॉक सक्रीय.",
    climate: "क्लायमेट प्रदर्शन",
    methane: "मिथेन वाटायलें",
    offset: "कार्बन ऑफसेट",
    reqVet: "पशुवैद्य आपोव",
    close: "बंद",
    scan: "EID स्कॅन",
    logMilk: "दूद नोंद",
    yield30: "उत्पादन · 30 दीस",
    details: "जनावर तपशील",
  },
} as const;

type Lang = keyof typeof LANGS;

function StatusBadge({ s }: { s: Efficiency }) {
  const map: Record<Efficiency, string> = {
    Efficient: "bg-primary/15 text-primary",
    Baseline: "bg-earth/20 text-earth",
    Watch: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${map[s]}`}>
      {s}
    </span>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 320;
  const h = 90;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 10) - 5}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#g)" />
      <polyline points={pts} fill="none" stroke="var(--primary)" strokeWidth="2" />
    </svg>
  );
}

export function FarmerDashboard({
  user,
  onSignOut,
}: {
  user: Account | null;
  onSignOut: () => void;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [openAnimal, setOpenAnimal] = useState<Animal | null>(null);
  const [vetRequested, setVetRequested] = useState<string | null>(null);
  const t = LANGS[lang];

  const totals = useMemo(() => {
    const totalYield = HERD.reduce((s, a) => s + a.yieldLpd, 0);
    return {
      totalYield: totalYield.toFixed(1),
      fat: 7.8,
      snf: 9.1,
      pay: (totalYield * 45).toFixed(2),
      carbon: 88,
      methaneKg: 42.6,
      tco2e: 1.19,
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <button
            aria-label="menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-lg"
          >
            ☰
          </button>
          <h1 className="truncate text-center font-display text-sm font-semibold tracking-wide sm:text-base">
            {t.header}
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
              aria-label="language"
            >
              <option value="en">EN</option>
              <option value="hi">हिं</option>
              <option value="kn">ಕನ್ನ</option>
              <option value="kok">कोंक</option>
            </select>
            <button
              onClick={onSignOut}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border"
              aria-label="profile"
              title={user?.name || user?.phone || "profile"}
            >
              👤
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        {/* Wallet */}
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

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-sm active:scale-[0.98]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-lg">📡</span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{t.scan}</span>
              <span className="block text-[11px] text-muted-foreground">EID / RFID</span>
            </span>
          </button>
          <button className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-sm active:scale-[0.98]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-lg">🥛</span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{t.logMilk}</span>
              <span className="block text-[11px] text-muted-foreground">Touch to record</span>
            </span>
          </button>
        </div>

        {/* Herd */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg">{t.herd}</h2>
            <span className="text-xs text-muted-foreground">
              {HERD.length} {t.active}
            </span>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {HERD.map((a) => (
              <li key={a.rfid}>
                <button
                  onClick={() => setOpenAnimal(a)}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 text-left hover:bg-muted/50"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-earth/15 text-xl">
                    🐄
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold">{a.nickname}</span>
                      <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {a.rfid}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {a.breed} · {t.yield} {a.yieldLpd}L/d
                    </span>
                  </span>
                  <StatusBadge s={a.status} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Daily performance */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg">{t.perf}</h2>
            <span className="text-[11px] text-muted-foreground">
              {t.lastDrop}: 16-Jul, 08:30 AM
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { l: t.yield, v: `${totals.totalYield} L` },
              { l: t.fat, v: `${totals.fat}%` },
              { l: t.snf, v: `${totals.snf}%` },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-muted p-2.5">
                <p className="text-[10px] text-muted-foreground">{s.l}</p>
                <p className="mt-0.5 font-display text-base">{s.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">{t.pay}</p>
              <p className="mt-0.5 font-display text-lg text-primary">₹ {totals.pay}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-[11px] text-muted-foreground">{t.carbon}</p>
              <p className="mt-0.5 font-display text-lg text-accent">₹ {totals.carbon}.00</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {t.yield30}
            </p>
            <Sparkline data={YIELD_30D} />
          </div>
        </section>

        {/* Alerts */}
        <section className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
              ⚠
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-base text-accent-foreground/90">
                <span className="text-accent">{t.alerts}</span>
              </h2>
              <p className="mt-1 text-sm text-foreground">{t.alertMsg}</p>
            </div>
          </div>
        </section>

        {/* Climate widget */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-display text-lg">{t.climate}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-primary/10 p-3">
              <p className="text-[11px] text-muted-foreground">{t.methane}</p>
              <p className="mt-0.5 font-display text-xl text-primary">
                {totals.methaneKg} <span className="text-xs">kg CH₄</span>
              </p>
            </div>
            <div className="rounded-xl bg-earth/15 p-3">
              <p className="text-[11px] text-muted-foreground">{t.offset}</p>
              <p className="mt-0.5 font-display text-xl text-earth">
                {totals.tco2e} <span className="text-xs">tCO₂e</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Cattle detail modal */}
      {openAnimal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4"
          onClick={() => setOpenAnimal(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border sm:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.details}
                </p>
                <p className="mt-0.5 truncate font-display text-2xl">{openAnimal.nickname}</p>
                <p className="font-mono text-xs text-muted-foreground">{openAnimal.rfid}</p>
              </div>
              <StatusBadge s={openAnimal.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] text-muted-foreground">Breed</dt>
                <dd className="font-medium">{openAnimal.breed}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">DOB</dt>
                <dd className="font-medium">{openAnimal.dob}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] text-muted-foreground">Pedigree</dt>
                <dd className="font-medium">
                  Maternal: {openAnimal.pedigree.maternal} · Sire: {openAnimal.pedigree.sire}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">GEBV Index</dt>
                <dd className="font-display text-lg text-primary">{openAnimal.gebv}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">Yield</dt>
                <dd className="font-display text-lg">{openAnimal.yieldLpd} L/d</dd>
              </div>
            </dl>

            {vetRequested === openAnimal.rfid ? (
              <p className="mt-5 rounded-xl bg-primary/10 p-3 text-center text-sm text-primary">
                ✓ Vet notified for {openAnimal.nickname}
              </p>
            ) : (
              <button
                onClick={() => setVetRequested(openAnimal.rfid)}
                className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110"
              >
                {t.reqVet}
              </button>
            )}
            <button
              onClick={() => setOpenAnimal(null)}
              className="mt-2 w-full rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
