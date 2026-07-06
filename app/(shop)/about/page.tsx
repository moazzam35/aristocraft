"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LeafIcon from "lucide-react/dist/esm/icons/leaf";
import HammerIcon from "lucide-react/dist/esm/icons/hammer";
import GemIcon from "lucide-react/dist/esm/icons/gem";
import InfinityIcon from "lucide-react/dist/esm/icons/infinity";
import ArrowUpRightIcon from "lucide-react/dist/esm/icons/arrow-up-right";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right";

/* =========================================================================
   ARISTOCRAFT — About Page
   A quiet, atelier-grade page for a distinguished furniture house.

   Design tokens
   -------------
   Color    linen #F7F4EE · ink #1C1A17 · charcoal #3A3530 ·
            brass #8B6F4E · stone #C9BFAE · sage #6B7860
   Type     display: font-serif (Georgia/Times-class serif stack)
            body:    font-sans (system grotesk stack)
            utility: tracked uppercase, body face, xs size
   Motif    a recurring thin "joinery line" — a horizontal seam that
            furniture silhouettes rest on, echoing a studio floor line.
   ========================================================================= */

/* -------------------------------------------------------------------------
   Scroll-reveal hook — small, restrained, respects reduced motion
   ------------------------------------------------------------------------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Eyebrow label — small tracked utility text used to head each section
   ------------------------------------------------------------------------- */
function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-px w-8 ${light ? "bg-[#F7F4EE]/40" : "bg-[#8B6F4E]"}`}
      />
      <span
        className={`text-[11px] font-medium uppercase tracking-[0.25em] ${
          light ? "text-[#F7F4EE]/70" : "text-[#8B6F4E]"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Joinery line — the recurring structural motif. A thin seam with small
   tick marks, like a measured line on a workshop floor plan. Furniture
   silhouettes are positioned to "sit" on it across the page.
   ------------------------------------------------------------------------- */
function JoineryLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px w-full bg-[#1C1A17]/10 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-between px-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="h-2 w-px bg-[#1C1A17]/10" />
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   2D FURNITURE ILLUSTRATIONS
   Flat, single/double-tone line illustrations built from simple geometry —
   no renders, no stock art. Each accepts a className for sizing/placement.
   ========================================================================= */

function IllustrationLoungeChair({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 320"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* back shell */}
      <path
        d="M70 90 C70 50 110 28 150 28 C190 28 222 50 226 90 L226 190 L70 190 Z"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      {/* seat cushion */}
      <path
        d="M58 190 L238 190 L250 222 C250 232 240 238 228 238 L68 238 C56 238 46 232 46 222 Z"
        fill="#8B6F4E"
        fillOpacity="0.12"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      {/* armrest */}
      <path
        d="M30 140 C18 140 12 152 12 166 L12 206 C12 220 22 230 36 230 L58 230 L58 150 C58 144 48 140 30 140 Z"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      {/* legs */}
      <line x1="78" y1="238" x2="64" y2="292" stroke="#1C1A17" strokeWidth="2" />
      <line x1="220" y1="238" x2="234" y2="292" stroke="#1C1A17" strokeWidth="2" />
      <line x1="30" y1="230" x2="22" y2="282" stroke="#1C1A17" strokeWidth="2" />
      {/* stitch detail */}
      <path
        d="M150 30 L150 188"
        stroke="#1C1A17"
        strokeWidth="1"
        strokeDasharray="2 6"
        opacity="0.5"
      />
    </svg>
  );
}

function IllustrationSofa({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 220"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M40 92 C40 70 56 56 78 56 L402 56 C424 56 440 70 440 92 L440 150 L40 150 Z"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      <line x1="160" y1="58" x2="160" y2="150" stroke="#1C1A17" strokeWidth="1.5" opacity="0.6" />
      <line x1="320" y1="58" x2="320" y2="150" stroke="#1C1A17" strokeWidth="1.5" opacity="0.6" />
      <path
        d="M20 150 C20 138 28 130 40 130 L440 130 C452 130 460 138 460 150 L460 176 C460 188 452 196 440 196 L40 196 C28 196 20 188 20 176 Z"
        fill="#6B7860"
        fillOpacity="0.10"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      <path d="M16 110 C2 110 -4 124 -4 140 L-4 176 C-4 190 6 198 18 198" stroke="#1C1A17" strokeWidth="2" transform="translate(36,0)" />
      <path d="M16 110 C2 110 -4 124 -4 140 L-4 176 C-4 190 6 198 18 198" stroke="#1C1A17" strokeWidth="2" transform="translate(420,0) scale(-1,1) translate(-32,0)" />
      <line x1="56" y1="196" x2="50" y2="216" stroke="#1C1A17" strokeWidth="2" />
      <line x1="424" y1="196" x2="430" y2="216" stroke="#1C1A17" strokeWidth="2" />
      <line x1="120" y1="196" x2="116" y2="214" stroke="#1C1A17" strokeWidth="2" />
      <line x1="360" y1="196" x2="364" y2="214" stroke="#1C1A17" strokeWidth="2" />
    </svg>
  );
}

function IllustrationSideTable({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="100" cy="56" rx="84" ry="14" stroke="#1C1A17" strokeWidth="2" />
      <ellipse cx="100" cy="50" rx="84" ry="14" fill="#F7F4EE" stroke="#1C1A17" strokeWidth="2" />
      <line x1="34" y1="58" x2="44" y2="196" stroke="#1C1A17" strokeWidth="2" />
      <line x1="166" y1="58" x2="156" y2="196" stroke="#1C1A17" strokeWidth="2" />
      <line x1="58" y1="120" x2="142" y2="120" stroke="#1C1A17" strokeWidth="1.5" opacity="0.55" />
      <ellipse cx="100" cy="200" rx="34" ry="6" stroke="#1C1A17" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

function IllustrationLamp({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 280"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M40 30 L120 30 L104 92 L56 92 Z"
        fill="#8B6F4E"
        fillOpacity="0.14"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      <line x1="80" y1="92" x2="80" y2="230" stroke="#1C1A17" strokeWidth="2" />
      <circle cx="80" cy="244" r="4" fill="#1C1A17" />
      <ellipse cx="80" cy="260" rx="42" ry="8" stroke="#1C1A17" strokeWidth="2" />
    </svg>
  );
}

function IllustrationShelf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 220"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="20" y="20" width="220" height="180" stroke="#1C1A17" strokeWidth="2" />
      <line x1="20" y1="80" x2="240" y2="80" stroke="#1C1A17" strokeWidth="1.5" />
      <line x1="20" y1="140" x2="240" y2="140" stroke="#1C1A17" strokeWidth="1.5" />
      <line x1="130" y1="20" x2="130" y2="80" stroke="#1C1A17" strokeWidth="1.5" />
      {/* decor objects on shelves */}
      <rect x="38" y="50" width="14" height="30" fill="#8B6F4E" fillOpacity="0.18" stroke="#1C1A17" strokeWidth="1.2" />
      <rect x="58" y="42" width="22" height="38" fill="none" stroke="#1C1A17" strokeWidth="1.2" />
      <circle cx="200" cy="64" r="14" stroke="#1C1A17" strokeWidth="1.2" />
      <rect x="150" y="104" width="70" height="36" fill="#6B7860" fillOpacity="0.12" stroke="#1C1A17" strokeWidth="1.2" />
      <rect x="38" y="160" width="50" height="18" stroke="#1C1A17" strokeWidth="1.2" />
    </svg>
  );
}

function IllustrationDiningChair({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 260" fill="none" className={className} aria-hidden="true">
      <path d="M30 20 L110 20 L110 110 L30 110 Z" stroke="#1C1A17" strokeWidth="2" />
      <line x1="30" y1="50" x2="110" y2="50" stroke="#1C1A17" strokeWidth="1.2" opacity="0.6" />
      <line x1="30" y1="80" x2="110" y2="80" stroke="#1C1A17" strokeWidth="1.2" opacity="0.6" />
      <path d="M22 110 L118 110 L112 140 L28 140 Z" fill="#8B6F4E" fillOpacity="0.14" stroke="#1C1A17" strokeWidth="2" />
      <line x1="34" y1="140" x2="26" y2="238" stroke="#1C1A17" strokeWidth="2" />
      <line x1="106" y1="140" x2="114" y2="238" stroke="#1C1A17" strokeWidth="2" />
      <line x1="40" y1="200" x2="100" y2="200" stroke="#1C1A17" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function IllustrationVase({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" className={className} aria-hidden="true">
      <path
        d="M44 20 C40 30 36 40 36 56 C36 78 50 86 50 104 L50 140 C50 148 56 152 60 152 C64 152 70 148 70 140 L70 104 C70 86 84 78 84 56 C84 40 80 30 76 20 Z"
        stroke="#1C1A17"
        strokeWidth="2"
        fill="#6B7860"
        fillOpacity="0.10"
      />
      <line x1="40" y1="22" x2="80" y2="22" stroke="#1C1A17" strokeWidth="2" />
    </svg>
  );
}

/* A thin line-art workbench / tools motif for the craftsmanship section */
function IllustrationWorkbench({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 280" fill="none" className={className} aria-hidden="true">
      {/* bench top */}
      <rect x="40" y="80" width="400" height="24" stroke="#1C1A17" strokeWidth="2" />
      <line x1="40" y1="92" x2="440" y2="92" stroke="#1C1A17" strokeWidth="1" opacity="0.4" />
      {/* legs */}
      <line x1="64" y1="104" x2="64" y2="220" stroke="#1C1A17" strokeWidth="2" />
      <line x1="416" y1="104" x2="416" y2="220" stroke="#1C1A17" strokeWidth="2" />
      <line x1="120" y1="104" x2="120" y2="220" stroke="#1C1A17" strokeWidth="2" />
      <line x1="360" y1="104" x2="360" y2="220" stroke="#1C1A17" strokeWidth="2" />
      <line x1="64" y1="220" x2="416" y2="220" stroke="#1C1A17" strokeWidth="2" />
      {/* wood plank on top */}
      <rect x="150" y="48" width="160" height="20" rx="2" stroke="#1C1A17" strokeWidth="2" fill="#8B6F4E" fillOpacity="0.12" />
      {/* clamp */}
      <path d="M150 48 L150 30 C150 24 156 22 162 22" stroke="#1C1A17" strokeWidth="2" />
      <line x1="162" y1="22" x2="162" y2="40" stroke="#1C1A17" strokeWidth="2" />
      {/* hand plane (simplified) */}
      <path d="M330 70 C330 58 344 50 364 50 C384 50 396 58 396 70 L396 80 L330 80 Z" stroke="#1C1A17" strokeWidth="2" fill="none" />
      {/* chisels hanging */}
      <line x1="60" y1="60" x2="60" y2="80" stroke="#1C1A17" strokeWidth="2" />
      <line x1="60" y1="60" x2="50" y2="46" stroke="#1C1A17" strokeWidth="2" />
      <line x1="80" y1="60" x2="80" y2="80" stroke="#1C1A17" strokeWidth="2" />
      <line x1="80" y1="60" x2="90" y2="46" stroke="#1C1A17" strokeWidth="2" />
    </svg>
  );
}

/* =========================================================================
   FEATURE / VALUE CARD
   ========================================================================= */
function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group h-full rounded-sm border border-[#1C1A17]/10 bg-[#FCFAF6] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#8B6F4E]/40 hover:shadow-[0_18px_40px_-22px_rgba(28,26,23,0.35)] sm:p-9">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-[#8B6F4E]/30 text-[#8B6F4E] transition-colors duration-500 group-hover:bg-[#8B6F4E] group-hover:text-[#F7F4EE]">
          {icon}
        </div>
        <h3 className="font-serif text-xl text-[#1C1A17]">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#3A3530]/80">
          {description}
        </p>
      </div>
    </Reveal>
  );
}

/* =========================================================================
   STAT
   ========================================================================= */
function useCountUp(target: number, visible: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    let raf = 0;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);

  return value;
}

function Stat({
  target,
  suffix = "",
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const value = useCountUp(target, visible);

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-5xl text-[#F7F4EE] sm:text-6xl">
        {value}
        <span className="text-[#8B6F4E]">{suffix}</span>
      </div>
      <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#F7F4EE]/55">
        {label}
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN PAGE
   ========================================================================= */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EE] font-sans text-[#1C1A17] antialiased selection:bg-[#8B6F4E]/20">
      {/* =====================================================================
          1. HERO
         ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[#1C1A17]/10 px-6 pt-28 pb-20 sm:px-10 sm:pt-36 sm:pb-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Est. 2019 · Artisan Furniture Studio</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-7 font-serif text-[2.75rem] leading-[1.08] text-[#1C1A17] sm:text-6xl lg:text-[4.25rem]">
                Furniture built to
                <br />
                <span className="italic text-[#8B6F4E]">outlast</span> the
                trend.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-[#3A3530]/85">
                Aristocraft began with a single belief: that furniture should
                be built to last a lifetime, not a season. Founded in
                Bhawalnagar, Punjab, every chair, table, and cabinet we
                craft passes through the hands of skilled artisans who
                share one obsession — getting the details right.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href="#collection"
                  className="group inline-flex items-center gap-2 bg-[#1C1A17] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.15em] text-[#F7F4EE] transition-colors duration-300 hover:bg-[#8B6F4E]"
                >
                  Shop the Collection
                  <ArrowUpRightIcon
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
                <Link
                  href="#craftsmanship"
                  className="text-[13px] font-medium uppercase tracking-[0.15em] text-[#1C1A17] underline decoration-[#8B6F4E]/40 underline-offset-8 transition-colors duration-300 hover:decoration-[#8B6F4E]"
                >
                  Our Craft
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Hero illustration */}
          <div className="relative lg:col-span-5">
            <Reveal delay={150}>
              <div className="relative mx-auto aspect-[4/5] max-w-sm rounded-sm border border-[#1C1A17]/10 bg-[#FCFAF6] p-10">
                <IllustrationLoungeChair className="h-full w-full" />
                <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full border border-[#8B6F4E]/25 bg-[#F7F4EE] p-4 sm:-left-10">
                  <IllustrationVase className="h-full w-full" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* decorative joinery line threading the hero baseline */}
        <div className="relative mx-auto mt-20 max-w-7xl">
          <JoineryLine />
        </div>
      </section>

      {/* =====================================================================
          2. OUR STORY
         ===================================================================== */}
      <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Reveal>
              <div className="relative mx-auto max-w-md">
                <IllustrationSofa className="w-full" />
                <div className="mt-10 flex items-center justify-center gap-10 opacity-90">
                  <IllustrationSideTable className="h-28 w-auto" />
                  <IllustrationLamp className="h-32 w-auto" />
                </div>
              </div>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <Reveal>
              <Eyebrow>Our Story</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-serif text-4xl leading-tight text-[#1C1A17] sm:text-5xl">
                A workshop that
                <br />
                never stopped being one.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-[#3A3530]/85">
                <p>
                  It started with a question our founder, Moazzam Pasha,
                  kept asking furniture makers: why does "handmade" so
                  rarely mean what it claims? In 2019, he opened a small
                  workshop in Bhawalnagar with a team of dedicated
                  craftspeople and a simple rule — no piece leaves the
                  floor until it has earned the maker's mark.
                </p>
                <p>
                  That rule never changed, even as Aristocraft grew into
                  a nationally recognised brand. We still design in solid
                  wood before we design on screen. We still test every
                  joint by hand. And we still believe that the slowest
                  part of the process — the part most brands cut first —
                  is the part our customers can feel.
                </p>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex items-center gap-4 border-t border-[#1C1A17]/10 pt-7">
                <span className="font-serif text-2xl italic text-[#8B6F4E]">
                  Moazzam Pasha
                </span>
                <span className="text-sm text-[#3A3530]/60">
                  Founder &amp; Creative Director
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. WHAT MAKES US DIFFERENT
         ===================================================================== */}
      <section className="border-y border-[#1C1A17]/10 bg-[#F1ECE2] px-6 py-24 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <div className="flex justify-center">
                <Eyebrow>What Makes Us Different</Eyebrow>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-serif text-4xl text-[#1C1A17] sm:text-5xl">
                Standards we won't compromise.
              </h2>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<GemIcon className="h-5 w-5" strokeWidth={1.5} />}
              title="Quality Materials"
              description="Kiln-dried hardwoods, full-grain leather, and natural fibers sourced from mills we've worked with for decades — never composite, never veneer over softwood."
              delay={0}
            />
            <FeatureCard
              icon={<InfinityIcon className="h-5 w-5" strokeWidth={1.5} />}
              title="Timeless Design"
              description="Our pieces are drawn to sit comfortably in a room for thirty years, not thirty days. Proportion and restraint over passing trends."
              delay={80}
            />
            <FeatureCard
              icon={<LeafIcon className="h-5 w-5" strokeWidth={1.5} />}
              title="Sustainable Production"
              description="FSC-certified timber, water-based finishes, and a take-back program that reupholsters rather than replaces. We build less, and we build it to last."
              delay={160}
            />
            <FeatureCard
              icon={<HammerIcon className="h-5 w-5" strokeWidth={1.5} />}
              title="Expert Craftsmanship"
              description="Every joint is cut, fitted, and finished by a named maker — not a machine line. Apprenticeships run seven years before a solo signature."
              delay={240}
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. CRAFTSMANSHIP
         ===================================================================== */}
      <section id="craftsmanship" className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <Eyebrow>Craftsmanship</Eyebrow>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="mt-6 font-serif text-4xl leading-tight text-[#1C1A17] sm:text-5xl">
                  Built in the open,
                  <br />
                  joint by joint.
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-[#3A3530]/85">
                  Step into any Aristocraft workshop and you'll see the same
                  dedication in every corner: a bench, a maker, and
                  no shortcuts. We favour mortise-and-tenon joinery over
                  staples, hand-rubbed oil finishes over spray lacquer, and
                  hours of dry-fitting before a single screw is set.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-10 space-y-7">
                  <div className="flex gap-5">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B6F4E]" />
                    <div>
                      <h4 className="font-serif text-lg text-[#1C1A17]">
                        Selected by hand
                      </h4>
                      <p className="mt-1 text-[15px] text-[#3A3530]/75">
                        Each board is chosen for grain direction and
                        character before it's cut — no two pieces are
                        identical.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B6F4E]" />
                    <div>
                      <h4 className="font-serif text-lg text-[#1C1A17]">
                        Joined, not fastened
                      </h4>
                      <p className="mt-1 text-[15px] text-[#3A3530]/75">
                        Traditional joinery techniques mean our frames
                        tighten with age instead of loosening.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B6F4E]" />
                    <div>
                      <h4 className="font-serif text-lg text-[#1C1A17]">
                        Finished by feel
                      </h4>
                      <p className="mt-1 text-[15px] text-[#3A3530]/75">
                        Hand-rubbed natural oils are reapplied in coats until
                        the wood — not a timer — says it's done.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={150}>
                <div className="rounded-sm border border-[#1C1A17]/10 bg-[#FCFAF6] p-10 sm:p-14">
                  <IllustrationWorkbench className="w-full" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. STATISTICS
         ===================================================================== */}
      <section className="relative overflow-hidden bg-[#1C1A17] px-6 py-24 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-y-14 gap-x-6 sm:grid-cols-4">
            <Stat target={31} suffix="" label="Years of Experience" />
            <Stat target={48} suffix="K+" label="Happy Customers" />
            <Stat target={120} suffix="K+" label="Products Delivered" />
            <Stat target={64} suffix="" label="Design Collections" />
          </div>
        </div>
        {/* subtle motif line, faint, at the very base */}
        <div className="absolute inset-x-0 bottom-0">
          <JoineryLine className="bg-[#F7F4EE]/10" />
        </div>
      </section>

      {/* =====================================================================
          6. VALUES
         ===================================================================== */}
      <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow>Our Values</Eyebrow>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="mt-6 font-serif text-4xl leading-tight text-[#1C1A17] sm:text-5xl">
                  What we won't put our name on.
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[#3A3530]/75">
                  These four principles are reviewed at every design meeting,
                  every supplier review, and every product launch — not as
                  marketing copy, but as a checklist.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[#1C1A17]/10 bg-[#1C1A17]/10 sm:grid-cols-2 lg:col-span-8">
              {[
                {
                  icon: <GemIcon className="h-5 w-5" strokeWidth={1.5} />,
                  title: "Design",
                  text: "Form follows the room it lives in. We design for proportion, comfort, and longevity — never for the photograph alone.",
                },
                {
                  icon: <HammerIcon className="h-5 w-5" strokeWidth={1.5} />,
                  title: "Quality",
                  text: "If a material won't outlast its warranty by a decade, it doesn't enter our workshop. Quality is the one cost we don't manage down.",
                },
                {
                  icon: <LeafIcon className="h-5 w-5" strokeWidth={1.5} />,
                  title: "Sustainability",
                  text: "Responsibly forested timber, low-impact finishes, and furniture designed to be repaired rather than replaced.",
                },
                {
                  icon: <InfinityIcon className="h-5 w-5" strokeWidth={1.5} />,
                  title: "Innovation",
                  text: "We test new techniques constantly — but only adopt the ones that make a piece better in twenty years, not just today.",
                },
              ].map((v, i) => (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="group h-full bg-[#F7F4EE] p-9 transition-colors duration-500 hover:bg-[#FCFAF6]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B6F4E]/10 text-[#8B6F4E]">
                      {v.icon}
                    </div>
                    <h3 className="mt-6 font-serif text-xl text-[#1C1A17]">
                      {v.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#3A3530]/80">
                      {v.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. STUDIO / TEAM
         ===================================================================== */}
      <section className="border-y border-[#1C1A17]/10 bg-[#F1ECE2] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <div className="flex justify-center">
                <Eyebrow>The Studio</Eyebrow>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-serif text-4xl text-[#1C1A17] sm:text-5xl">
                The hands behind every piece.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 text-[16px] leading-relaxed text-[#3A3530]/80">
                Aristocraft is a growing team of designers, craftspeople,
                upholsterers, and finishers — all dedicated to the same
                standard of quality that started us. We let the work
                speak for the team.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                role: "Design Studio",
                detail: "Bhawalnagar, Punjab",
                Illustration: IllustrationDiningChair,
              },
              {
                role: "Joinery & Frame",
                detail: "Lahore, Pakistan",
                Illustration: IllustrationShelf,
              },
              {
                role: "Upholstery & Finishing",
                detail: "Karachi, Pakistan",
                Illustration: IllustrationLamp,
              },
            ].map((s, i) => (
              <Reveal key={s.role} delay={i * 100}>
                <div className="group flex h-full flex-col items-center rounded-sm border border-[#1C1A17]/10 bg-[#FCFAF6] px-8 py-12 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(28,26,23,0.35)]">
                  <s.Illustration className="h-28 w-auto text-[#1C1A17] transition-transform duration-500 group-hover:scale-[1.04]" />
                  <h3 className="mt-8 font-serif text-xl text-[#1C1A17]">
                    {s.role}
                  </h3>
                  <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.15em] text-[#8B6F4E]">
                    {s.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. CTA
         ===================================================================== */}
      <section id="collection" className="relative overflow-hidden px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>Visit the Collection</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mx-auto mt-7 max-w-3xl font-serif text-4xl leading-[1.15] text-[#1C1A17] sm:text-5xl lg:text-6xl">
              Some homes are furnished.
              <br />
              <span className="italic text-[#8B6F4E]">Yours could be made.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-7 max-w-xl text-[16px] leading-relaxed text-[#3A3530]/80">
              Browse the full collection, or explore how each piece is
              designed from first sketch to final finish.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-11 flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 bg-[#1C1A17] px-8 py-4 text-[13px] font-medium uppercase tracking-[0.15em] text-[#F7F4EE] transition-colors duration-300 hover:bg-[#8B6F4E]"
              >
                Shop Collection
                <ArrowUpRightIcon
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </Link>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 border border-[#1C1A17]/20 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.15em] text-[#1C1A17] transition-colors duration-300 hover:border-[#1C1A17] hover:bg-[#1C1A17] hover:text-[#F7F4EE]"
              >
                Explore Designs
                <ArrowRightIcon
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* flanking decorative furniture, faint, framing the CTA */}
        <IllustrationSideTable className="pointer-events-none absolute -left-6 bottom-0 hidden h-40 w-auto opacity-[0.08] sm:block lg:left-10" />
        <IllustrationLamp className="pointer-events-none absolute -right-2 bottom-0 hidden h-48 w-auto opacity-[0.08] sm:block lg:right-12" />
      </section>
    </main>
  );
}