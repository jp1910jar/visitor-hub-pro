import { motion } from "motion/react";
import { Check } from "lucide-react";

export const NEW_VISITOR_STEPS = [
  "Personal Details",
  "Visit Details",
  "Verification",
  "Confirmation",
];

export function StepProgress({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  const pct = (current / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex min-w-0 items-center gap-2.5">
              <motion.span
                animate={{
                  scale: active ? 1.06 : 1,
                }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className={`grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors ${
                  done
                    ? "border-transparent bg-success text-success-foreground"
                    : active
                      ? "border-transparent bg-brand-gradient text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : `0${i + 1}`}
              </motion.span>
              <span
                className={`hidden truncate text-[13px] font-medium sm:inline ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-gradient"
          initial={false}
          animate={{ width: `${Math.max(pct, 6)}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 26 }}
        />
      </div>
    </div>
  );
}
