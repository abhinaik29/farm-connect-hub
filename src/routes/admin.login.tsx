import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "@/lib/auth-store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Project One Buffalo" },
      { name: "description", content: "Restricted access for Project One Buffalo administrators." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = loginAdmin(email.trim(), password);
    if (!r.ok) return setError(r.error ?? "Login failed.");
    navigate({ to: "/dashboard/$role", params: { role: "admin" } });
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/" className="font-display text-lg">
          <span className="mr-2 inline-grid h-8 w-8 place-items-center rounded-full bg-foreground align-middle text-background">A</span>
          Admin console
        </Link>

        <div className="mt-10">
          <h1 className="font-display text-3xl">Restricted access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your administrator credentials.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@onebuffalo.app"
                className="w-full rounded-xl border border-border bg-card px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full rounded-xl border border-border bg-card px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-foreground py-3.5 text-base font-medium text-background shadow-md transition hover:brightness-110"
            >
              Sign in
            </button>

            <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Demo credentials — <b>admin@onebuffalo.app</b> / <b>admin123</b>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
