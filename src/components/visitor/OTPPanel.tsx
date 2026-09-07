import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShieldCheck, Loader2 } from "lucide-react";
import { maskEmail } from "@/lib/visitor-data";
import { otpService } from "@/lib/services";

export function OTPPanel({
  email,
  onVerified,
  title = "Let's verify your details",
}: {
  email: string;
  onVerified: () => void;
  title?: string;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "verifying" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  async function requestOtp() {
    setSending(true);
    setSendError("");
    try {
      await otpService.send(email);
      setSeconds(30);
    } catch (err: any) {
      setSendError(err?.response?.data?.message || "Couldn't send the OTP. Please try again.");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    requestOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(onVerified, 1200);
    return () => clearTimeout(t);
  }, [status, onVerified]);

  async function commit(next: string[]) {
    setDigits(next);
    const code = next.join("");
    if (code.length !== 6) {
      if (status === "error") {
        setStatus("idle");
        setErrorMessage("");
      }
      return;
    }

    setStatus("verifying");
    try {
      await otpService.verify(email, code);
      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "That code doesn't match.");
      setStatus("error");
    }
  }

  function handleChange(i: number, raw: string) {
    const val = raw.replace(/\D/g, "");
    if (!val) {
      const next = [...digits];
      next[i] = "";
      commit(next);
      return;
    }
    const next = [...digits];
    val.split("").forEach((ch, k) => {
      if (i + k < 6) next[i + k] = ch;
    });
    commit(next);
    const focus = Math.min(i + val.length, 5);
    refs.current[focus]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6"
          >
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success"
            >
              <Check className="size-8" strokeWidth={3} aria-hidden />
            </motion.span>
            <h3 className="mt-5 text-xl font-semibold">You're verified</h3>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              Taking you to the next step…
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              {sending ? "Sending OTP..." : `OTP sent to ${maskEmail(email)}`}
            </p>

            {sendError ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto mt-4 max-w-xs rounded-xl bg-destructive/10 px-4 py-2.5 text-[13px] text-destructive"
              >
                {sendError}{" "}
                <button
                  type="button"
                  onClick={requestOtp}
                  className="font-semibold underline underline-offset-2"
                >
                  Try again
                </button>
              </motion.div>
            ) : null}

            <div className="mt-7 flex justify-center gap-2 sm:gap-2.5">
              {digits.map((d, i) => (
                <motion.input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  value={d}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-label={`Digit ${i + 1}`}
                  disabled={sending || status === "verifying"}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  animate={d ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`size-12 rounded-xl border bg-card text-center text-lg font-semibold tabular-nums outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/12 disabled:opacity-50 sm:size-14 sm:text-xl ${
                    status === "error" ? "border-destructive text-destructive" : "border-border"
                  }`}
                />
              ))}
            </div>

            {status === "verifying" ? (
              <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Verifying...
              </p>
            ) : status === "error" ? (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-[13px] font-medium text-destructive"
              >
                {errorMessage}
              </motion.p>
            ) : null}

            <p className="mt-5 text-[13px] text-muted-foreground">
              Didn't receive the code?{" "}
              {seconds > 0 ? (
                <span className="tabular-nums">Resend in 00:{String(seconds).padStart(2, "0")}</span>
              ) : (
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={sending}
                  className="font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}