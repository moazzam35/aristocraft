// components/ui/SidebarNav.tsx
"use client";

import { memo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import LogIn from "lucide-react/dist/esm/icons/log-in";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import UserIcon from "lucide-react/dist/esm/icons/user";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import X from "lucide-react/dist/esm/icons/x";
import Menu from "lucide-react/dist/esm/icons/menu";
import Minus from "lucide-react/dist/esm/icons/minus";
import Plus from "lucide-react/dist/esm/icons/plus";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Heart from "lucide-react/dist/esm/icons/heart";
import { useCartStore, getSubtotal, getDiscount, getTotal } from "@/hooks/store/cart-store";
import { useAuthStore } from "@/hooks/store/auth-store";
import { useWishlistStore } from "@/hooks/store/wishlist-store";

/* ------------------------------------------------------------------ */
/*  Nav data                                                            */
/* ------------------------------------------------------------------ */

type NavChild = { label: string; href: string; divider?: boolean };
type NavItemType = { label: string; href: string; children?: NavChild[] };

const navItems: NavItemType[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "New In", href: "/new-arrivals" },
      { label: "Sale", href: "/sale" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/*  Custom hook — reactive mobile breakpoint (< 640px)                 */
/* ------------------------------------------------------------------ */

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

/* ------------------------------------------------------------------ */
/*  Custom hook — sticky header on scroll                              */
/* ------------------------------------------------------------------ */

function useIsScrolled(threshold = 12): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > threshold);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}

/* ------------------------------------------------------------------ */
/*  Dropdown — click-to-open, closes on outside click                  */
/* ------------------------------------------------------------------ */

function NavDropdown({ item, isActive }: { item: NavItemType; isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasChildren = !!item.children?.length;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={`relative text-[0.92rem] font-medium tracking-wide transition-colors duration-200 ${
          isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        {item.label}
        {isActive && <span className="absolute -bottom-1.5 left-0 h-px w-full bg-neutral-900" />}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-1 text-[0.92rem] font-medium tracking-wide transition-colors duration-200 ${
          isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
        }`}
        aria-expanded={isOpen}
      >
        {item.label}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          <ChevronDown size={14} strokeWidth={2} />
        </motion.span>
        {isActive && <span className="absolute -bottom-1.5 left-0 h-px w-full bg-neutral-900" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full z-50 mt-4 w-48 -translate-x-1/2 overflow-hidden rounded-2xl border border-neutral-100 bg-white py-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)]"
          >
            {item.children!.map((child, idx) =>
              child.divider ? (
                <div key={`divider-${idx}`} className="my-1 h-px bg-neutral-100" />
              ) : (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-[0.85rem] text-neutral-600 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900"
                >
                  {child.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile nav item — accordion style inside the slide-out drawer      */
/* ------------------------------------------------------------------ */

function MobileNavItem({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItemType;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`flex items-center justify-between border-b border-neutral-100 py-4 text-[1rem] font-medium ${
          isActive ? "text-neutral-900" : "text-neutral-500"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`flex w-full items-center justify-between py-4 text-[1rem] font-medium ${
          isActive ? "text-neutral-900" : "text-neutral-600"
        }`}
        aria-expanded={isOpen}
      >
        {item.label}
        <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={16} className="text-neutral-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pb-4 pl-3">
              {item.children!.map((child, idx) =>
                child.divider ? (
                  <div key={`divider-${idx}`} className="my-1 h-px bg-neutral-100" />
                ) : (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className="text-[0.9rem] text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
                  >
                    {child.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Icon action                                                         */
/* ------------------------------------------------------------------ */

function IconAction({
  icon: Icon,
  count,
  label,
  className = "",
  onClick,
}: {
  icon: typeof ShoppingBag;
  count?: number;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors duration-200 hover:text-neutral-900 sm:h-9 sm:w-9 ${className}`}
    >
      <Icon size={17} strokeWidth={1.6} className="sm:hidden" />
      <Icon size={19} strokeWidth={1.6} className="hidden sm:block" />
      {typeof count === "number" && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[0.6rem] font-medium text-white">
          {count}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Login button — desktop header + mobile drawer only                 */
/* ------------------------------------------------------------------ */

function LoginButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/login"
      aria-label="Login"
      className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.85rem] font-medium text-white transition-opacity duration-200 hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-[0.9rem] ${className}`}
      style={{ backgroundColor: "#004b47" }}
    >
      <LogIn size={17} strokeWidth={1.8} />
      Login
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  User menu — desktop dropdown showing name + account/orders/logout  */
/* ------------------------------------------------------------------ */

function UserMenu({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-[0.85rem] font-medium text-white transition-opacity duration-200 hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-[0.9rem]"
        style={{ backgroundColor: "#004b47" }}
      >
        {user.avatar && user.avatar.trim() !== "" ? (
          <Image
            src={user.avatar}
            alt={firstName}
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
        ) : (
          <UserIcon size={17} strokeWidth={1.8} />
        )}
        {firstName}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-50 mt-4 w-52 overflow-hidden rounded-2xl border border-neutral-100 bg-white py-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)]"
          >
            <div className="border-b border-neutral-100 px-4 py-3">
              <p className="text-[0.85rem] font-semibold text-neutral-900">{user.name}</p>
              <p className="truncate text-[0.76rem] text-neutral-400">{user.email}</p>
            </div>

            {(user.role === "ADMIN" || user.role === "STAFF") && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-[0.85rem] text-neutral-600 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-[0.85rem] text-neutral-600 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900"
            >
              My Account
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-[0.85rem] text-neutral-600 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900"
            >
              My Orders
            </Link>

            <div className="my-1 h-px bg-neutral-100" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[0.85rem] text-red-600 transition-colors duration-150 hover:bg-red-50"
            >
              <LogOut size={15} strokeWidth={1.8} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile drawer auth section — name + logout, or login button        */
/* ------------------------------------------------------------------ */

function MobileAuthSection({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) {
    return <LoginButton />;
  }

  async function handleLogout() {
    onNavigate();
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-[0.85rem] font-medium text-neutral-800"
      >
        <UserIcon size={16} strokeWidth={1.8} />
        {user.name.split(" ")[0]}
      </Link>
      <button
        onClick={handleLogout}
        aria-label="Logout"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cart panel content — shared between dropdown and modal             */
/* ------------------------------------------------------------------ */

const CART_FALLBACK_IMAGE = "/placeholder-product.png";

function CartPanelContent({ onClose }: { onClose: () => void }) {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = getSubtotal(items);
  const discount = getDiscount(items);
  const total = getTotal(items);

  return (
    <>
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <span className="text-[0.95rem] font-semibold text-neutral-900">
          Your Cart {count > 0 && <span className="text-neutral-400">({count})</span>}
        </span>
        <button
          onClick={onClose}
          aria-label="Close cart"
          className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
        >
          <X size={14} />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-5 py-12 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-50 text-neutral-400">
            <ShoppingBag size={24} strokeWidth={1.4} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">Your cart is empty</p>
            <p className="text-xs text-neutral-400 mt-1">Looks like you haven't added anything yet.</p>
          </div>
          <Link
            href="/shop"
            onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#004B47" }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex max-h-[340px] flex-col gap-4 overflow-y-auto px-5 py-4">
          {items.map((item) => {
            const itemDiscountedPrice = item.price * (1 - item.discountPercentage / 100);
            const itemHasDiscount = item.discountPercentage > 0;
            const itemImageSrc =
              item.imageUrl && item.imageUrl.trim() !== ""
                ? item.imageUrl
                : CART_FALLBACK_IMAGE;
            return (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={itemImageSrc}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover p-0"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[0.85rem] font-medium leading-tight text-neutral-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[0.74rem] text-neutral-400">{item.brand}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title}`}
                      className="shrink-0 text-neutral-300 transition-colors hover:text-neutral-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-5 w-5 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-4 text-center text-[0.78rem] text-neutral-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-5 w-5 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      {itemHasDiscount ? (
                        <>
                          <span className="text-[0.85rem] font-semibold text-neutral-900">
                            ${(itemDiscountedPrice * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-[0.7rem] line-through text-neutral-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[0.85rem] font-semibold text-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50">
          {/* Free Shipping Progress Bar */}
          {(() => {
            const FREE_SHIPPING_THRESHOLD = 100;
            const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
            const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
            return (
              <div className="mb-4 p-3 rounded-xl bg-white border border-neutral-100">
                {remaining > 0 ? (
                  <p className="text-[11px] text-neutral-500 mb-2">
                    Spend <span className="font-semibold text-neutral-800">${remaining.toFixed(2)}</span> more for{" "}
                    <span className="font-semibold text-emerald-700">free shipping</span>
                  </p>
                ) : (
                  <p className="text-[11px] font-semibold text-emerald-700 mb-2">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: remaining === 0 ? "#004B47" : "#fa843e",
                    }}
                  />
                </div>
              </div>
            );
          })()}

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between text-[0.85rem]">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-[0.85rem]">
                <span className="text-neutral-500">Discount</span>
                <span className="font-medium text-red-600">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[0.9rem] font-semibold border-t border-neutral-200/60 pt-2">
              <span className="text-neutral-900">Total</span>
              <span className="text-neutral-900">${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full px-5 py-2.5 text-[0.82rem] font-medium text-white transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: "#004B47" }}
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Cart — dropdown on desktop, centered modal on mobile               */
/* ------------------------------------------------------------------ */

function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { items } = useCartStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  // Desktop: close on outside click
  useEffect(() => {
    if (isMobile) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Mobile: lock body scroll while modal is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isOpen]);

  // Escape key closes both
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const triggerButton = (
    <button
      onClick={() => setIsOpen((v) => !v)}
      aria-label="Cart"
      aria-expanded={isOpen}
      className="relative flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors duration-200 hover:text-neutral-900 sm:h-9 sm:w-9"
    >
      <ShoppingBag size={17} strokeWidth={1.6} className="sm:hidden" />
      <ShoppingBag size={19} strokeWidth={1.6} className="hidden sm:block" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[0.6rem] font-medium text-white">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <>
      {/* ── Desktop dropdown ── */}
      <div ref={dropdownRef} className="relative hidden sm:block">
        {triggerButton}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full z-50 mt-4 w-[20rem] origin-top-right overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.25)] sm:w-[22rem]"
            >
              <CartPanelContent onClose={() => setIsOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile trigger + centered modal ── */}
      <div className="relative sm:hidden">
        {triggerButton}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="cart-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm"
                aria-hidden="true"
              />
              <motion.div
                key="cart-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Your cart"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.35)]"
              >
                <CartPanelContent onClose={() => setIsOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Logo                                                                */
/* ------------------------------------------------------------------ */

function Logo() {
  return (
    <Link href="/" className="shrink-0">
      <span className="inline-flex items-center font-serif text-[1.25rem] italic font-bold tracking-[0.04em] text-neutral-900 sm:text-[1.45rem] md:text-[1.6rem]">
        <Image
          src="/logo/logo.png"
          alt=""
          width={30}
          height={30}
          className="inline-block"
          style={{ height: "1.9em", width: "auto", margin: 0, padding: 0, verticalAlign: "baseline" }}
        />
        ristocraft
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingHeader                                                      */
/* ------------------------------------------------------------------ */

const FloatingHeader = memo(function FloatingHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCartStore();
  const { user, fetchUser } = useAuthStore();
  const { itemIds, fetchWishlist } = useWishlistStore();
  const mobileCartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = itemIds.length;
  const isScrolled = useIsScrolled();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-30 px-3 pt-4 transition-all duration-300 sm:px-6 sm:pt-5 md:px-8 md:pt-6 ${
        isScrolled ? "pt-2 sm:pt-3 md:pt-3" : ""
      }`}
    >
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full bg-white px-4 py-2.5 transition-shadow duration-300 sm:gap-6 sm:px-6 sm:py-3 md:px-8 md:py-3.5 ${
          isScrolled
            ? "shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3)]"
            : "shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]"
        }`}
      >
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex lg:gap-9">
          {navItems.map((item) => (
            <NavDropdown key={item.label} item={item} isActive={pathname === item.href} />
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <Link href="/account/wishlist" aria-label="Wishlist">
            <button
              className="relative flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors duration-200 hover:text-neutral-900 sm:h-9 sm:w-9"
              tabIndex={-1}
            >
              <Heart size={17} strokeWidth={1.6} className="sm:hidden" />
              <Heart size={19} strokeWidth={1.6} className="hidden sm:block" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[0.6rem] font-medium text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          </Link>
          <CartDropdown />

          {/* Login / User menu — desktop only, never shown on mobile */}
          {user ? (
            <UserMenu className="hidden sm:block" />
          ) : (
            <LoginButton className="hidden sm:flex" />
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="ml-1 flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors duration-200 hover:text-neutral-900 sm:h-9 sm:w-9 lg:hidden"
          >
            <Menu size={19} strokeWidth={1.6} />
          </button>
        </div>
      </motion.header>

      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex h-screen w-full max-w-xs flex-col bg-white px-6 py-6 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between pb-4">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col overflow-y-auto">
                {navItems.map((item) => (
                  <MobileNavItem
                    key={item.label}
                    item={item}
                    isActive={pathname === item.href}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </nav>

              {/* Drawer footer — cart + login/user only */}
              <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                <Link href="/account/wishlist" aria-label="Wishlist">
                  <button
                    className="relative flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors duration-200 hover:text-neutral-900 sm:h-9 sm:w-9"
                    tabIndex={-1}
                  >
                    <Heart size={17} strokeWidth={1.6} className="sm:hidden" />
                    <Heart size={19} strokeWidth={1.6} className="hidden sm:block" />
                    {wishlistCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[0.6rem] font-medium text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </Link>
                <IconAction icon={ShoppingBag} count={mobileCartCount} label="Cart" />
                <MobileAuthSection onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export default FloatingHeader;