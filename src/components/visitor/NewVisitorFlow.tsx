import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Mail,
  UserRound,
  BriefcaseBusiness,
  Camera,
} from "lucide-react";
import { StepProgress, NEW_VISITOR_STEPS } from "./StepProgress";
import { FormInput, PhoneInput, SelectField, TextareaField } from "./Fields";
import { HostSelector } from "./HostSelector";
import { OTPPanel } from "./OTPPanel";
import { ActionButton } from "./ActionButton";
import {
  DURATIONS,
  HOSTS,
  VISIT_TYPES,
  emptyPersonal,
  emptyVisit,
  formatDate,
  formatTime,
  generateVisitId,
  initialsOf,
  type Host,
  type PersonalDetails,
  type VisitDetails,
} from "@/lib/visitor-data";

export type VisitRecord = {
  visitId: string;
  personal: PersonalDetails;
  host: Host;
  visit: VisitDetails;
  time: string;
  date: string;
};

type Errors = Record<string, string>;

export function NewVisitorFlow({
  onComplete,
  onExit,
  initialPersonal,
  startStep = 0,
  returning = false,
}: {
  onComplete: (record: VisitRecord) => void;
  onExit: () => void;
  initialPersonal?: PersonalDetails;
  startStep?: number;
  returning?: boolean;
}) {
  const [step, setStep] = useState(startStep);
  const [personal, setPersonal] = useState<PersonalDetails>(initialPersonal ?? emptyPersonal);
  const [visit, setVisit] = useState<VisitDetails>(emptyVisit);
  const [errors, setErrors] = useState<Errors>({});

  const host = HOSTS.find((h) => h.id === visit.hostId);

  function set<K extends keyof PersonalDetails>(key: K, value: string) {
    setPersonal((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validatePersonal() {
    const e: Errors = {};
    if (personal.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
    if (personal.mobile.replace(/\D/g, "").length !== 10)
      e.mobile = "Enter a valid 10-digit mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(personal.email)) e.email = "Enter a valid email address.";
    if (!personal.company.trim()) e.company = "Company or organization is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateVisit() {
    const e: Errors = {};
    if (!visit.hostId) e.hostId = "Select the person you are visiting.";
    if (!visit.visitType) e.visitType = "Select a visit type.";
    if (!visit.purpose.trim()) e.purpose = "Tell us the purpose of your visit.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function finish() {
    const now = new Date();
    onComplete({
      visitId: generateVisitId(),
      personal,
      host: host!,
      visit,
      time: formatTime(now),
      date: formatDate(now),
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => (step === startStep ? onExit() : setStep(step - 1))}
        className="inline-flex items-center gap-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {step === startStep ? "Back to welcome" : "Previous step"}
      </button>

      <div className="mt-6">
        <StepProgress steps={NEW_VISITOR_STEPS} current={step} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          {step === 0 ? (
            <section>
              <h2 className="text-2xl font-semibold">Personal details</h2>
              <p className="mt-1.5 text-[14px] text-muted-foreground">
                Tell us who you are. We'll remember this for your next visit.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <FormInput
                  label="Full Name"
                  placeholder="John Doe"
                  autoComplete="name"
                  icon={<UserRound className="size-4" />}
                  value={personal.fullName}
                  error={errors.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                />
                <PhoneInput
                  value={personal.mobile}
                  error={errors.mobile}
                  onChange={(v) => set("mobile", v)}
                />
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="john@company.com"
                  autoComplete="email"
                  icon={<Mail className="size-4" />}
                  value={personal.email}
                  error={errors.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <FormInput
                  label="Company / Organization"
                  placeholder="ABC Technologies"
                  icon={<Building2 className="size-4" />}
                  value={personal.company}
                  error={errors.company}
                  onChange={(e) => set("company", e.target.value)}
                />
                <FormInput
                  label="Designation"
                  placeholder="Solutions Architect"
                  icon={<BriefcaseBusiness className="size-4" />}
                  value={personal.designation}
                  onChange={(e) => set("designation", e.target.value)}
                  hint="Optional"
                />
                <div className="space-y-2">
                  <span className="block text-[13px] font-medium">Profile Photo</span>
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/40 p-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-[13px] font-semibold text-muted-foreground">
                      {personal.fullName ? initialsOf(personal.fullName) : <Camera className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">Add a photo</p>
                      <p className="text-[12px] text-muted-foreground">Optional · helps reception</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <ActionButton
                  size="lg"
                  icon={<ArrowRight className="size-4" />}
                  onClick={() => validatePersonal() && setStep(1)}
                >
                  Continue
                </ActionButton>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section>
              <h2 className="text-2xl font-semibold">Visit details</h2>
              <p className="mt-1.5 text-[14px] text-muted-foreground">
                {returning
                  ? "Your details are prefilled — just confirm this visit."
                  : "Help us connect you with the right person."}
              </p>

              <div className="mt-7 grid gap-6 lg:grid-cols-2">
                <HostSelector
                  value={visit.hostId}
                  error={errors.hostId}
                  onSelect={(h) =>
                    setVisit((v) => ({ ...v, hostId: h.id, department: h.department }))
                  }
                />
                <div className="grid gap-5 self-start">
                  <FormInput
                    label="Department"
                    value={visit.department}
                    readOnly
                    placeholder="Auto-filled from host"
                    onChange={() => undefined}
                  />
                  <SelectField
                    label="Visit Type"
                    options={VISIT_TYPES}
                    value={visit.visitType}
                    error={errors.visitType}
                    onChange={(v) => setVisit((s) => ({ ...s, visitType: v }))}
                  />
                  <SelectField
                    label="Expected Duration"
                    options={DURATIONS}
                    value={visit.duration}
                    onChange={(v) => setVisit((s) => ({ ...s, duration: v }))}
                  />
                  <FormInput
                    label="Meeting / Appointment Reference"
                    placeholder="e.g. INV-4821"
                    hint="Optional"
                    value={visit.reference}
                    onChange={(e) => setVisit((s) => ({ ...s, reference: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-6">
                <TextareaField
                  label="Purpose of Visit"
                  placeholder="Quarterly business review with the engineering team."
                  value={visit.purpose}
                  error={errors.purpose}
                  onChange={(v) => setVisit((s) => ({ ...s, purpose: v }))}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <ActionButton
                  size="lg"
                  icon={<ArrowRight className="size-4" />}
                  onClick={() => validateVisit() && setStep(2)}
                >
                  Verify &amp; Continue
                </ActionButton>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="py-4">
              <OTPPanel mobile={personal.mobile} onVerified={finish} />
            </section>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
