"use client";

import { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MailIcon from "lucide-react/dist/esm/icons/mail";
import UserIcon from "lucide-react/dist/esm/icons/user";
import ShieldIcon from "lucide-react/dist/esm/icons/shield";
import CalendarIcon from "lucide-react/dist/esm/icons/calendar";
import PackageIcon from "lucide-react/dist/esm/icons/package";
import ShoppingBagIcon from "lucide-react/dist/esm/icons/shopping-bag";
import TrendingUpIcon from "lucide-react/dist/esm/icons/trending-up";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import type { AuthUser } from "@/types/user";

function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        const me = await meRes.json();
        if (me.success) {
          setAdmin(me.user);
          setUserRole(me.user.role);
        }

        if (me.user?.role === "ADMIN") {
          const [ordersRes, usersRes, productsRes] = await Promise.all([
            fetch("/api/orders?all=true"),
            fetch("/api/users"),
            fetch("/api/products"),
          ]);
          const orders = await ordersRes.json();
          const users = await usersRes.json();
          const products = await productsRes.json();
          setStats({
            products: products.products?.length || 0,
            orders: orders.orders?.length || 0,
            users: users.users?.length || 0,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleBackToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-md bg-[#004b47]/10" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-64 animate-pulse rounded-[14px] border border-[#004b47]/10 bg-white" />
          <div className="h-64 animate-pulse rounded-[14px] border border-[#004b47]/10 bg-white" />
        </div>
      </div>
    );
  }

  if (userRole && userRole !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShieldIcon size={48} className="text-neutral-300" strokeWidth={1} />
        <h2 className="mt-4 font-serif text-xl font-semibold text-[#1a1a1a]">Admin Area</h2>
        <p className="mt-2 font-sans text-sm text-neutral-500">
          You do not have permission to access this page.
        </p>
        <button
          onClick={handleBackToDashboard}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#004b47]/20 bg-[#004b47]/5 px-5 py-2.5 font-sans text-sm font-medium text-[#004b47] transition-colors hover:bg-[#004b47]/10"
        >
          <ArrowLeftIcon size={14} strokeWidth={2} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C76F4D]">
          Aristocraft
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] lg:text-4xl">
          Admin Profile
        </h1>
        <p className="mt-2 font-sans text-sm text-neutral-500">
          Your account details and store overview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[14px] border border-[#004b47]/10 bg-white p-8 shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#004b47]/10 text-[#004b47]">
              <UserIcon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#1a1a1a]">
                {admin?.name || "Admin"}
              </h2>
              <p className="mt-0.5 font-sans text-sm text-neutral-500">Administrator</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-[10px] bg-[#FAF6EF] px-5 py-4">
              <div className="flex items-center gap-2 text-[#004b47]/60">
                <MailIcon size={14} strokeWidth={1.5} />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">Email</span>
              </div>
              <p className="mt-1.5 font-sans text-sm font-medium text-[#1a1a1a]">
                {admin?.email || "\u2014"}
              </p>
            </div>

            <div className="rounded-[10px] bg-[#FAF6EF] px-5 py-4">
              <div className="flex items-center gap-2 text-[#004b47]/60">
                <ShieldIcon size={14} strokeWidth={1.5} />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">Role</span>
              </div>
              <p className="mt-1.5 font-sans text-sm font-medium text-[#1a1a1a]">
                {admin?.role || "\u2014"}
              </p>
            </div>

            <div className="rounded-[10px] bg-[#FAF6EF] px-5 py-4">
              <div className="flex items-center gap-2 text-[#004b47]/60">
                <CalendarIcon size={14} strokeWidth={1.5} />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">Joined</span>
              </div>
              <p className="mt-1.5 font-sans text-sm font-medium text-[#1a1a1a]">
                {admin?.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "\u2014"}
              </p>
            </div>

            <div className="rounded-[10px] bg-[#FAF6EF] px-5 py-4">
              <div className="flex items-center gap-2 text-[#004b47]/60">
                <TrendingUpIcon size={14} strokeWidth={1.5} />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">Phone</span>
              </div>
              <p className="mt-1.5 font-sans text-sm font-medium text-[#1a1a1a]">
                {admin?.phone || "\u2014"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] border border-[#004b47]/10 bg-white p-8 shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
          <h2 className="font-serif text-lg font-semibold text-[#1a1a1a]">Store at a Glance</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-[10px] bg-[#FAF6EF] px-5 py-4">
              <div className="flex items-center gap-3">
                <PackageIcon size={16} strokeWidth={1.5} className="text-[#004b47]" />
                <span className="font-sans text-sm text-neutral-600">Products</span>
              </div>
              <span className="font-serif text-lg font-semibold text-[#1a1a1a]">{stats.products}</span>
            </div>
            <div className="flex items-center justify-between rounded-[10px] bg-[#FAF6EF] px-5 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBagIcon size={16} strokeWidth={1.5} className="text-[#004b47]" />
                <span className="font-sans text-sm text-neutral-600">Orders</span>
              </div>
              <span className="font-serif text-lg font-semibold text-[#1a1a1a]">{stats.orders}</span>
            </div>
            <div className="flex items-center justify-between rounded-[10px] bg-[#FAF6EF] px-5 py-4">
              <div className="flex items-center gap-3">
                <UserIcon size={16} strokeWidth={1.5} className="text-[#004b47]" />
                <span className="font-sans text-sm text-neutral-600">Users</span>
              </div>
              <span className="font-serif text-lg font-semibold text-[#1a1a1a]">{stats.users}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AdminPage);
