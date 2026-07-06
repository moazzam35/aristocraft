"use client";

import { useState, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/store/cart-store";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/types/product";
import Heart from "lucide-react/dist/esm/icons/heart";
import { useWishlistStore } from "@/hooks/store/wishlist-store";
import { useAuthStore } from "@/hooks/store/auth-store";

type ProductCardProps = {
  product: Product;
  index: number;
  showNewBadge?: boolean;
  showDiscountBadge?: boolean;
  rank?: number;
};

const FALLBACK_IMAGE = "/placeholder-product.png";

function ProductCard({
  product,
  index,
  showNewBadge,
  showDiscountBadge,
  rank,
}: ProductCardProps) {
  const { addToCart } = useCartStore();
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const { itemIds, toggleWishlist } = useWishlistStore();
  const [adding, setAdding] = useState(false);

  const isInFav = itemIds.includes(product.id);

  const imageSrc =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : FALLBACK_IMAGE;

  const handleToggleWishlist = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      addToCart(product);
      showToast(`${product.title} added to cart!`, "success");
    } catch {
      showToast("Could not add item to cart.", "error");
    } finally {
      setAdding(false);
    }
  }, [adding, product, addToCart, showToast]);

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className="group relative flex flex-col w-full">
      <div
        className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] overflow-hidden rounded-2xl"
        style={{ backgroundColor: "#F4F0E8" }}
      >
        <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            loading={index < 3 ? "eager" : "lazy"}
          />
        </Link>

        {rank !== undefined ? (
          <div
            className="absolute top-3 left-3 flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
            style={{ backgroundColor: "#fa843e", color: "#fff" }}
          >
            #{rank} Best Seller
          </div>
        ) : showNewBadge ? (
          <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-800 text-white shadow-sm">
            New
          </span>
        ) : showDiscountBadge && hasDiscount ? (
          <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-700 text-white shadow-sm">
            -{product.discountPercentage}%
          </span>
        ) : null}

        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
          aria-label={isInFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            fill={isInFav ? "#fa843e" : "transparent"}
            stroke={isInFav ? "#fa843e" : "#1C1C1C"}
          />
        </button>
      </div>

      <div className="flex flex-col mt-3.5 gap-1.5 px-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] uppercase tracking-widest font-semibold text-neutral-400">
            {product.brand || "Aristocraft"}
          </span>
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="#fa843e">
              <path d="M8 1l2.06 4.34 4.69.6-3.43 3.3.88 4.68L8 11.7l-4.2 2.22.88-4.68L1.25 5.94l4.69-.6L8 1z" />
            </svg>
            <span className="text-xs font-medium text-neutral-600">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className="text-sm font-medium text-neutral-900 leading-snug hover:text-emerald-800 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-neutral-900">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs line-through text-neutral-400">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
          style={{
            backgroundColor: product.stock === 0 ? "#E5E2DC" : "#004B47",
            color: product.stock === 0 ? "#A8A29E" : "#fff",
            cursor: product.stock === 0 || adding ? "not-allowed" : "pointer",
          }}
        >
          {product.stock === 0
            ? "Out of Stock"
            : adding
            ? "Adding…"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
