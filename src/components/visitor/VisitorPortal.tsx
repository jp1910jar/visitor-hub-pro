import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import heroImage from "@/assets/reception-hero.jpg.png";
import { BrandHeader } from "./BrandHeader";
import { LandingChoice } from "./LandingChoice";
import { NewVisitorFlow, type VisitRecord } from "./NewVisitorFlow";
import { ReturningVisitorFlow } from "./ReturningVisitorFlow";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { ActiveVisitScreen } from "./ActiveVisitScreen";
import {
  COMPANY,
  LIVE_STATUS_FLOW,
  type PersonalDetails,
  type VisitStatus,
} from "@/lib/visitor-data";

type Stage = "landing" | "new" | "returning" | "confirmation" | "active";

export function VisitorPortal({ kiosk = false }: { kiosk?: boolean }) {
  const [stage, setStage] = useState<Stage>("landing");
  const [prefill, setPrefill] = useState<PersonalDetails | undefined>();
  const [record, setRecord] = useState<VisitRecord | undefined>();
  const [status, setStatus] = useState<VisitStatus>("checked_in");

  function reset() {
    setStage("landing");
    setPrefill(undefined);
    setRecord(undefined);
    setStatus("checked_in");
  }

  function advance() {
    const i = LIVE_STATUS_FLOW.indexOf(status);
    const next = LIVE_STATUS_FLOW[Math.min(i + 1, LIVE_STATUS_FLOW.length - 1)];
    if (next) setStatus(next);
  }

  const content = (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage + (prefill ? "-pre" : "")}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {stage === "landing" ? (
          <LandingChoice
            kiosk={kiosk}
            onSelect={(mode) => setStage(mode === "new" ? "new" : "returning")}
          />
        ) : null}

        {stage === "new" ? (
          <NewVisitorFlow
            {...(prefill ? { initialPersonal: prefill, startStep: 1, returning: true } : {})}
            onExit={reset}
            onComplete={(rec) => {
              setRecord(rec);
              setStage("confirmation");
            }}
          />
        ) : null}

        {stage === "returning" ? (
          <ReturningVisitorFlow
            onExit={reset}
            onCheckInAgain={(personal) => {
              setPrefill(personal);
              setStage("new");
            }}
          />
        ) : null}

        {stage === "confirmation" && record ? (
          <ConfirmationScreen
            record={record}
            onDone={reset}
            onCheckIn={() => {
              setStatus("checked_in");
              setStage("active");
            }}
          />
        ) : null}

        {stage === "active" && record ? (
          <ActiveVisitScreen
            record={record}
            status={status}
            onAdvance={advance}
            onExit={reset}
          />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );

  if (kiosk) {
    return (
      <div className="min-h-screen surface-canvas">
        <BrandHeader centered />
        <main className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20">{content}</main>
      </div>
    );
  }

  const showHero = stage === "landing" || stage === "returning";

  return (
    <div className="min-h-screen surface-canvas">
      <BrandHeader />
      <main className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:py-14">
        {showHero ? (
          <motion.aside
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative hidden overflow-hidden rounded-[28px] lg:block"
          >
            <motion.img
              src={heroImage}
              alt="Visitor being welcomed at a modern corporate office reception"
              width={1280}
              height={1600}
              animate={{ scale: [1.04, 1.09] }}
              transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.2_0.04_250/0.25),oklch(0.16_0.04_250/0.88))]" />
            <div className="relative flex h-full min-h-[620px] flex-col justify-end p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.88_0.05_205)]">
                {COMPANY.legal}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[oklch(0.99_0_0)]">
                Welcome to {COMPANY.name}
                <span className="block text-[oklch(0.86_0.06_205)]">Your visit starts here.</span>
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[oklch(0.9_0.01_240/0.82)]">
                Check in securely and get connected with the right person in just a few steps.
              </p>
            </div>
          </motion.aside>
        ) : null}

        <section className={showHero ? "" : "lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-4xl"}>
          <div className="card-premium p-6 sm:p-8 lg:p-10">{content}</div>
        </section>
      </main>
      <footer className="mx-auto w-full max-w-7xl px-5 pb-10 text-[12.5px] text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} {COMPANY.legal} · Visitor data is stored securely and shared
        only with your host.
      </footer>
    </div>
  );
}
