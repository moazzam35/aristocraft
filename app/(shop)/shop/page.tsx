// app/(shop)/shop/page.tsx
"use client";

import { memo, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/types/product";

import SearchBar from "@/components/ui/SearchBar";
import CategoryPills, { CATEGORY_LABELS } from "@/components/ui/CategoryPills";
import SortDropdown, { type SortOption } from "@/components/ui/SortDropdown";
import GridSkeleton from "@/components/ui/GridSkeleton";
import ProductCard from "@/components/ui/ProductCard";

const PRODUCTS_PER_PAGE = 9;

function shuffle(products: Product[]): Product[] {
  const arr = [...products];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "");

  useEffect(() => {
    setActiveCategory(searchParams.get("category") ?? "");
  }, [searchParams]);

  const handleCategoryChange = useCallback((cat: string) => {
    setPage(1);
    setActiveCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[aria-label="Search products"]')?.focus();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products?limit=200")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
        showToast("Failed to load products. Please reload.", "error");
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
        return list;
    }
  }, [products, sort, search, activeCategory]);

  const interleaved = useMemo(() => {
    if (activeCategory) return filteredAndSorted;
    return shuffle(filteredAndSorted);
  }, [filteredAndSorted, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(interleaved.length / PRODUCTS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    return interleaved.slice(start, start + PRODUCTS_PER_PAGE);
  }, [interleaved, page]);

  const pageTitle = activeCategory ? CATEGORY_LABELS[activeCategory] ?? activeCategory : null;

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const handleGoToPage = useCallback((p: number) => {
    setPage(p);
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24 pb-20 md:pb-28">
        {/* PAGE HEADER */}
        <div className="mb-10 md:mb-14 animate-fade-in">
          <span className="block text-xs font-medium mb-3 text-[#fa843e]" style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Shop
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-10 md:mb-12 text-[#1C1C1C]" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            {pageTitle ? (
              <>
                {pageTitle},
                <br />
                <span className="font-semibold">all in one place.</span>
              </>
            ) : (
              <>
                Every piece,
                <br />
                <span className="font-semibold">all in one place.</span>
              </>
            )}
          </h1>
          <SearchBar value={search} onChange={handleSearch} resultCount={filteredAndSorted.length} loading={loading} />
        </div>

        <CategoryPills active={activeCategory} onChange={handleCategoryChange} />

        <div className="flex items-center justify-between mb-8 md:mb-10 pb-5 border-b border-[#1C1C1C14]">
          <p className="text-sm font-light text-[#1C1C1C99]">
            {loading
              ? "Loading…"
              : search.trim()
              ? `${filteredAndSorted.length} ${filteredAndSorted.length === 1 ? "result" : "results"} for "${search.trim()}"`
              : `${filteredAndSorted.length} ${filteredAndSorted.length === 1 ? "product" : "products"}`}
          </p>
          <SortDropdown sort={sort} setSort={setSort} open={sortOpen} setOpen={setSortOpen} />
        </div>

        {loading && <GridSkeleton />}

        {!loading && error && (
          <p className="text-sm py-12 text-center text-[#1C1C1C99]">
            Couldn&rsquo;t load products right now. Please refresh to try again.
          </p>
        )}

        {!loading && !error && interleaved.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F4F0E8]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7.5" stroke="#1C1C1C44" strokeWidth="1.8" />
                <path d="M17 17l3.5 3.5" stroke="#1C1C1C44" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-base font-medium text-[#1C1C1C]">No products found</p>
            <p className="text-sm text-[#1C1C1C66]">Try a different keyword or clear your filters</p>
            <div className="flex gap-3 mt-1">
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="text-sm font-medium px-5 py-2.5 rounded-full transition-opacity hover:opacity-80 cursor-pointer bg-[#F4F0E8] text-[#1C1C1C]"
                >
                  Clear search
                </button>
              )}
              {activeCategory && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("")}
                  className="text-sm font-medium px-5 py-2.5 rounded-full transition-opacity hover:opacity-80 cursor-pointer text-white bg-[#004B47]"
                >
                  Show all
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && interleaved.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
              {paginatedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16 md:mt-20">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-30 cursor-pointer disabled:cursor-default hover:border-[#1C1C1C] hover:bg-[#1C1C1C05]"
                  style={{ color: "#1C1C1C", border: "1px solid #1C1C1C1F", backgroundColor: "transparent" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleGoToPage(p)}
                      className="w-8 h-8 rounded-full text-sm font-medium transition-all cursor-pointer"
                      style={{
                        backgroundColor: p === page ? "#004B47" : "transparent",
                        color: p === page ? "#fff" : "#1C1C1C99",
                        border: p === page ? "none" : "1px solid #1C1C1C1F",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-30 cursor-pointer disabled:cursor-default hover:border-[#1C1C1C] hover:bg-[#1C1C1C05]"
                  style={{ color: "#1C1C1C", border: "1px solid #1C1C1C1F", backgroundColor: "transparent" }}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default memo(ShopPage);
