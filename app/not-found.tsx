"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";

/* ------------------------------------------------------------------ */
/*  EmptyRoomScene — bare room with a single spotlight                 */
/* ------------------------------------------------------------------ */

function EmptyRoomScene() {
  return (
    <svg
      viewBox="0 0 430 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[340px]"
    >
      {/* back wall */}
      <rect x="40" y="60" width="350" height="230" rx="4" fill="rgba(255,255,255,0.03)" />

      {/* floor */}
      <line x1="20" y1="290" x2="410" y2="290" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <ellipse cx="215" cy="296" rx="155" ry="14" fill="rgba(0,0,0,0.15)" />

      {/* floor boards */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="40" y1={300 + i * 12}
          x2="390" y2={300 + i * 12}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}

      {/* ceiling spotlight cone */}
      <motion.g
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M215 60 L155 290 L275 290 Z"
          fill="rgba(240,199,107,0.07)"
        />
        <path
          d="M215 60 L185 290 L245 290 Z"
          fill="rgba(240,199,107,0.06)"
        />
        {/* spotlight fixture */}
        <rect x="200" y="52" width="30" height="12" rx="4" fill="#C76F4D" />
        <ellipse cx="215" cy="64" rx="15" ry="5" fill="#F0C76B" />
      </motion.g>

      {/* spotlight circle on floor */}
      <motion.ellipse
        cx="215" cy="289"
        rx="58" ry="10"
        fill="rgba(240,199,107,0.12)"
        animate={{ rx: [55, 62, 55], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* "404" on the wall faintly */}
      <text
        x="215" y="185"
        fontSize="88"
        fontWeight="bold"
        fontFamily="serif"
        textAnchor="middle"
        fill="rgba(255,255,255,0.04)"
        letterSpacing="-2"
      >
        404
      </text>

      {/* empty picture hook on wall */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        {/* empty frame outline */}
        <rect
          x="82" y="90"
          width="72" height="90"
          rx="4"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        {/* hook */}
        <line x1="118" y1="85" x2="118" y2="92" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
        {/* question mark inside empty frame */}
        <text
          x="118" y="145"
          fontSize="30"
          fontFamily="serif"
          fontWeight="bold"
          textAnchor="middle"
          fill="rgba(255,255,255,0.14)"
        >
          ?
        </text>
      </motion.g>

      {/* another empty frame right side */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <rect
          x="286" y="100"
          width="58" height="72"
          rx="4"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <line x1="315" y1="95" x2="315" y2="102" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
        <text
          x="315" y="146"
          fontSize="24"
          fontFamily="serif"
          fontWeight="bold"
          textAnchor="middle"
          fill="rgba(255,255,255,0.1)"
        >
          ?
        </text>
      </motion.g>

      {/* floating dust motes in spotlight */}
      {[
        { cx: 200, cy: 200, delay: 0 },
        { cx: 225, cy: 230, delay: 0.8 },
        { cx: 210, cy: 255, delay: 1.6 },
        { cx: 232, cy: 210, delay: 2.4 },
        { cx: 196, cy: 270, delay: 0.4 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="1.5"
          fill="rgba(240,199,107,0.55)"
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -30, -60],
            x: [0, i % 2 === 0 ? 6 : -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* baseboard */}
      <rect x="40" y="282" width="350" height="8" rx="2" fill="rgba(255,255,255,0.06)" />

      {/* small tumbleweed rolling */}
      <motion.g
        animate={{ x: [-60, 360], rotate: [0, 720] }}
        style={{ transformOrigin: "80px 284px" }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 1 }}
      >
        <circle cx="80" cy="284" r="9" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <line x1="71" y1="284" x2="89" y2="284" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="80" y1="275" x2="80" y2="293" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="74" y1="278" x2="86" y2="290" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="86" y1="278" x2="74" y2="290" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  NotFoundPage                                                        */
/* ------------------------------------------------------------------ */

const NotFoundPage = memo(function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-30px_rgba(0,30,28,0.2)]"
      >
        {/* top teal band */}
        <div className="relative flex flex-col items-center overflow-hidden bg-[#004b47] px-8 pt-10 pb-2">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

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

          <div className="relative z-10 w-full">
            <EmptyRoomScene />
          </div>
        </div>

        {/* bottom content */}
        <div className="px-8 py-9">

          {/* badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#004b47]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#004b47]" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-widest text-[#004b47]">
              404 — Not Found
            </span>
          </div>

          <h2 className="font-serif text-[1.65rem] tracking-tight text-neutral-900">
            This room is
            <br />
            completely empty.
          </h2>
          <p className="mt-2.5 mb-7 text-[0.87rem] leading-relaxed text-neutral-500">
            The page you're looking for doesn't exist or may have been moved. Let's get you back somewhere furnished.
          </p>

          {/* actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#C76F4D] py-3.5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-[#A8552F] active:scale-[0.98]"
            >
              <ArrowLeftIcon size={15} strokeWidth={2} />
              Back to home
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3.5 text-[0.92rem] font-medium text-neutral-700 transition-colors duration-200 hover:border-neutral-400 hover:bg-[#EFE8DA]"
            >
              Browse the shop
            </Link>
          </div>

          <div className="mt-7 flex items-center gap-3 text-[0.78rem] text-neutral-400">
            <span className="h-px flex-1 bg-neutral-200" />
            <Link href="/contact" className="font-medium text-[#004b47] hover:underline">
              Contact support
            </Link>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default NotFoundPage;