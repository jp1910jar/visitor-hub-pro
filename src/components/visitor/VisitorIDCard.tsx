import { COMPANY, initialsOf } from "@/lib/visitor-data";
import type { VisitRecord } from "./NewVisitorFlow";

export function VisitorIDCard({ record }: { record: VisitRecord }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="bg-brand-gradient px-5 py-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/90">
          {COMPANY.name} Visitor Pass
        </p>
      </div>

      <div className="flex flex-col items-center px-6 py-6">
        {record.photoDataUrl ? (
          <img
            src={record.photoDataUrl}
            alt={record.personal.fullName}
            className="size-20 rounded-full object-cover"
          />
        ) : (
          <div className="grid size-20 place-items-center rounded-full bg-secondary text-2xl font-semibold text-foreground">
            {initialsOf(record.personal.fullName)}
          </div>
        )}
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          {record.personal.fullName}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          {record.personal.designation || record.personal.company}
        </p>
        <span className="mt-3 rounded-full bg-secondary px-3 py-1 font-mono text-[12px] font-medium tracking-wide text-foreground">
          {record.visitId}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border px-6 py-5 text-[13px]">
        <Detail label="Mobile" value={record.personal.mobile} />
        <Detail label="Email" value={record.personal.email} />
        <Detail label="Company" value={record.personal.company} />
        <Detail label="Meeting With" value={record.host.name} />
        <Detail label="Department" value={record.host.department} />
        <Detail label="Visit Type" value={record.visit.visitType} />
        <Detail label="Purpose" value={record.visit.purpose} />
        <Detail label="Duration" value={record.visit.duration} />
        <Detail label="Check-in" value={record.time} />
        <Detail label="Date" value={record.date} />
      </div>

      <div className="border-t border-dashed border-border px-6 py-3 text-center text-[11px] text-muted-foreground">
        Valid for today's visit only &middot; Please return at checkout
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}