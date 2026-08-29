import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { VisitSummary } from "./VisitSummary";
import { VisitorIDCard } from "./VisitorIDCard";
import { StepProgress, NEW_VISITOR_STEPS } from "./StepProgress";
import type { VisitRecord } from "./NewVisitorFlow";

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: (i - 7) * 18 + (i % 3) * 6,
      delay: i * 0.03,
      hue: ["bg-primary", "bg-brand", "bg-success", "bg-warning"][i % 4],
    })),
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-8 h-32 w-0" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], x: p.x, y: [0, -46, 96], rotate: 220 }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
          className={`absolute size-1.5 rounded-[2px] ${p.hue}`}
        />
      ))}
    </div>
  );
}

export function ConfirmationScreen({
  record,
  onCheckIn,
  onDone,
}: {
  record: VisitRecord;
  onCheckIn: () => void;
  onDone: () => void;
}) {
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <StepProgress steps={NEW_VISITOR_STEPS} current={3} />
      <div className="relative mt-10 text-center">
        {showConfetti ? <Confetti /> : null}
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 15 }}
          className="mx-auto grid size-20 place-items-center rounded-full bg-success/12 text-success"
        >
          <motion.span
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 300, damping: 14 }}
          >
            <Check className="size-10" strokeWidth={3} aria-hidden />
          </motion.span>
        </motion.span>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight">You're all set!</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Your visit has been successfully registered.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-premium mt-9 p-6 sm:p-8"
      >
        <VisitSummary
          rows={[
            { label: "Visitor", value: record.personal.fullName },
            { label: "Company", value: record.personal.company || "—" },
            { label: "Meeting with", value: record.host.name },
            { label: "Department", value: record.host.department },
            { label: "Purpose", value: record.visit.purpose },
            { label: "Visit Type", value: record.visit.visitType },
            { label: "Check-in", value: record.time },
            { label: "Date", value: record.date },
          ]}
        />
        <div className="mt-7">
          <VisitorIDCard record={record} />
        </div>
      </motion.div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <ActionButton variant="outline" size="lg" onClick={onDone}>
          Done
        </ActionButton>
        <ActionButton size="lg" icon={<ArrowRight className="size-4" />} onClick={onCheckIn}>
          View Visit Details
        </ActionButton>
      </div>
    </div>
  );
}