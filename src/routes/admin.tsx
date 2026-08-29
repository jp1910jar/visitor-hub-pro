import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { visitService } from "@/lib/services";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
      >
        <h1 className="text-xl font-semibold text-foreground">Admin Login</h1>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
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
  checkOutTime?: string | null;
};

function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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
    fetchVisits();
  }, [fetchVisits]);

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Visitor Log</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Logged in as {admin?.name ?? "Admin"}
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Log out
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, mobile, host, or visit ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={fetchVisits}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading visits...</p>
          ) : error ? (
            <p className="p-6 text-sm text-destructive">{error}</p>
          ) : visits.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No visits recorded yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Photo</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Visit ID</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Visitor</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Mobile</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Email</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Company</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Designation</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Host</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Department</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Visit Type</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Purpose</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Duration</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Reference</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Check-in</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v._id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap px-4 py-3">
                      {v.profilePhoto ? (
                        <img
                          src={v.profilePhoto}
                          alt={v.fullName}
                          className="size-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid size-9 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">
                          {v.fullName
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((p) => p[0]?.toUpperCase() ?? "")
                            .join("")}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px]">{v.visitId}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{v.fullName}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.mobile}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.email || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.company || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.designation || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.hostName}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.department || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.visitType || "—"}</td>
                    <td className="max-w-[220px] truncate px-4 py-3" title={v.purpose}>
                      {v.purpose || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{v.duration || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{v.reference || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 capitalize">
                      {v.status.replace(/_/g, " ")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Date(v.checkInTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}