import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login, loginOtp, roleToPath } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Project One Buffalo" },
      { name: "description", content: "Log in with your phone number. One login for farmers, field vets and coop admins." },
    ],
  }),
  component: Login,
});

type Mode = "password" | "otp";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("password");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phone.trim().length < 8) {
      setError("Enter a valid phone number.");
      return;
    }
    if (mode === "password") {
      const r = login(phone.trim(), password);
      if (!r.ok || !r.role) return setError(r.error ?? "Login failed.");
      navigate({ to: roleToPath[r.role] });
    } else {
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      if (otp.length < 4) return setError("Enter the 6-digit code we sent.");
      const r = loginOtp(phone.trim());
      if (!r.ok || !r.role) return setError(r.error ?? "Login failed.");
      navigate({ to: roleToPath[r.role] });
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/" className="font-display text-lg">
          <span className="mr-2 inline-grid h-8 w-8 place-items-center rounded-full bg-primary align-middle text-primary-foreground">B</span>
          Project One Buffalo
        </Link>

        <div className="mt-10">
          <h1 className="font-display text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One login for farmers, field vets and coop admins.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1 text-sm">
            {(["password", "otp"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setOtpSent(false); }}
                className={`rounded-full px-4 py-1.5 transition ${
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "password" ? "Password" : "OTP"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Phone number</span>
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
            </label>

            {mode === "password" ? (
              <label className="block">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium">Password</span>
                  <a className="text-xs text-muted-foreground hover:text-foreground">Forgot?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-xl border border-border bg-card px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            ) : otpSent ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Enter code</span>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  inputMode="numeric"
                  placeholder="6-digit code"
                  className="w-full rounded-xl border border-border bg-card px-3 py-3 text-center text-lg tracking-[0.4em] outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="mt-2 block text-xs text-muted-foreground">
                  Demo mode — any 4–6 digit code works.
                </span>
              </label>
            ) : (
              <p className="rounded-lg bg-muted px-3 py-3 text-sm text-muted-foreground">
                We'll send a one-time code to your phone.
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-base font-medium text-primary-foreground shadow-md transition hover:brightness-110"
            >
              {mode === "otp" && !otpSent ? "Send code" : "Log in"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
