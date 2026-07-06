"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon, CheckCircle as CheckCircleIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  EnvelopeScene — animated 2D envelope / mail illustration           */
/* ------------------------------------------------------------------ */

function EnvelopeScene() {
  return (
    <svg
      viewBox="0 0 430 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[430px]"
    >
      {/* floor line */}
      <line x1="20" y1="310" x2="410" y2="310" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      {/* shadow ellipse */}
      <ellipse cx="215" cy="315" rx="140" ry="18" fill="rgba(0,0,0,0.18)" />

      {/* ── Desk surface ── */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="80" y="255" width="270" height="52" rx="8" fill="#A8552F" />
        <rect x="80" y="255" width="270" height="12" rx="8" fill="#C76F4D" />
        {/* desk legs */}
        <rect x="100" y="305" width="14" height="30" rx="3" fill="#3a2a1c" />
        <rect x="316" y="305" width="14" height="30" rx="3" fill="#3a2a1c" />
      </motion.g>

      {/* ── Envelope body ── */}
      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        {/* envelope back */}
        <rect x="118" y="148" width="194" height="130" rx="10" fill="#F0C76B" />

        {/* envelope flap (open) */}
        <motion.path
          d="M118 158 L215 210 L312 158"
          fill="#E6B84A"
          animate={{ d: ["M118 158 L215 210 L312 158", "M118 158 L215 148 L312 158", "M118 158 L215 210 L312 158"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />

        {/* envelope front bottom fold lines */}
        <path d="M118 278 L215 220 L312 278" fill="#D4A832" />

        {/* letter peeking out */}
        <motion.g
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <rect x="148" y="100" width="134" height="110" rx="6" fill="#FAF6EF" />
          <rect x="148" y="100" width="134" height="110" rx="6" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          {/* letter lines */}
          <line x1="166" y1="126" x2="264" y2="126" stroke="rgba(0,75,71,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="166" y1="144" x2="264" y2="144" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
          <line x1="166" y1="158" x2="240" y2="158" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
          <line x1="166" y1="172" x2="252" y2="172" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
          <line x1="166" y1="186" x2="228" y2="186" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
          {/* small lock icon on letter */}
          <rect x="198" y="108" width="34" height="12" rx="3" fill="rgba(0,75,71,0.12)" />
          <circle cx="215" cy="114" r="3" fill="rgba(0,75,71,0.35)" />
        </motion.g>

        {/* envelope rim */}
        <rect x="118" y="148" width="194" height="130" rx="10" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      </motion.g>

      {/* ── Floating sparkles ── */}
      <motion.circle
        cx="88"
        cy="140"
        r="4"
        fill="rgba(240,199,107,0.7)"
        animate={{ opacity: [0, 1, 0], y: [0, -14, -28], scale: [0.6, 1, 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
      />
      <motion.circle
        cx="342"
        cy="160"
        r="3"
        fill="rgba(255,255,255,0.55)"
        animate={{ opacity: [0, 1, 0], y: [0, -12, -24], scale: [0.5, 1, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
      />
      <motion.circle
        cx="310"
        cy="120"
        r="2.5"
        fill="rgba(199,111,77,0.6)"
        animate={{ opacity: [0, 1, 0], y: [0, -10, -20], scale: [0.4, 1, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 2 }}
      />
      <motion.circle
        cx="120"
        cy="200"
        r="2"
        fill="rgba(255,255,255,0.4)"
        animate={{ opacity: [0, 1, 0], y: [0, -8, -16] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
      />

      {/* ── Small key on desk ── */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <circle cx="310" cy="248" r="10" fill="none" stroke="#FAF6EF" strokeWidth="3" />
        <line x1="320" y1="248" x2="340" y2="248" stroke="#FAF6EF" strokeWidth="3" strokeLinecap="round" />
        <line x1="334" y1="248" x2="334" y2="242" stroke="#FAF6EF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="339" y1="248" x2="339" y2="243" stroke="#FAF6EF" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>

      {/* ── Stamp top-right corner of envelope ── */}
      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <rect x="284" y="158" width="22" height="26" rx="2" fill="#C76F4D" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="287" y="161" width="16" height="16" rx="1" fill="rgba(255,255,255,0.25)" />
        <line x1="295" y1="181" x2="295" y2="181" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" />
      </motion.g>

      {/* wall art top-left */}
      <rect
        x="52"
        y="72"
        width="52"
        height="68"
        rx="4"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
      />
      <circle cx="78" cy="100" r="12" fill="rgba(199,111,77,0.45)" />
      <line x1="62" y1="126" x2="94" y2="126" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Step type                                                           */
/* ------------------------------------------------------------------ */

type Step = "request" | "sent";

/* ------------------------------------------------------------------ */
/*  ForgotPasswordPage                                                  */
/* ------------------------------------------------------------------ */

const ForgotPasswordPage = memo(function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setError("");
    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      // intentionally silent — still show "sent" step regardless,
      // since the API itself never reveals whether the email exists
    }

    setLoading(false);
    setStep("sent");
  }

  async function handleResend() {
    if (!email) return;
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      // silent
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] p-4 sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-[#FAF6EF] shadow-[0_40px_90px_-30px_rgba(0,30,28,0.35)] md:min-h-[680px] md:grid-cols-[1.05fr_1fr]">

        {/* ---------------- LEFT: illustrated stage ---------------- */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#004b47] p-11 md:flex">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

          <Link href="/" className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] border-white/55">
              <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px]">
                <path
                  d="M4 10v8M20 10v8M4 14h16M6 10c0-2.5 1.5-5 6-5s6 2.5 6 5"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="font-serif text-[1.15rem] tracking-[0.06em] text-white">Aristocraft</span>
          </Link>

          <div className="relative z-10 my-2 flex flex-1 items-center justify-center">
            <EnvelopeScene />
          </div>

          <div className="relative z-10 max-w-[380px]">
            <p className="mb-3.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/60">
              Password recovery
            </p>
            <h1 className="font-serif text-[1.9rem] leading-[1.25] tracking-tight text-white">
              We'll get you
              <br />
              back inside.
            </h1>
            <p className="mt-3.5 text-[0.92rem] leading-relaxed text-white/70">
              A reset link is on its way — check your inbox and you'll be back to browsing in moments.
            </p>
          </div>
        </div>

        {/* ---------------- RIGHT: form panel ---------------- */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 md:px-14">
          <div className="mx-auto w-full max-w-[380px]">

            <AnimatePresence mode="wait">
              {step === "request" ? (
                <motion.div
                  key="request"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="/login"
                    className="mb-9 inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-neutral-500 transition-colors hover:text-[#004b47]"
                  >
                    <ArrowLeftIcon size={14} strokeWidth={2} />
                    Back to log in
                  </Link>

                  {/* icon badge */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#004b47]/10">
                    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]">
                      <rect x="2" y="6" width="20" height="14" rx="3" stroke="#004b47" strokeWidth="1.7" />
                      <path d="M2 9l10 7 10-7" stroke="#004b47" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <h2 className="font-serif text-[1.7rem] tracking-tight text-neutral-900">
                    Forgot your password?
                  </h2>
                  <p className="mb-8 mt-2 text-[0.87rem] leading-relaxed text-neutral-500">
                    No worries — enter the email address linked to your account and we'll send you a reset link.
                  </p>

                  {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.84rem] text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-[7px]">
                      <label
                        htmlFor="forgot-email"
                        className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                      >
                        Email
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-1.5 flex items-center justify-center gap-2 rounded-xl bg-[#C76F4D] py-3.5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-[#A8552F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send reset link"}
                      {!loading && <ArrowRightIcon size={15} strokeWidth={2} />}
                    </button>
                  </form>

                  <p className="mt-8 text-center text-[0.85rem] text-neutral-500">
                    Remembered it?{" "}
                    <Link href="/login" className="font-semibold text-[#004b47] hover:underline">
                      Log in
                    </Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#004b47]/10"
                  >
                    <CheckCircleIcon size={30} className="text-[#004b47]" strokeWidth={1.6} />
                  </motion.div>

                  <h2 className="font-serif text-[1.7rem] tracking-tight text-neutral-900">
                    Check your inbox
                  </h2>
                  <p className="mb-2 mt-3 text-[0.87rem] leading-relaxed text-neutral-500">
                    We've sent a password reset link to
                  </p>
                  <span className="mb-6 inline-block rounded-lg bg-[#EFE8DA] px-3.5 py-1.5 text-[0.88rem] font-semibold text-neutral-800">
                    {email}
                  </span>
                  <p className="mb-8 text-[0.84rem] leading-relaxed text-neutral-400">
                    The link expires in 30 minutes. If you don't see it, check your spam folder.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="w-full rounded-xl border border-neutral-200 bg-white py-3.5 text-[0.92rem] font-medium text-neutral-700 transition-colors duration-200 hover:border-neutral-400 hover:bg-[#EFE8DA]"
                  >
                    Use a different email
                  </button>

                  <div className="my-5 h-px w-full bg-neutral-200" />

                  <p className="text-[0.84rem] text-neutral-500">
                    Didn't receive it?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-semibold text-[#C76F4D] hover:underline"
                    >
                      Resend link
                    </button>
                  </p>

                  <p className="mt-6 text-[0.84rem] text-neutral-500">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 font-medium text-[#004b47] hover:underline"
                    >
                      <ArrowLeftIcon size={13} strokeWidth={2} />
                      Back to log in
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
});

export default ForgotPasswordPage;