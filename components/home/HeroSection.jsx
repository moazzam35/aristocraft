"use client";

import { memo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArchwayOutline,
  SofaContour,
  LampOutlineLarge,
  CornerBracket,
  SweepArc,
  Armchair,
} from "./Herodecor";

const SLIDES = [
  { image: "/images/1.jpg", bg: "#3D2B1F", name: "Walnut" },
  { image: "/images/2.jpg", bg: "#8C5A3C", name: "Clay" },
  { image: "/images/3.jpg", bg: "#5C4A38", name: "Bark" },
  { image: "/images/4.jpg", bg: "#2E3B2F", name: "Moss" },
  { image: "/images/5.jpg", bg: "#6B4226", name: "Cedar" },
];

const LINEN = "#F5EFE6";
const GOLD = "#C9A467";
const SLIDE_DURATION = 5200;
const TRANSITION_DURATION = 0.9;
const BG_TRANSITION_DURATION = 1.2;

function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [bgColor, setBgColor] = useState(SLIDES[0].bg);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const touchStartX = useRef(null);

  const goToNext = useCallback(() => {
    setCurrent((prev) => {
      const next = (prev + 1) % SLIDES.length;
      setBgColor(SLIDES[next].bg);
      return next;
    });
    setProgressKey((k) => k + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrent((prev) => {
      const next = (prev - 1 + SLIDES.length) % SLIDES.length;
      setBgColor(SLIDES[next].bg);
      return next;
    });
    setProgressKey((k) => k + 1);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
    setBgColor(SLIDES[index].bg);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(goToNext, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goToNext, paused]);

  useEffect(() => {
    setBgColor(SLIDES[0].bg);
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goToNext() : goToPrev();
    }
    touchStartX.current = null;
  }, [goToNext, goToPrev]);

  return (
    <section
      className="relative w-full min-h-screen md:h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .hero-serif { font-family: 'Fraunces', Georgia, serif; }
        .hero-sans  { font-family: 'Inter', -apple-system, sans-serif; }
        .hero-btn {
          position: relative; display: inline-flex; align-items: center;
          justify-content: center; gap: 12px; font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
          padding: 14px 44px; border-radius: 6px; overflow: hidden;
          isolation: isolate; cursor: pointer; white-space: nowrap;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-btn-primary {
          background: ${LINEN}; color: #1A1008;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .hero-btn-primary:hover {
          background: #ffffff; transform: translateY(-3px);
          box-shadow: 0 12px 32px -8px rgba(0,0,0,0.4);
        }
        .hero-btn-primary::after {
          content: ''; position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(135deg, transparent 40%, rgba(201,164,103,0.25) 100%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .hero-btn-primary:hover::after { opacity: 1; }
        .hero-btn-arrow {
          display: inline-flex; align-items: center; font-size: 14px;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-btn:hover .hero-btn-arrow { transform: translateX(4px) scale(1.1); }
        .hero-btn:active { transform: translateY(-1px) scale(0.98); }
        .hero-btn:focus-visible { outline: 2px solid ${LINEN}; outline-offset: 3px; }
      `}</style>

      {/* Background panels */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-0"
        style={{
          height: "100%",
          backgroundColor: bgColor,
          transition: `background-color ${BG_TRANSITION_DURATION}s cubic-bezier(0.4,0,0.2,1)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-0 hidden sm:block"
        style={{ height: "20%", backgroundColor: LINEN }}
      />

      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-noise opacity-50"
      />

      {/* Decorative elements */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-4 top-20 sm:left-10 sm:top-28 md:left-16 md:top-20 z-[1]">
          <CornerBracket
            className="opacity-[0.35]"
            style={{
              color: GOLD,
              width: "clamp(32px, 5vw, 64px)",
              height: "clamp(32px, 5vw, 64px)",
            }}
          />
        </div>

        <motion.div
          className="absolute -left-16 sm:-left-20 md:-left-24 bottom-0 z-[1]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArchwayOutline
            style={{
              color: LINEN,
              width: "clamp(120px, 22vw, 340px)",
              height: "clamp(200px, 38vw, 580px)",
              opacity: 0.22,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute right-2 sm:right-10 md:right-20 -top-4 z-[1]"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <LampOutlineLarge
            style={{
              color: LINEN,
              width: "clamp(40px, 8vw, 128px)",
              height: "clamp(100px, 20vw, 420px)",
              opacity: 0.24,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute -right-10 sm:-right-16 -bottom-6 sm:-bottom-10 z-[1] hidden sm:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        >
          <SofaContour
            style={{
              color: LINEN,
              width: "clamp(200px, 40vw, 600px)",
              height: "clamp(90px, 18vw, 280px)",
              opacity: 0.2,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-1/3 -translate-y-1/4 z-[1]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <Armchair
            style={{
              color: LINEN,
              width: "clamp(80px, 14vw, 200px)",
              height: "clamp(74px, 13vw, 185px)",
              opacity: 0.2,
            }}
          />
        </motion.div>

        <div className="absolute left-0 right-0 bottom-0 z-0 hidden sm:block">
          <SweepArc
            className="w-full opacity-[0.16]"
            style={{ color: LINEN, height: "clamp(48px, 8vw, 160px)" }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-0 pb-10 md:pb-0 h-full flex flex-col md:flex-row md:items-center">

        {/* 1. TEXT */}
        <motion.div
          className="flex flex-col flex-shrink-0 w-full md:max-w-sm lg:max-w-md z-10 text-center md:text-left items-center md:items-start order-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 mb-3 md:mb-7" aria-hidden="true">
            <span
              style={{
                width: "34px",
                height: "1px",
                background: `linear-gradient(to right, transparent, ${GOLD})`,
              }}
            />
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: GOLD,
              }}
            />
          </div>

          <h1
            className="hero-serif mb-0 md:mb-12"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: LINEN,
              fontWeight: 380,
            }}
          >
            Elevate every
            <br />
            <span
              className="italic"
              style={{
                fontWeight: 400,
                background: `linear-gradient(100deg, ${LINEN} 35%, ${GOLD} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              corner
            </span>{" "}
            of your
            <br />
            home.
          </h1>

          {/* Desktop buttons */}
          <div className="hidden md:flex flex-row items-center gap-5 mt-24">
            <Link href="/shop" className="hero-btn hero-btn-primary hero-sans group">
              <span className="hero-btn-sheen" aria-hidden="true" />
              <span className="relative z-10">Discover Luxury</span>
              <span className="relative z-10 hero-btn-arrow">→</span>
            </Link>
          </div>
        </motion.div>

        {/* 2. IMAGE */}
        <div className="relative w-full order-2 h-[40vh] min-h-[260px] -mt-4 sm:-mt-6 md:mt-0 md:absolute md:right-0 md:top-0 md:h-full md:w-[72%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0 flex items-end justify-center"
              initial={{ opacity: 0, x: 60, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.97 }}
              transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={SLIDES[current].image}
                  alt={`${SLIDES[current].name} collection`}
                  fill
                  priority={current === 0}
                  className="object-contain object-bottom"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. MOBILE BUTTONS */}
        <div className="flex md:hidden flex-col items-center gap-3 order-3 mt-16 w-full z-10">
          <Link
            href="/shop"
            className="hero-btn hero-btn-primary hero-sans group w-full max-w-[280px]"
          >
            <span className="hero-btn-sheen" aria-hidden="true" />
            <span className="relative z-10">Discover Luxury</span>
            <span className="relative z-10 hero-btn-arrow">→</span>
          </Link>
        </div>
      </div>

    </section>
  );
}

export default memo(HeroSection);
