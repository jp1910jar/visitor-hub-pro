import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Search, Loader2, SearchX } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { FormInput, PhoneInput } from "./Fields";
import { OTPPanel } from "./OTPPanel";
import { VisitorProfileCard, VisitHistory } from "./ProfilePanels";
import { visitorService } from "@/lib/services";
import type { PersonalDetails, VisitorProfile } from "@/lib/visitor-data";

type Method = "mobile" | "email" | "visitorId";
type Phase = "lookup" | "searching" | "notfound" | "otp" | "profile";

const METHODS: { id: Method; label: string }[] = [
  { id: "mobile", label: "Mobile Number" },
  { id: "email", label: "Email Address" },
  { id: "visitorId", label: "Visitor ID" },
];

export function ReturningVisitorFlow({
  onCheckInAgain,
  onExit,
}: {
  onCheckInAgain: (personal: PersonalDetails) => void;
  onExit: () => void;
}) {
  const [method, setMethod] = useState<Method>("mobile");
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("lookup");
  const [error, setError] = useState<string | undefined>();
  const [profile, setProfile] = useState<VisitorProfile | null>(null);

  async function find() {
    if (!value.trim()) {
      setError("Enter your details to continue.");
      return;
    }
    setError(undefined);
    setPhase("searching");

    try {
      const params =
        method === "mobile"
          ? { mobile: value }
          : method === "email"
            ? { email: value }
            : { visitorId: value };

      const result = await visitorService.lookup(params);

      if (result) {
        setProfile(result);
        setPhase("otp");
      } else {
        setPhase("notfound");
      }
    } catch (err) {
      console.error("Visitor lookup failed:", err);
      setError("Something went wrong while searching. Please try again.");
      setPhase("lookup");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onExit}
        className="inline-flex items-center gap-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to welcome
      </button>

      <AnimatePresence mode="wait">
        {phase === "lookup" || phase === "searching" || phase === "notfound" ? (
          <motion.section
            key="lookup"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-7"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Find your visitor profile</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Look yourself up and we'll reuse the details from your last visit.
            </p>

            <div className="mt-7 inline-flex rounded-xl border border-border bg-secondary/60 p-1">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMethod(m.id);
                    setValue("");
                    setError(undefined);
                    setPhase("lookup");
                  }}
                  className={`relative rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    method === m.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {method === m.id ? (
                    <motion.span
                      layoutId="method-pill"
                      className="absolute inset-0 rounded-lg bg-card shadow-[var(--shadow-card)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative">{m.label}</span>
                </button>
              ))}
            </div>

            <motion.div layout className="card-premium mt-5 p-6 sm:p-7">
              {method === "mobile" ? (
                <PhoneInput value={value} error={error} onChange={setValue} />
              ) : method === "email" ? (
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@abctech.com"
                  value={value}
                  error={error}
                  onChange={(e) => setValue(e.target.value)}
                />
              ) : (
                <FormInput
                  label="Visitor ID"
                  placeholder="VIS-2026-00087"
                  value={value}
                  error={error}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}

              <ActionButton
                size="lg"
                className="mt-6 w-full sm:w-auto"
                disabled={phase === "searching"}
                onClick={find}
                icon={
                  phase === "searching" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )
                }
              >
                {phase === "searching" ? "Searching…" : "Find My Details"}
              </ActionButton>

              {phase === "notfound" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center"
                >
                  <SearchX className="mx-auto size-5 text-muted-foreground" aria-hidden />
                  <p className="mt-3 text-[14.5px] font-semibold">No profile found</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    We couldn't match those details. Register as a new visitor instead.
                  </p>
                </motion.div>
              ) : null}
            </motion.div>
          </motion.section>
        ) : null}

        {phase === "otp" && profile ? (
          <motion.section
            key="otp"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-premium mt-7 p-7 sm:p-9"
          >
            <OTPPanel
              email={profile.personal.email}
              title="Verify it's you"
              onVerified={() => setPhase("profile")}
            />
          </motion.section>
        ) : null}

        {phase === "profile" && profile ? (
          <motion.section
            key="profile"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 space-y-7"
          >
            <VisitorProfileCard profile={profile} />
            <VisitHistory profile={profile} />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <ActionButton variant="outline" size="lg" onClick={onExit}>
                Not you?
              </ActionButton>
              <ActionButton
                size="lg"
                icon={<ArrowRight className="size-4" />}
                onClick={() => onCheckInAgain(profile.personal)}
              >
                Check In Again
              </ActionButton>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}