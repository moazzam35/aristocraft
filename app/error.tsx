"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import RefreshCwIcon from "lucide-react/dist/esm/icons/refresh-cw";

/* ------------------------------------------------------------------ */
/*  PackageScene                                                        */
/* ------------------------------------------------------------------ */

function PackageScene() {
  return (
    <svg
      viewBox="0 0 430 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[340px]"
    >
      <line x1="20" y1="310" x2="410" y2="310" stroke="rgba(0,75,71,0.12)" strokeWidth="1" />
      <ellipse cx="215" cy="316" rx="150" ry="16" fill="rgba(0,75,71,0.07)" />

      <motion.g
        animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
        style={{ transformOrigin: "215px 240px" }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="130" y="190" width="170" height="120" rx="8" fill="#F0C76B" />
        <path d="M300 190 L330 210 L330 318 L300 310 Z" fill="#D4A832" />
        <path d="M130 190 L160 170 L330 170 L300 190 Z" fill="#F4D980" />
        <rect x="193" y="170" width="24" height="150" rx="2" fill="rgba(255,255,255,0.35)" />
        <rect x="130" y="242" width="170" height="18" rx="2" fill="rgba(255,255,255,0.25)" />
        <rect x="148" y="215" width="90" height="55" rx="4" fill="rgba(255,255,255,0.55)" />
        <line x1="158" y1="230" x2="228" y2="230" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" />
        <line x1="158" y1="242" x2="210" y2="242" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="158" y1="252" x2="220" y2="252" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeLinecap="round" />
        <text x="214" y="262" fontSize="22" fontWeight="bold" fill="rgba(199,111,77,0.7)" fontFamily="serif">?</text>
      </motion.g>

      <motion.g
        animate={{ rotate: [-18, -22, -18], y: [0, -4, 0] }}
        style={{ transformOrigin: "88px 295px" }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <rect x="54" y="272" width="68" height="50" rx="5" fill="#EADFCB" />
        <path d="M54 272 L68 258 L136 258 L122 272 Z" fill="#F4EDE0" />
        <path d="M122 272 L136 258 L136 308 L122 322 Z" fill="#D9CEBC" />
        <rect x="82" y="258" width="12" height="64" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="54" y="294" width="68" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
      </motion.g>

      {[
        { x: 68, y: 180, size: 18, delay: 0, opacity: 0.25 },
        { x: 354, y: 155, size: 14, delay: 0.9, opacity: 0.2 },
        { x: 380, y: 220, size: 10, delay: 1.8, opacity: 0.15 },
        { x: 48, y: 235, size: 12, delay: 1.2, opacity: 0.18 },
      ].map((q, i) => (
        <motion.text
          key={i}
          x={q.x}
          y={q.y}
          fontSize={q.size}
          fill={`rgba(0,75,71,${q.opacity})`}
          fontFamily="serif"
          fontWeight="bold"
          animate={{ opacity: [0, q.opacity, 0], y: [q.y, q.y - 16, q.y - 32] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: q.delay }}
        >
          ?
        </motion.text>
      ))}

      <motion.g
        animate={{ x: [0, 18, 0], y: [0, -8, 0], rotate: [-10, 10, -10] }}
        style={{ transformOrigin: "342px 110px" }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <circle cx="334" cy="102" r="22" stroke="rgba(0,75,71,0.3)" strokeWidth="3" fill="rgba(0,75,71,0.06)" />
        <line x1="350" y1="118" x2="366" y2="134" stroke="rgba(0,75,71,0.3)" strokeWidth="3" strokeLinecap="round" />
      </motion.g>

      {[340, 310, 278, 248, 220].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={312}
          r="2.5"
          fill="rgba(0,75,71,0.18)"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ErrorPage — single centered card                                   */
/* ------------------------------------------------------------------ */

const ErrorPage = memo(function ErrorPage({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-30px_rgba(0,30,28,0.2)]"
      >
        {/* top teal band with scene */}
        <div className="relative flex flex-col items-center overflow-hidden bg-[#004b47] px-8 pt-10 pb-2">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* logo */}
          <Link href="/" className="relative z-10 mb-6 flex items-center gap-2.5">
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border-[1.5px] border-white/55">
              <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px]">
                <path
                  d="M4 10v8M20 10v8M4 14h16M6 10c0-2.5 1.5-5 6-5s6 2.5 6 5"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="font-serif text-[1.05rem] tracking-[0.06em] text-white">Aristocraft</span>
          </Link>

          {/* scene */}
          <div className="relative z-10 w-full">
            <PackageScene />
          </div>
        </div>

        {/* bottom content */}
        <div className="px-8 py-9">

          {/* badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#C76F4D]/12 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C76F4D]" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-widest text-[#C76F4D]">
              500 — Server Error
            </span>
          </div>

          <h2 className="font-serif text-[1.65rem] tracking-tight text-neutral-900">
            This page got
            <br />
            lost in transit.
          </h2>
          <p className="mt-2.5 mb-7 text-[0.87rem] leading-relaxed text-neutral-500">
            An unexpected error occurred on our end. Our team has been notified — try refreshing or head back home.
          </p>

          {/* error digest */}
          {error?.digest && (
            <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <p className="mb-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-neutral-400">Error ID</p>
              <p className="font-mono text-[0.78rem] text-neutral-600">{error.digest}</p>
            </div>
          )}

          {/* actions */}
          <div className="flex flex-col gap-3">
            {reset && (
              <button
                type="button"
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C76F4D] py-3.5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-[#A8552F] active:scale-[0.98]"
              >
                <RefreshCwIcon size={15} strokeWidth={2} />
                Try again
              </button>
            )}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3.5 text-[0.92rem] font-medium text-neutral-700 transition-colors duration-200 hover:border-neutral-400 hover:bg-[#EFE8DA]"
            >
              <ArrowLeftIcon size={15} strokeWidth={2} />
              Back to home
            </Link>
          </div>

          {/* support links */}
          <div className="mt-7 flex items-center gap-3 text-[0.78rem] text-neutral-400">
            <span className="h-px flex-1 bg-neutral-200" />
            <Link href="/contact" className="font-medium text-[#004b47] hover:underline">Contact support</Link>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default ErrorPage;