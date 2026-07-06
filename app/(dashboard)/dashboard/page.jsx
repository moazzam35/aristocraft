"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UsersIcon from "lucide-react/dist/esm/icons/users";
import ShoppingBagIcon from "lucide-react/dist/esm/icons/shopping-bag";
import PackageIcon from "lucide-react/dist/esm/icons/package";
import DollarSignIcon from "lucide-react/dist/esm/icons/dollar-sign";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right";
import ClockIcon from "lucide-react/dist/esm/icons/clock";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-[#004b47]/5 text-[#004b47] border-[#004b47]/20",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-[#C76F4D]/10 text-[#C76F4D] border-[#C76F4D]/25",
};

const PIE_COLORS = {
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  SHIPPED: "#004b47",
  DELIVERED: "#10b981",
  CANCELLED: "#C76F4D",
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="group rounded-[14px] border border-[#004b47]/10 bg-white p-7 shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)] transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(0,75,71,0.12)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[13px] font-medium uppercase tracking-wider text-neutral-500">
          {label}
        </p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-transform duration-300 group-hover:scale-105 ${accent}`}
        >
          <Icon size={17} strokeWidth={1.6} />
        </div>
      </div>
      <p className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">
        {value}
      </p>
    </div>
  );
}

function ChartCard({ title, action, children }) {
  return (
    <div className="rounded-[14px] border border-[#004b47]/10 bg-white p-7 shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-[#1a1a1a]">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-[10px] border border-[#004b47]/10 bg-white px-4 py-3 shadow-[0_8px_30px_-6px_rgba(0,75,71,0.15)]">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="mt-1 font-serif text-sm font-semibold text-[#1a1a1a]"
          style={{ color: entry.color }}
        >
          {prefix}
          {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  );
}

function buildDailySeries(orders, days = 14) {
  const now = new Date();
  const buckets = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    buckets.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: 0,
      orders: 0,
    });
  }

  const bucketMap = new Map(buckets.map((b) => [b.key, b]));

  orders.forEach((order) => {
    const created = order.createdAt ? new Date(order.createdAt) : null;
    if (!created) return;
    const key = created.toISOString().slice(0, 10);
    const bucket = bucketMap.get(key);
    if (!bucket) return;
    bucket.orders += 1;
    if (order.paymentStatus === "PAID") {
      bucket.revenue += Number(order.total) || 0;
    }
  });

  return buckets;
}

function buildStatusBreakdown(orders) {
  const counts = {};
  orders.forEach((order) => {
    counts[order.status] = (counts[order.status] || 0) + 1;
  });
  return Object.entries(counts).map(([status, value]) => ({
    name: status,
    value,
  }));
}

function buildCategoryRevenue(orders) {
  const map = new Map();
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const categoryName =
        item.product?.category?.name || item.product?.categoryName || "Other";
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
      map.set(categoryName, (map.get(categoryName) || 0) + lineTotal);
    });
  });
  return Array.from(map.entries())
    .map(([name, revenue]) => ({ name, revenue: Number(revenue.toFixed(2)) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/orders?all=true"),
        ]);

        const usersData = await usersRes.json();
        const ordersData = await ordersRes.json();

        if (usersData.success) setUsers(usersData.users);
        if (ordersData.success) setOrders(ordersData.orders);

        if (!usersData.success && !ordersData.success) {
          setError("Failed to load dashboard data.");
        }
      } catch (err) {
        setError("Something went wrong loading the dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] p-8">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-[#004b47]/10" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-[#004b47]/5" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[110px] animate-pulse rounded-[14px] border border-[#004b47]/10 bg-white"
            />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-[14px] border border-[#004b47]/10 bg-white lg:col-span-2" />
          <div className="h-96 animate-pulse rounded-[14px] border border-[#004b47]/10 bg-white" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] p-8">
        <div
          role="alert"
          className="rounded-[12px] border border-[#C76F4D]/30 bg-[#C76F4D]/5 px-5 py-4 font-sans text-sm text-[#8f4a30]"
        >
          {error}
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const recentOrders = orders.slice(0, 5);

  const dailySeries = buildDailySeries(orders, 14);
  const statusBreakdown = buildStatusBreakdown(orders);
  const categoryRevenue = buildCategoryRevenue(orders);

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C76F4D]">
          Aristocraft
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] lg:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 font-sans text-sm text-neutral-500">
          Overview of your store&apos;s performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSignIcon}
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          accent="bg-[#004b47]/8 text-[#004b47]"
        />
        <StatCard
          icon={ShoppingBagIcon}
          label="Total Orders"
          value={orders.length}
          accent="bg-[#004b47]/8 text-[#004b47]"
        />
        <StatCard
          icon={ClockIcon}
          label="Pending Orders"
          value={pendingOrders}
          accent="bg-[#C76F4D]/10 text-[#C76F4D]"
        />
        <StatCard
          icon={UsersIcon}
          label="Total Users"
          value={users.length}
          accent="bg-[#004b47]/8 text-[#004b47]"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue — Last 14 Days">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailySeries} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004b47" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#004b47" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#004b4712" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={{ stroke: "#004b4720" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#004b47"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Order Status">
          {statusBreakdown.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#004b47]/5">
                <ShoppingBagIcon size={20} strokeWidth={1.5} className="text-[#004b47]/40" />
              </div>
              <p className="mt-4 font-sans text-sm text-neutral-500">No orders yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[entry.name] || "#a3a3a3"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="font-sans text-[11px] text-neutral-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Orders — Last 14 Days">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dailySeries} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#004b4712" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={{ stroke: "#004b4720" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#C76F4D" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Revenue by Category">
          {categoryRevenue.length === 0 ? (
            <div className="flex h-[240px] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#004b47]/5">
                <PackageIcon size={20} strokeWidth={1.5} className="text-[#004b47]/40" />
              </div>
              <p className="mt-4 font-sans text-sm text-neutral-500">No category data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={categoryRevenue}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#004b4712" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#404040" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Bar dataKey="revenue" fill="#004b47" radius={[0, 4, 4, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-[14px] border border-[#004b47]/10 bg-white shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#004b47]/10 px-7 py-5">
            <h2 className="font-serif text-lg font-semibold text-[#1a1a1a]">
              Recent Orders
            </h2>
            <Link
              href="/orders"
              className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#004b47] transition-colors hover:text-[#C76F4D]"
            >
              View all
              <ArrowRightIcon size={12} strokeWidth={2} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#004b47]/5">
                <ShoppingBagIcon size={20} strokeWidth={1.5} className="text-[#004b47]/40" />
              </div>
              <p className="mt-4 font-sans text-sm text-neutral-500">No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#004b47]/10 bg-[#FAF6EF]/60">
                  <tr>
                    <th className="px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Order
                    </th>
                    <th className="px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Customer
                    </th>
                    <th className="px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Total
                    </th>
                    <th className="px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#004b47]/5 transition-colors last:border-0 hover:bg-[#FAF6EF]/50"
                    >
                      <td className="px-7 py-4 font-sans text-sm font-semibold text-[#1a1a1a]">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-7 py-4 font-sans text-sm text-neutral-600">
                        {order.user.name}
                      </td>
                      <td className="px-7 py-4 font-serif text-sm font-semibold text-[#1a1a1a]">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-7 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide ${
                            statusColors[order.status] ||
                            "bg-neutral-50 text-neutral-600 border-neutral-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-[14px] border border-[#004b47]/10 bg-white p-7 shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
          <h2 className="font-serif text-lg font-semibold text-[#1a1a1a]">
            Quick Actions
          </h2>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/products"
              className="group flex items-center justify-between rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-3.5 font-sans text-sm font-medium text-[#1a1a1a] transition-all duration-200 hover:border-[#004b47]/40 hover:bg-[#004b47]/[0.03]"
            >
              <span className="flex items-center gap-3">
                <PackageIcon size={16} strokeWidth={1.6} className="text-[#004b47]" />
                Manage Products
              </span>
              <ArrowRightIcon
                size={14}
                strokeWidth={2}
                className="text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#C76F4D]"
              />
            </Link>
            <Link
              href="/orders"
              className="group flex items-center justify-between rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-3.5 font-sans text-sm font-medium text-[#1a1a1a] transition-all duration-200 hover:border-[#004b47]/40 hover:bg-[#004b47]/[0.03]"
            >
              <span className="flex items-center gap-3">
                <ShoppingBagIcon size={16} strokeWidth={1.6} className="text-[#004b47]" />
                Manage Orders
              </span>
              <ArrowRightIcon
                size={14}
                strokeWidth={2}
                className="text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#C76F4D]"
              />
            </Link>
            <Link
              href="/users"
              className="group flex items-center justify-between rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-3.5 font-sans text-sm font-medium text-[#1a1a1a] transition-all duration-200 hover:border-[#004b47]/40 hover:bg-[#004b47]/[0.03]"
            >
              <span className="flex items-center gap-3">
                <UsersIcon size={16} strokeWidth={1.6} className="text-[#004b47]" />
                Manage Users
              </span>
              <ArrowRightIcon
                size={14}
                strokeWidth={2}
                className="text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#C76F4D]"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}