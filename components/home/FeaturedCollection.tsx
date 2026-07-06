// components/home/Featuredcollection.tsx
"use client";

import { memo, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";

function shuffle(products: Product[]): Product[] {
  const arr = [...products];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ScrollButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 border ${
        disabled ? "opacity-40 cursor-default" : "cursor-pointer hover:bg-[#004B47] hover:border-[#004B47] hover:text-white"
      }`}
      style={{
        borderColor: disabled ? "#1C1C1C22" : "#1C1C1C22",
        color: disabled ? "#1C1C1C33" : "#1C1C1C",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {direction === "left" ? (
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function RailSkeleton() {
  return (
    <div className="flex gap-5 md:gap-6 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col flex-shrink-0 w-[240px] sm:w-[270px] md:w-[300px]">
          <div className="w-full h-[240px] sm:h-[270px] md:h-[300px] rounded-2xl animate-pulse bg-[#F4F0E8]" />
          <div className="h-3 w-16 rounded-full mt-4 animate-pulse bg-[#F0EDE5]" />
          <div className="h-4 w-3/4 rounded-full mt-2 animate-pulse bg-[#F0EDE5]" />
          <div className="h-8 w-full rounded-lg mt-3 animate-pulse bg-[#F0EDE5]" />
        </div>
      ))}
    </div>
  );
}

function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products?limit=200")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const raw: Product[] = data.products ?? [];
        setProducts(raw.length ? shuffle(raw) : []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [products, updateScrollState]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const distance = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: distance * direction, behavior: "smooth" });
  }, []);

  return (
    <section className="relative w-full py-20 sm:py-24 md:py-32 bg-white">
      <style>{`
        .featured-rail::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 md:mb-16 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-xl">
            <span className="block text-xs font-medium mb-3 text-[#fa843e]" style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Featured Collection
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#1C1C1C]" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Pieces worth
              <br />
              <span className="font-semibold">building a room around.</span>
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <ScrollButton direction="left" onClick={() => scrollByCard(-1)} disabled={!canScrollLeft} />
            <ScrollButton direction="right" onClick={() => scrollByCard(1)} disabled={!canScrollRight} />
          </div>
        </motion.div>

        {loading && <RailSkeleton />}

        {!loading && error && (
          <p className="text-sm text-[#1C1C1C99]">
            Couldn&rsquo;t load the collection right now. Please refresh to try again.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="relative">
            <div
              ref={scrollRef}
              className="featured-rail flex gap-3 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {products.map((product, i) => (
                <div
                  key={product.id}
                  data-card
                  className="flex-shrink-0 snap-start w-[300px] sm:w-[320px] md:w-[340px]"
                >
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>

            {/* Left scroll button */}
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: canScrollLeft ? "#004B47" : "#e5e5e5",
                color: canScrollLeft ? "#fff" : "#aaa",
                cursor: canScrollLeft ? "pointer" : "default",
                pointerEvents: canScrollLeft ? "auto" : "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Right scroll button */}
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: canScrollRight ? "#004B47" : "#e5e5e5",
                color: canScrollRight ? "#fff" : "#aaa",
                cursor: canScrollRight ? "pointer" : "default",
                pointerEvents: canScrollRight ? "auto" : "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(FeaturedCollection);
