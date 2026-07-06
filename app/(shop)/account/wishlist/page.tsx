"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import HeartIcon from "lucide-react/dist/esm/icons/heart";
import ShoppingBagIcon from "lucide-react/dist/esm/icons/shopping-bag";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/hooks/store/wishlist-store";
import { useCartStore } from "@/hooks/store/cart-store";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/types/product";

export default function WishlistPage() {
  const { itemIds, fetchWishlist, toggleWishlist, loading } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { showToast } = useToast();

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    if (itemIds.length === 0) {
      setWishlistProducts([]);
      return;
    }
    let cancelled = false;
    setLoadingProducts(true);
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) setWishlistProducts(data.products);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => { cancelled = true; };
  }, [itemIds.length]);

  const handleRemove = async (productId: string, title: string) => {
    await toggleWishlist(productId);
    showToast(`${title} removed from wishlist.`, "success");
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(`${product.title} added to cart!`, "success");
  };

  const isEmpty = !loading && !loadingProducts && itemIds.length === 0;
  const isLoading = loading || (loadingProducts && itemIds.length > 0);

  return (
    <main className="relative w-full min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-16 pt-20 sm:pt-24 md:pt-28 pb-20 md:pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-2">
              Your Collection
            </p>
            <h1
              className="text-3xl sm:text-4xl font-light text-neutral-900"
              style={{ letterSpacing: "-0.025em" }}
            >
              Wishlist
              {itemIds.length > 0 && (
                <span className="ml-3 text-lg text-neutral-400 font-light">
                  ({itemIds.length})
                </span>
              )}
            </h1>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeftIcon size={14} />
            Continue Shopping
          </Link>
        </div>

        {/* Empty State */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center gap-4"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: "#F0EDE6" }}
            >
              <HeartIcon size={28} strokeWidth={1.5} className="text-neutral-400" />
            </div>
            <p className="text-lg font-light text-neutral-800">Your wishlist is empty</p>
            <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
              Save pieces you love and come back to them whenever you&apos;re ready.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#004B47" }}
            >
              Explore Collection
            </Link>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-neutral-100 h-80" />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && wishlistProducts.length > 0 && (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product, i) => {
                const discounted = product.price * (1 - product.discountPercentage / 100);
                const hasDiscount = product.discountPercentage > 0;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="group relative rounded-2xl overflow-hidden border bg-white"
                    style={{ borderColor: "#1C1C1C0D" }}
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block relative aspect-[4/3] overflow-hidden bg-neutral-50"
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {hasDiscount && (
                        <span
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: "#fa843e" }}
                        >
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          {product.brand}
                        </p>
                        <p className="text-sm font-medium text-neutral-900 leading-snug mb-2 hover:text-[#004B47] transition-colors line-clamp-2">
                          {product.title}
                        </p>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-base font-semibold text-neutral-900">
                          ${discounted.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs line-through text-neutral-400">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                          style={{ backgroundColor: "#004B47" }}
                        >
                          <ShoppingBagIcon size={13} />
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => handleRemove(product.id, product.title)}
                          className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <HeartIcon size={15} fill="#fa843e" stroke="#fa843e" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
