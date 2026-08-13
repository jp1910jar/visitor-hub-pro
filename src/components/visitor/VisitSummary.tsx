import { QRCodeSVG } from "qrcode.react";
import { motion } from "motion/react";
import { COMPANY } from "@/lib/visitor-data";

export type SummaryRow = { label: string; value: string };

export function VisitSummary({ rows }: { rows: SummaryRow[] }) {
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {row.label}
          </dt>
          <dd className="mt-1.5 text-[15px] font-medium text-foreground">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function VisitorQRCode({ visitId }: { visitId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.15 }}
      className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-secondary/50 p-6 text-center sm:flex-row sm:text-left"
    >
      <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
        <QRCodeSVG value={`${COMPANY.name.toUpperCase()}:${visitId}`} size={112} level="M" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Visit ID
        </p>
        <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{visitId}</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Please show this QR code at reception.
        </p>
      </div>
    </motion.div>
  );
}
