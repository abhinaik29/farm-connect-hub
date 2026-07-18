import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signUp, roleToPath, type Role } from "@/lib/auth-store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Project One Buffalo" },
      { name: "description", content: "Sign up as a farmer to start tracking your livestock. Field vets and coop admins join by invitation." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!role) return;
    if (role !== "farmer" && invite.trim().length < 4) {
      setError("An invitation code from your coop is required.");
      return;
    }
    if (phone.trim().length < 8) {
      setError("Enter a valid phone number.");
      return;
    }
    if (password.length < 4) {
      setError("Choose a password of at least 4 characters.");
      return;
    }
    const res = signUp({ phone: phone.trim(), password, role, name: name.trim() });
    if (!res.ok) {
      setError(res.error ?? "Could not create account.");
      return;
    }
    navigate({ to: roleToPath[role] });
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/" className="font-display text-lg">
          <span className="mr-2 inline-grid h-8 w-8 place-items-center rounded-full bg-primary align-middle text-primary-foreground">B</span>
          Project One Buffalo
        </Link>

        {!role ? (
          <div className="mt-10">
            <h1 className="font-display text-3xl">Who are you signing up as?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Farmers can start right away. Field vets and coop admins need an invite.
            </p>

            <div className="mt-8 grid gap-3">
              <RoleCard
                title="Farmer"
                desc="I raise buffalo and want to track their health and yield."
                emoji="🐃"
                highlight
                onClick={() => setRole("farmer")}
              />
              <RoleCard
                title="Field Vet"
                desc="I visit farms and log treatments. Invitation required."
                emoji="🩺"
                onClick={() => setRole("vet")}
              />
              <RoleCard
                title="Coop Admin"
                desc="I manage a dairy cooperative. Invitation required."
                emoji="🏬"
                onClick={() => setRole("coop")}
              />
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <button
              type="button"
              onClick={() => setRole(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Change role
            </button>
            <h1 className="font-display text-3xl">
              {role === "farmer" ? "Create your farmer account" : role === "vet" ? "Field Vet sign up" : "Coop Admin sign up"}
            </h1>

            <Field label="Your name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ravi Patel"
                className="input"
              />
            </Field>

            <Field label="Phone number">
              <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-ring">
                <span className="grid place-items-center bg-muted px-3 text-sm text-muted-foreground">+91</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  placeholder="98765 43210"
                  className="w-full bg-transparent px-3 py-3 text-base outline-none"
                />
              </div>
            </Field>

            <Field label="Create password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                className="input"
              />
            </Field>

            {role !== "farmer" && (
              <Field label="Invitation code">
                <input
                  value={invite}
                  onChange={(e) => setInvite(e.target.value)}
                  placeholder="Paste the code from your coop"
                  className="input"
                />
              </Field>
            )}

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-base font-medium text-primary-foreground shadow-md transition hover:brightness-110"
            >
              Create account
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--color-border); background: var(--color-card); padding: 0.85rem 0.9rem; font-size: 1rem; outline: none; }
        .input:focus { box-shadow: 0 0 0 2px var(--color-ring); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function RoleCard({
  title, desc, emoji, highlight, onClick,
}: { title: string; desc: string; emoji: string; highlight?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted text-2xl">{emoji}</span>
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-lg">{title}</span>
          {highlight && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">Recommended</span>}
          {!highlight && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Invited</span>}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{desc}</span>
      </span>
      <span className="mt-2 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground">→</span>
    </button>
  );
}
