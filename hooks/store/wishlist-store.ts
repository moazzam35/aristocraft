import { create } from "zustand";

type WishlistState = {
  itemIds: string[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  itemIds: [],
  loading: false,
  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success) {
        set({ itemIds: data.products.map((p: any) => p.id) });
      }
    } catch (e) {
      console.error("Failed to fetch wishlist:", e);
    } finally {
      set({ loading: false });
    }
  },
  toggleWishlist: async (productId) => {
    const isFav = get().itemIds.includes(productId);
    const method = isFav ? "DELETE" : "POST";
    const url = isFav ? `/api/wishlist?productId=${productId}` : "/api/wishlist";
    const body = isFav ? undefined : JSON.stringify({ productId });

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await res.json();
      if (data.success) {
        set((state) => {
          const newItemIds = isFav
            ? state.itemIds.filter((id) => id !== productId)
            : [...state.itemIds, productId];
          return { itemIds: newItemIds };
        });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Toggle wishlist error:", e);
      return false;
    }
  },
  isInWishlist: (productId) => {
    return get().itemIds.includes(productId);
  },
}));
