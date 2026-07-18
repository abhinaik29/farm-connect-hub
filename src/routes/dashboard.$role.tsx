import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { currentUser, signOut, type Account } from "@/lib/auth-store";
import { FarmerDashboard } from "@/components/farmer-dashboard";
import { VetDashboard } from "@/components/vet-dashboard";
import { CoopDashboard } from "@/components/coop-dashboard";
import { AdminDashboard } from "@/components/admin-dashboard";

export const Route = createFileRoute("/dashboard/$role")({
  component: Dashboard,
});

const labels: Record<string, { title: string; blurb: string }> = {
  vet: { title: "Field Vet dashboard", blurb: "Assigned farms and today's visit list." },
  coop: { title: "Coop Admin dashboard", blurb: "Members, pickups and invitations." },
  admin: { title: "Super Admin console", blurb: "Manage coops, users, invitations and platform settings." },
};

function Dashboard() {
  const { role } = useParams({ from: "/dashboard/$role" });
  const navigate = useNavigate();
  const [user, setUser] = useState<Account | null>(null);

  useEffect(() => {
    const u = currentUser();
    if (!u) navigate({ to: "/login" });
    else setUser(u);
  }, [navigate]);

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/" });
  };

  if (role === "farmer") {
    return <FarmerDashboard user={user} onSignOut={handleSignOut} />;
  }

  if (role === "vet") {
    return <VetDashboard user={user} onSignOut={handleSignOut} />;
  }

  if (role === "coop") {
    return <CoopDashboard user={user} onSignOut={handleSignOut} />;
  }

  if (role === "admin") {
    return <AdminDashboard user={user} onSignOut={handleSignOut} />;
  }

  const meta = labels[role] ?? { title: "Dashboard", blurb: "" };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg">
            <span className="mr-2 inline-grid h-8 w-8 place-items-center rounded-full bg-primary align-middle text-primary-foreground">B</span>
            Project One Buffalo
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-muted-foreground">Signed in as {user?.name || user?.phone || "…"}</p>
        <h1 className="mt-2 font-display text-4xl">{meta.title}</h1>
        <p className="mt-2 text-muted-foreground">{meta.blurb}</p>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-display text-xl">You're in 🎉</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This is your role-specific home. Content will go here.
          </p>
        </div>
      </main>
    </div>
  );
}

