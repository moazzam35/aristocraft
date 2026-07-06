"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Heart from "lucide-react/dist/esm/icons/heart";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
import CreditCard from "lucide-react/dist/esm/icons/credit-card";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { useCartStore } from "@/hooks/store/cart-store";
import { useAuthStore } from "@/hooks/store/auth-store";
import { useWishlistStore } from "@/hooks/store/wishlist-store";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import ProductGallery from "@/components/products/ProductGallery";
import ReviewSection from "@/components/products/ReviewSection";

type ProductPageClientProps = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { itemIds, toggleWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : null
  );

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aristocraft_recently_viewed");
      let list: Product[] = stored ? JSON.parse(stored) : [];
      list = list.filter((p) => p.id !== product.id);
      list.unshift(product);
      list = list.slice(0, 5);
      localStorage.setItem("aristocraft_recently_viewed", JSON.stringify(list));
      setRecentlyViewed(list.filter((p) => p.id !== product.id));
    } catch (e) {
      console.error("Failed to update recently viewed:", e);
    }
  }, [product]);

  const isInFav = itemIds.includes(product.id);

  const handleToggleWishlist = useCallback(async () => {
    if (!user) {
      showToast("Please log in to manage your wishlist.", "error");
      return;
    }
    const success = await toggleWishlist(product.id);
    if (success) {
      showToast(isInFav ? "Removed from wishlist." : "Added to wishlist.", "success");
    } else {
      showToast("Failed to update wishlist.", "error");
    }
  }, [user, product.id, toggleWishlist, showToast, isInFav]);

  const handleAddToCart = useCallback(async () => {
    if (product.stock === 0 || adding) return;
    setAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({ ...product, color: selectedColor || product.color });
      }
      showToast(`${product.title} (${quantity}) added to cart!`, "success");
    } catch {
      showToast("Could not add to cart.", "error");
    } finally {
      setAdding(false);
    }
  }, [product, quantity, selectedColor, adding, addToCart, showToast]);

  const handleBuyNow = useCallback(async () => {
    if (product.stock === 0 || buying) return;
    setBuying(true);
    try {
      addToCart({ ...product, color: selectedColor || product.color });
      router.push("/checkout");
    } catch {
      showToast("Could not process Buy Now request.", "error");
      setBuying(false);
    }
  }, [product, selectedColor, buying, addToCart, router, showToast]);

  const discounted = useMemo(
    () => product.price * (1 - product.discountPercentage / 100),
    [product.price, product.discountPercentage]
  );

  const hasDiscount = product.discountPercentage > 0;

  const stockStatus = useMemo(() => {
    const stock = product.stock ?? 0;
    if (stock === 0) {
      return (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-red-800 bg-red-50 border border-red-200">
          Out of Stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-amber-800 bg-amber-50 border border-amber-200">
          Only {stock} left!
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-800 bg-emerald-50 border border-emerald-200">
        In Stock
      </span>
    );
  }, [product.stock]);

  return (
    <main className="relative w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24 pb-20 md:pb-28">
        <div className="flex items-center gap-2 text-xs mb-8 md:mb-12 text-neutral-400">
          <Link href="/shop" className="hover:text-neutral-900 transition-colors">
            Shop
          </Link>
          <ChevronRight size={10} />
          <span className="capitalize text-neutral-600">{product.category}</span>
          <ChevronRight size={10} />
          <span className="text-neutral-900 font-medium">{product.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <ProductGallery images={product.images || [product.imageUrl]} title={product.title} />
          </div>

          <div className="flex-1 flex flex-col">
            <span
              className="text-xs font-bold mb-3 tracking-wider uppercase"
              style={{ color: "#fa843e" }}
            >
              {product.brand}
            </span>

            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 text-neutral-900"
              style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="#fa843e">
                  <path d="M8 1l2.06 4.34 4.69.6-3.43 3.3.88 4.68L8 11.7l-4.2 2.22.88-4.68L1.25 5.94l4.69-.6L8 1z" />
                </svg>
                <span className="text-sm font-semibold text-neutral-900">
                  {product.rating.toFixed(1)}
                </span>
                {product.reviewCount > 0 && (
                  <span className="text-xs text-neutral-400">({product.reviewCount} reviews)</span>
                )}
              </div>
              {stockStatus}
            </div>

            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#1C1C1C14]">
              <span className="text-2xl sm:text-3xl font-semibold text-neutral-900">
                ${discounted.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-base line-through text-neutral-400">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm font-light text-neutral-500 mb-6 leading-relaxed">
              {product.description}
            </p>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-semibold text-neutral-700 block mb-2.5 uppercase tracking-wide">
                  Color Swatch: {selectedColor}
                </span>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                        selectedColor === c.name ? "border-emerald-800 scale-110 shadow-sm" : "border-neutral-200 hover:border-neutral-400"
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full block border"
                        style={{
                          backgroundColor: c.hex || "#CCCCCC",
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.stock !== 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-neutral-800">Quantity</span>
                <div className="flex items-center rounded-full border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 flex items-center justify-center text-lg font-light text-neutral-500 hover:text-neutral-900"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock ?? 10, q + 1))}
                    aria-label="Increase quantity"
                    className="w-9 h-9 flex items-center justify-center text-lg font-light text-neutral-500 hover:text-neutral-900"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border text-white"
                style={{
                  backgroundColor: "#004B47",
                  borderColor: "#004B47",
                  opacity: product.stock === 0 ? 0.4 : adding ? 0.75 : 1,
                  cursor: product.stock === 0 || adding ? "not-allowed" : "pointer",
                }}
              >
                {adding ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin">
                      <circle cx="12" cy="12" r="9" stroke="#ffffff40" strokeWidth="2.5" />
                      <path d="M21 12a9 9 0 00-9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    Adding…
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === 0 || buying}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border text-white"
                style={{
                  backgroundColor: "#fa843e",
                  borderColor: "#fa843e",
                  opacity: product.stock === 0 ? 0.4 : buying ? 0.75 : 1,
                  cursor: product.stock === 0 || buying ? "not-allowed" : "pointer",
                }}
              >
                {buying ? "Processing…" : (
                  <>
                    <CreditCard size={14} />
                    Buy Now
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className="w-12 flex-shrink-0 flex items-center justify-center border border-neutral-300 rounded-full hover:bg-neutral-50 active:scale-95 transition-all"
                aria-label="Add to Wishlist"
              >
                <Heart
                  size={18}
                  fill={isInFav ? "#fa843e" : "transparent"}
                  stroke={isInFav ? "#fa843e" : "currentColor"}
                  className={isInFav ? "text-[#fa843e]" : "text-neutral-500"}
                />
              </button>
            </div>

            {(product.material || product.dimensions || product.weight) && (
              <div className="border-t py-6 border-[#1C1C1C14]">
                <p className="text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-3">Specifications</p>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
                  {product.material && (
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-400 font-medium">MATERIAL</span>
                      <span className="text-neutral-800 mt-0.5 font-light">{product.material}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-400 font-medium">DIMENSIONS</span>
                      <span className="text-neutral-800 mt-0.5 font-light">{product.dimensions}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-400 font-medium">WEIGHT</span>
                      <span className="text-neutral-800 mt-0.5 font-light">{product.weight} kg</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <ReviewSection productId={product.id} currentUser={user} />

        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#1C1C1C14]">
            <h2 className="text-xl sm:text-2xl font-light mb-8 text-neutral-900 font-serif">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#1C1C1C14]">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-light text-neutral-900 font-serif">Recently Viewed</h2>
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("recently-viewed-rail");
                    if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                  }}
                  aria-label="Scroll left"
                  className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors cursor-pointer border-[#1C1C1C1F] text-[#1C1C1C] hover:border-[#1C1C1C] hover:bg-[#1C1C1C05]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("recently-viewed-rail");
                    if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                  }}
                  aria-label="Scroll right"
                  className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors cursor-pointer border-[#1C1C1C1F] text-[#1C1C1C] hover:border-[#1C1C1C] hover:bg-[#1C1C1C05]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              id="recently-viewed-rail"
              className="flex gap-5 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-none"
            >
              {recentlyViewed.map((p, i) => (
                <div key={p.id} className="flex-shrink-0 snap-start w-[260px] sm:w-[280px] md:w-[300px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
