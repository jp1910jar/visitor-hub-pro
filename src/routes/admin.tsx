import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, RefreshCw, LogOut, Users, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { visitService } from "@/lib/services";
import logo from "@/assets/avertechlogo.png";
import { COMPANY } from "@/lib/visitor-data";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function BrandBlock() {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt={`${COMPANY.name} logo`} className="h-11 w-auto object-contain" />
      <div className="leading-none">
        <div className="text-[16px] font-semibold tracking-tight">{COMPANY.name}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Visitor Portal
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background surface-canvas">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLoginForm />;
}

function AdminLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background surface-canvas px-4">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit}
        className="card-premium w-full max-w-sm space-y-5 p-8"
      >
        <div className="flex justify-center">
          <BrandBlock />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Admin Login</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Sign in to manage visitors</p>
        </div>
        {error ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-[13px] text-destructive">
            {error}
          </p>
        ) : null}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-[13px] font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </motion.form>
    </div>
  );
}

type Visit = {
  _id: string;
  visitId: string;
  fullName: string;
  mobile: string;
  email?: string;
  company?: string;
  designation?: string;
  profilePhoto?: string;
  hostName: string;
  department?: string;
  purpose?: string;
  visitType?: string;
  duration?: string;
  reference?: string;
  status: string;
  checkInTime: string;
};

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function statusTone(status: string) {
  switch (status) {
    case "completed":
      return "bg-success/12 text-success";
    case "meeting_in_progress":
      return "bg-warning/15 text-warning";
    case "cancelled":
      return "bg-destructive/12 text-destructive";
    default:
      return "bg-accent text-accent-foreground";
  }
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Visit | null>(null);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await visitService.list({ search: search || undefined });
      setVisits(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load visits");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchVisits, 300);
    return () => clearTimeout(t);
  }, [fetchVisits]);

  return (
    <div className="min-h-screen bg-background surface-canvas">
      <header className="sticky top-0 z-30 border-b border-border/70 glass-panel">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-5 sm:px-8">
          <BrandBlock />
          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-muted-foreground sm:inline">
              {admin?.name ?? "Admin"}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <LogOut className="size-4" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Visitor Management
              </p>
              <h1 className="mt-1.5 text-[28px] font-semibold tracking-tight text-foreground">
                Visitor Log
              </h1>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Click a visitor to see full details
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  type="text"
                  placeholder="Search visitors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-[13.5px] outline-none transition-colors focus:border-primary sm:w-72"
                />
              </div>
              <button
                onClick={fetchVisits}
                className="inline-flex size-[42px] items-center justify-center rounded-xl border border-input bg-card text-foreground transition-colors hover:bg-secondary"
                aria-label="Refresh"
              >
                <RefreshCw className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="card-premium mt-6 overflow-hidden">
            {loading ? (
              <div className="space-y-3 p-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-secondary/60" />
                ))}
              </div>
            ) : error ? (
              <p className="p-8 text-center text-[13.5px] text-destructive">{error}</p>
            ) : visits.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-14 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
                  <Users className="size-5" aria-hidden />
                </span>
                <p className="text-[14.5px] font-medium text-foreground">No visitors found</p>
                <p className="text-[13px] text-muted-foreground">
                  Visitor registrations will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full table-fixed text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-2.5 py-3 font-medium">Visitor</th>
                    <th className="px-2.5 py-3 font-medium">Mobile</th>
                    <th className="px-2.5 py-3 font-medium">Email</th>
                    <th className="px-2.5 py-3 font-medium">Company</th>
                    <th className="px-2.5 py-3 font-medium">Designation</th>
                    <th className="px-2.5 py-3 font-medium">Visit Type</th>
                    <th className="px-2.5 py-3 font-medium">Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v, i) => (
                    <motion.tr
                      key={v._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                      onClick={() => setSelected(v)}
                      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-secondary/40"
                    >
                      <td className="px-2.5 py-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(v);
                            }}
                            className="shrink-0 transition-transform hover:scale-105"
                          >
                            {v.profilePhoto ? (
                              <img
                                src={v.profilePhoto}
                                alt={v.fullName}
                                className="size-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="grid size-8 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
                                {initialsOf(v.fullName)}
                              </span>
                            )}
                          </button>
                          <span className="truncate font-medium text-foreground">
                            {v.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="truncate px-2.5 py-2.5">{v.mobile}</td>
                      <td className="truncate px-2.5 py-2.5">{v.email || "—"}</td>
                      <td className="truncate px-2.5 py-2.5">{v.company || "—"}</td>
                      <td className="truncate px-2.5 py-2.5">{v.designation || "—"}</td>
                      <td className="truncate px-2.5 py-2.5">{v.visitType || "—"}</td>
                      <td className="truncate px-2.5 py-2.5 text-muted-foreground">
                        {new Date(v.checkInTime).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card shadow-[var(--shadow-lift)]"
            >
              <div className="relative bg-brand-gradient px-6 pb-8 pt-6 text-center">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
                <p className="font-mono text-[12px] tracking-wide text-primary-foreground/80">
                  {selected.visitId}
                </p>

                {selected.profilePhoto ? (
                  <img
                    src={selected.profilePhoto}
                    alt={selected.fullName}
                    className="mx-auto mt-4 size-28 rounded-full border-4 border-white/30 object-cover shadow-lg"
                  />
                ) : (
                  <div className="mx-auto mt-4 grid size-28 place-items-center rounded-full border-4 border-white/30 bg-white/15 text-3xl font-semibold text-primary-foreground shadow-lg">
                    {initialsOf(selected.fullName)}
                  </div>
                )}

                <h2 className="mt-4 text-xl font-semibold text-primary-foreground">
                  {selected.fullName}
                </h2>
                <p className="mt-0.5 text-[13px] text-primary-foreground/85">
                  {selected.designation || "—"}
                  {selected.company ? ` · ${selected.company}` : ""}
                </p>

                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${statusTone(
                    selected.status
                  )}`}
                >
                  {statusLabel(selected.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 py-6 text-[13px]">
                <Detail label="Mobile" value={selected.mobile} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Meeting With" value={selected.hostName} />
                <Detail label="Department" value={selected.department} />
                <Detail label="Visit Type" value={selected.visitType} />
                <Detail label="Duration" value={selected.duration} />
                <Detail label="Reference" value={selected.reference} />
                <Detail
                  label="Check-in"
                  value={new Date(selected.checkInTime).toLocaleString()}
                />
                <div className="col-span-2">
                  <Detail label="Purpose" value={selected.purpose} />
                </div>
              </div>

              <div className="border-t border-border px-6 py-4">
                <button
                  onClick={() => setSelected(null)}
                  className="w-full rounded-xl border border-input px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}