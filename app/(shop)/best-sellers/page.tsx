// app/(shop)/best-sellers/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast, ToastProvider } from "@/components/ui/toast";
import type { Product } from "@/types/product";

import SearchBar from "@/components/ui/SearchBar";
import CategoryPills, { CATEGORY_LABELS } from "@/components/ui/CategoryPills";
import SortDropdown, { type SortOption } from "@/components/ui/SortDropdown";
import GridSkeleton from "@/components/ui/GridSkeleton";
import ProductCard from "@/components/ui/ProductCard";

function BestSellersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "");

  useEffect(() => {
    setActiveCategory(searchParams.get("category") ?? "");
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.push(`/best-sellers?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products?limit=200")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        // Filter rating >= 4.7, sort by rating desc by default
        const bestRating = [...(data.products || [])]
          .filter((p) => p.rating >= 4.7)
          .sort((a, b) => b.rating - a.rating);
        setProducts(bestRating);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
        showToast("Failed to load best sellers.", "error");
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const filteredAndSorted = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = [...products];

    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (query) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.color ?? "").toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        // 'featured' keeps the initial rating desc sorting
        return list;
    }
  }, [products, sort, search, activeCategory]);

  return (
    <main className="relative w-full min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24 pb-20 md:pb-28">
        {/* PAGE HEADER */}
        <motion.div
          className="mb-10 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="block text-xs font-medium mb-3"
            style={{ color: "#fa843e", letterSpacing: "0.16em", textTransform: "uppercase" }}
          >
            Best Sellers
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light mb-10 md:mb-12"
            style={{ color: "#1C1C1C", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Top rated,
            <br />
            <span className="font-semibold">customer favourites.</span>
          </h1>

          <SearchBar
            value={search}
            onChange={setSearch}
            resultCount={filteredAndSorted.length}
            loading={loading}
          />
        </motion.div>

        {/* CATEGORY PILLS */}
        <CategoryPills active={activeCategory} onChange={handleCategoryChange} />

        {/* TOOLBAR */}
        <div
          className="flex items-center justify-between mb-8 md:mb-10 pb-5 border-b"
          style={{ borderColor: "#1C1C1C14" }}
        >
          <p className="text-sm font-light" style={{ color: "#1C1C1C99" }}>
            {loading
              ? "Loading…"
              : search.trim()
              ? `${filteredAndSorted.length} ${filteredAndSorted.length === 1 ? "result" : "results"} for "${search.trim()}"`
              : `${filteredAndSorted.length} ${filteredAndSorted.length === 1 ? "best seller" : "best sellers"}`}
          </p>
          <SortDropdown sort={sort} setSort={setSort} open={sortOpen} setOpen={setSortOpen} />
        </div>

        {/* STATES */}
        {loading && <GridSkeleton />}

        {!loading && error && (
          <p className="text-sm py-12 text-center" style={{ color: "#1C1C1C99" }}>
            Couldn&rsquo;t load best sellers right now. Please refresh to try again.
          </p>
        )}

        {!loading && !error && filteredAndSorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full"
              style={{ backgroundColor: "#F4F0E8" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7.5" stroke="#1C1C1C44" strokeWidth="1.8" />
                <path d="M17 17l3.5 3.5" stroke="#1C1C1C44" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-base font-medium" style={{ color: "#1C1C1C" }}>
              No best sellers found
            </p>
            <p className="text-sm" style={{ color: "#1C1C1C66" }}>
              Try adjusting your filters or search keywords
            </p>
            <div className="flex gap-3 mt-1">
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-medium px-5 py-2.5 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: "#F4F0E8", color: "#1C1C1C" }}
                >
                  Clear search
                </button>
              )}
              {activeCategory && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("")}
                  className="text-sm font-medium px-5 py-2.5 rounded-full transition-opacity hover:opacity-80 cursor-pointer text-white"
                  style={{ backgroundColor: "#004B47" }}
                >
                  Show all
                </button>
              )}
            </div>
          </motion.div>
        )}

        {!loading && !error && filteredAndSorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {filteredAndSorted.map((product, i) => {
              // Pass rank={i + 1} only for top 3 items
              const rank = i < 3 ? i + 1 : undefined;
              return <ProductCard key={product.id} product={product} index={i} rank={rank} />;
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function BestSellersPage() {
  return (
    <ToastProvider>
      <BestSellersPageContent />
    </ToastProvider>
  );
}
