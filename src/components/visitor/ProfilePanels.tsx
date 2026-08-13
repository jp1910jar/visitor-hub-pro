import { motion } from "motion/react";
import { CalendarClock, Building2, Mail, Phone, BriefcaseBusiness } from "lucide-react";
import { initialsOf, type VisitorProfile } from "@/lib/visitor-data";
import { StatusPill } from "./StatusPill";

export function VisitorProfileCard({ profile }: { profile: VisitorProfile }) {
  const stats = [
    { label: "Total Visits", value: String(profile.totalVisits) },
    { label: "Last Visit", value: profile.lastVisit },
    { label: "Current Status", value: "Not Checked In" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium overflow-hidden"
    >
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-lg font-semibold text-primary-foreground">
          {initialsOf(profile.personal.fullName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Welcome back, {profile.personal.fullName.split(" ")[0]}
          </p>
          <h2 className="mt-1 truncate text-2xl font-semibold">{profile.personal.fullName}</h2>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            {profile.personal.designation} · {profile.personal.company}
          </p>
        </div>
        <span className="shrink-0 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-[12.5px] font-semibold tabular-nums">
          {profile.visitorId}
        </span>
      </div>

      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        <Detail icon={<Phone className="size-4" />} label="Mobile" value={`+91 ${profile.personal.mobile}`} />
        <Detail icon={<Mail className="size-4" />} label="Email" value={profile.personal.email} />
        <Detail
          icon={<Building2 className="size-4" />}
          label="Company"
          value={profile.personal.company}
        />
        <Detail
          icon={<BriefcaseBusiness className="size-4" />}
          label="Designation"
          value={profile.personal.designation}
        />
      </div>

      <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
        {stats.map((s) => (
          <div key={s.label} className="bg-card px-4 py-5 text-center sm:px-6">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 text-[15px] font-semibold sm:text-lg">{s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-card px-6 py-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </span>
        <span className="block truncate text-[14px] font-medium">{value}</span>
      </span>
    </div>
  );
}

export function VisitHistory({ profile }: { profile: VisitorProfile }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold">Previous Visits</h3>
      <ol className="mt-4 space-y-3">
        {profile.history.map((visit, i) => (
          <motion.li
            key={visit.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i }}
            className="relative rounded-2xl border border-border bg-card p-5 pl-6"
          >
            <span className="absolute left-0 top-6 h-8 w-1 rounded-r-full bg-brand-gradient" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
                <CalendarClock className="size-4" aria-hidden />
                {visit.date}
                {i === 0 ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                    Recent
                  </span>
                ) : null}
              </p>
              <StatusPill status={visit.status} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Cell label="Meeting with" value={visit.hostName} />
              <Cell label="Department" value={visit.department} />
              <Cell label="Purpose" value={visit.purpose} />
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[14px] font-medium">{value}</p>
    </div>
  );
}
