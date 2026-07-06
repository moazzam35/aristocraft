"use client";

import { memo, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuIcon from "lucide-react/dist/esm/icons/menu";
import XIcon from "lucide-react/dist/esm/icons/x";
import LayoutDashboardIcon from "lucide-react/dist/esm/icons/layout-dashboard";
import HomeIcon from "lucide-react/dist/esm/icons/home";
import PackageIcon from "lucide-react/dist/esm/icons/package";
import ShoppingBagIcon from "lucide-react/dist/esm/icons/shopping-bag";
import UsersIcon from "lucide-react/dist/esm/icons/users";
import ShieldIcon from "lucide-react/dist/esm/icons/shield";
import LogOutIcon from "lucide-react/dist/esm/icons/log-out";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboardIcon; adminOnly?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin", label: "Admin", icon: ShieldIcon, adminOnly: true },
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/products", label: "Products", icon: PackageIcon },
  { href: "/orders", label: "Orders", icon: ShoppingBagIcon },
  { href: "/users", label: "Users", icon: UsersIcon, adminOnly: true },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUserRole(data.user.role);
      })
      .catch(() => {});
  }, []);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || userRole === "ADMIN"
  );

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
    router.refresh();
  }, [router]);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((v) => !v);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#004b47]/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex flex-col leading-none shrink-0">
          <span className="font-serif text-lg font-semibold tracking-tight text-[#004b47]">
            Aristocraft
          </span>
          <span className="mt-px font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#C76F4D]">
            {userRole === "ADMIN" ? "Admin" : userRole === "STAFF" ? "Staff" : "Dashboard"}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-0.5">
          {visibleItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#004b47]/8 text-[#004b47]"
                    : "text-[#004b47]/50 hover:bg-[#004b47]/5 hover:text-[#004b47]"
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2 : 1.6} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Sign out"
            className="hidden md:inline-flex items-center gap-2 rounded-lg border border-[#004b47]/15 px-4 py-2 text-sm font-medium text-[#004b47]/60 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-[0.97] disabled:opacity-50"
          >
            <LogOutIcon size={15} strokeWidth={1.6} />
            <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
          </button>

          <button
            type="button"
            onClick={handleMobileToggle}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#004b47]/50 transition-colors hover:bg-[#004b47]/8 hover:text-[#004b47] md:hidden"
          >
            {mobileOpen ? <XIcon size={18} strokeWidth={1.6} /> : <MenuIcon size={18} strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Main mobile"
          className="border-t border-[#004b47]/10 bg-white px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-0.5">
            {visibleItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleMobileClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-[#004b47]/8 text-[#004b47]"
                      : "text-[#004b47]/50 hover:bg-[#004b47]/5 hover:text-[#004b47]"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2 : 1.6} />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-2 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <LogOutIcon size={16} strokeWidth={1.6} />
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default memo(Header);
