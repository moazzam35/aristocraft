import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  createdAt: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  hasFetched: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  hasFetched: false,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        set({ user: data.user, isLoading: false, hasFetched: true });
      } else {
        set({ user: null, isLoading: false, hasFetched: true });
      }
    } catch {
      set({ user: null, isLoading: false, hasFetched: true });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout, clear local state regardless
    }
    set({ user: null, hasFetched: true });
  },
}));