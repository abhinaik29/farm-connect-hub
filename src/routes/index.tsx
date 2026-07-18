import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project One Buffalo — Livestock care for every farmer" },
      { name: "description", content: "A shared record for farmers, field vets and coops. Track your buffalo's health, vaccinations and milk in one place." },
      { property: "og:title", content: "Project One Buffalo" },
      { property: "og:description", content: "Livestock care, coordinated between farmers, vets and coops." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">B</div>
          <span className="font-display text-xl font-semibold">Project One Buffalo</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            Create account
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-10 md:grid-cols-2 md:pt-20">
        <section className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-earth">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Built with farmers, for farmers
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-foreground md:text-6xl">
            One record for<br />every buffalo.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Log health checks, vaccinations and milk yield from your phone. Share it instantly with your field vet and coop — no paperwork, no lost history.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-md transition hover:brightness-110"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-border bg-card px-6 py-3 text-base font-medium text-foreground transition hover:bg-muted"
            >
              I already have one
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Field vets and coop admins join by invitation.
          </p>
        </section>

        <section className="relative">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Today</p>
                <p className="font-display text-2xl">Ganga · Buffalo #A-14</p>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Healthy</div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { l: "Milk / day", v: "8.4 L" },
                { l: "Last vaccine", v: "12 Feb" },
                { l: "Next check", v: "3 days" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-muted p-3">
                  <p className="text-[11px] text-muted-foreground">{s.l}</p>
                  <p className="mt-1 font-display text-lg">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {[
                { t: "Vaccination — FMD booster", by: "Dr. Meera · Field vet" },
                { t: "Milk yield logged", by: "You · this morning" },
                { t: "Coop pickup confirmed", by: "Anand Dairy Coop" },
              ].map((r) => (
                <div key={r.t} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium">{r.t}</p>
                    <p className="text-xs text-muted-foreground">{r.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
