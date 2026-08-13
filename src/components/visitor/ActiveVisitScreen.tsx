import { motion } from "motion/react";
import { Check, MapPin, Clock3, LogOut } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { ActionButton } from "./ActionButton";
import { VisitorQRCode } from "./VisitSummary";
import { COMPANY, LIVE_STATUS_FLOW, STATUS_META, type VisitStatus } from "@/lib/visitor-data";
import type { VisitRecord } from "./NewVisitorFlow";

export function ActiveVisitScreen({
  record,
  status,
  onAdvance,
  onExit,
}: {
  record: VisitRecord;
  status: VisitStatus;
  onAdvance: () => void;
  onExit: () => void;
}) {
  const currentIndex = LIVE_STATUS_FLOW.indexOf(status);
  const isFinal = status === "completed";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Active visit · {record.visitId}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {isFinal ? "Your visit is complete" : "You're checked in"}
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {isFinal
              ? "Thanks for visiting. Please return your visitor badge at reception."
              : "Reception has been notified. Please take a seat — your host will be with you shortly."}
          </p>
        </div>
        <StatusPill status={status} pulse={!isFinal} />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="card-premium p-6 sm:p-7">
          <h3 className="text-[15px] font-semibold">Visit timeline</h3>
          <ol className="mt-5 space-y-1">
            {LIVE_STATUS_FLOW.map((s, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <li key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.span
                      animate={active ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                      transition={{ duration: 1.6, repeat: active ? Infinity : 0 }}
                      className={`grid size-7 place-items-center rounded-full border text-[11px] font-semibold ${
                        done
                          ? "border-transparent bg-success text-success-foreground"
                          : active
                            ? "border-transparent bg-brand-gradient text-primary-foreground"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
                    </motion.span>
                    {i < LIVE_STATUS_FLOW.length - 1 ? (
                      <span
                        className={`my-1 w-px flex-1 ${done ? "bg-success/50" : "bg-border"}`}
                      />
                    ) : null}
                  </div>
                  <div className="pb-6">
                    <p
                      className={`text-[14.5px] font-semibold ${
                        active || done ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {STATUS_META[s].label}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {active ? "In progress now" : done ? "Completed" : "Pending"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="space-y-5">
          <div className="card-premium p-6">
            <Row label="Host" value={record.host.name} />
            <Row label="Department" value={record.host.department} />
            <Row
              label="Location"
              value={COMPANY.legal}
              icon={<MapPin className="size-3.5" aria-hidden />}
            />
            <Row
              label="Check-in"
              value={`${record.time} · ${record.date}`}
              icon={<Clock3 className="size-3.5" aria-hidden />}
            />
          </div>
          <VisitorQRCode visitId={record.visitId} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <ActionButton variant="outline" size="lg" icon={<LogOut className="size-4" />} onClick={onExit}>
          Exit to welcome
        </ActionButton>
        {!isFinal ? (
          <ActionButton size="lg" onClick={onAdvance}>
            Simulate next status
          </ActionButton>
        ) : null}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-border py-3 last:border-0 last:pb-0 first:pt-0">
      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-right text-[14px] font-medium">{value}</span>
    </div>
  );
}
