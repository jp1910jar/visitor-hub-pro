import { motion } from "motion/react";
import { UserPlus, RotateCcw, ArrowRight, ShieldCheck, Clock3 } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { COMPANY } from "@/lib/visitor-data";

const options = [
  {
    id: "new" as const,
    icon: UserPlus,
    title: "New Visitor",
    description: "Register your visit and provide your details.",
    cta: "Continue as New Visitor",
  },
  {
    id: "returning" as const,
    icon: RotateCcw,
    title: "Returning Visitor",
    description: "Already registered with us? Find your details and check in faster.",
    cta: "Continue as Returning Visitor",
  },
];

export function LandingChoice({
  onSelect,
  kiosk = false,
}: {
  onSelect: (mode: "new" | "returning") => void;
  kiosk?: boolean;
}) {
  return (
    <div className={kiosk ? "text-center" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          {kiosk ? `Welcome to ${COMPANY.name}` : "Welcome"}
        </p>
        <h1
          className={`mt-2 font-semibold tracking-tight ${kiosk ? "text-4xl sm:text-5xl" : "text-3xl"}`}
        >
          {kiosk ? "Please select an option" : "How would you like to continue?"}
        </h1>
        <p
          className={`mt-3 text-muted-foreground ${kiosk ? "mx-auto max-w-xl text-lg" : "text-[15px]"}`}
        >
          Check in securely and get connected with the right person in just a few steps.
        </p>
      </motion.div>

      <div className={`mt-8 grid gap-4 ${kiosk ? "sm:grid-cols-2" : ""}`}>
        {options.map((opt, i) => (
          <motion.button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.09, type: "spring", stiffness: 180, damping: 22 }}
            whileHover={{ y: -4, scale: 1.008 }}
            whileTap={{ scale: 0.995 }}
            className="group card-premium relative overflow-hidden p-6 text-left transition-colors hover:border-primary/50 hover:shadow-[var(--shadow-lift)] sm:p-7"
          >
            <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-brand-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25" />
            <span className="relative flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-gradient group-hover:text-primary-foreground">
                <opt.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold">{opt.title}</span>
                <span className="mt-1.5 block text-[14px] leading-relaxed text-muted-foreground">
                  {opt.description}
                </span>
              </span>
            </span>
            <span className="relative mt-6 flex items-center gap-2 text-[14.5px] font-semibold text-primary">
              {opt.cta}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </motion.button>
        ))}
      </div>

      {!kiosk ? (
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4 text-success" aria-hidden />
            Verified with a one-time password
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-4 text-primary" aria-hidden />
            Check in under 2 minutes
          </span>
        </div>
      ) : null}
    </div>
  );
}

