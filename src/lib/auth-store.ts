// Frontend-only mock auth store (localStorage). Replace with real backend later.
export type Role = "farmer" | "vet" | "coop" | "superadmin";

export interface Account {
  // For superadmin this holds the email; for others, the phone number.
  phone: string;
  password: string;
  role: Role;
  name?: string;
  email?: string;
}

const USERS_KEY = "pob_users";
const SESSION_KEY = "pob_session";

// Default superadmin credentials (demo only — replace with real backend auth).
const DEFAULT_ADMIN: Account = {
  phone: "admin@onebuffalo.app",
  email: "admin@onebuffalo.app",
  password: "admin123",
  role: "superadmin",
  name: "Super Admin",
};

function readUsers(): Account[] {
  if (typeof window === "undefined") return [];
  try {
    const users: Account[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!users.find((u) => u.role === "superadmin")) {
      users.push(DEFAULT_ADMIN);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch {
    return [DEFAULT_ADMIN];
  }
}
function writeUsers(u: Account[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function signUp(a: Account): { ok: boolean; error?: string } {
  const users = readUsers();
  if (users.find((u) => u.phone === a.phone)) {
    return { ok: false, error: "An account with this phone already exists." };
  }
  users.push(a);
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, a.phone);
  return { ok: true };
}

export function login(phone: string, password: string): { ok: boolean; role?: Role; error?: string } {
  const user = readUsers().find((u) => u.phone === phone);
  if (!user) return { ok: false, error: "No account found for this phone." };
  if (user.password !== password) return { ok: false, error: "Incorrect password." };
  localStorage.setItem(SESSION_KEY, phone);
  return { ok: true, role: user.role };
}

export function loginOtp(phone: string): { ok: boolean; role?: Role; error?: string } {
  const user = readUsers().find((u) => u.phone === phone);
  if (!user) return { ok: false, error: "No account found for this phone." };
  localStorage.setItem(SESSION_KEY, phone);
  return { ok: true, role: user.role };
}

export function loginAdmin(email: string, password: string): { ok: boolean; error?: string } {
  const user = readUsers().find(
    (u) => u.role === "superadmin" && (u.email === email || u.phone === email),
  );
  if (!user) return { ok: false, error: "No admin account found for this email." };
  if (user.password !== password) return { ok: false, error: "Incorrect password." };
  localStorage.setItem(SESSION_KEY, user.phone);
  return { ok: true };
}

export function currentUser(): Account | null {
  if (typeof window === "undefined") return null;
  const phone = localStorage.getItem(SESSION_KEY);
  if (!phone) return null;
  return readUsers().find((u) => u.phone === phone) ?? null;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export const roleToPath: Record<Role, string> = {
  farmer: "/dashboard/farmer",
  vet: "/dashboard/vet",
  coop: "/dashboard/coop",
  superadmin: "/dashboard/admin",
};
