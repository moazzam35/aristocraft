"use client";

import { useEffect, useState } from "react";
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down";
import ChevronRightIcon from "lucide-react/dist/esm/icons/chevron-right";
import PackageIcon from "lucide-react/dist/esm/icons/package";
import UserIcon from "lucide-react/dist/esm/icons/user";
import MapPinIcon from "lucide-react/dist/esm/icons/map-pin";
import CreditCardIcon from "lucide-react/dist/esm/icons/credit-card";
import TruckIcon from "lucide-react/dist/esm/icons/truck";
import HashIcon from "lucide-react/dist/esm/icons/hash";
import PhoneIcon from "lucide-react/dist/esm/icons/phone";
import MailIcon from "lucide-react/dist/esm/icons/mail";
import CalendarIcon from "lucide-react/dist/esm/icons/calendar";
import DollarSignIcon from "lucide-react/dist/esm/icons/dollar-sign";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-[#004b47]/5 text-[#004b47] border-[#004b47]/20",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-[#C76F4D]/10 text-[#C76F4D] border-[#C76F4D]/25",
};

const paymentStatusColors = {
  UNPAID: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-[#C76F4D]/10 text-[#C76F4D] border-[#C76F4D]/25",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

const paymentMethodLabels = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  card_simulated: "Card (Dev)",
  paypal: "PayPal",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?all=true");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to load orders.");
      }
    } catch (err) {
      setError("Something went wrong loading orders.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: data.order.status } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  function toggleExpand(orderId) {
    setExpandedId((prev) => (prev === orderId ? null : orderId));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-40 animate-pulse rounded-md bg-[#004b47]/10" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-[#004b47]/5" />
        </div>
        <div className="overflow-hidden rounded-[14px] border border-[#004b47]/10 bg-white">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse border-b border-[#004b47]/5 bg-white last:border-0"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
        <div
          role="alert"
          className="rounded-[12px] border border-[#C76F4D]/30 bg-[#C76F4D]/5 px-5 py-4 font-sans text-sm text-[#8f4a30]"
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C76F4D]">
              Aristocraft
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] lg:text-4xl">
              All Orders
            </h1>
            <p className="mt-2 font-sans text-sm text-neutral-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[14px] border border-[#004b47]/10 bg-white py-20 text-center shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
            <PackageIcon size={40} className="text-neutral-300" strokeWidth={1} />
            <p className="mt-4 font-sans text-sm text-neutral-500">No orders have been placed yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const address = order.shippingAddress || {};
              const customerName = order.user?.name || "Guest";
              const customerEmail = order.user?.email || order.guestEmail || "—";
              const customerPhone = order.user?.phone || order.guestPhone || null;

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-[14px] border border-[#004b47]/10 bg-white shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)] transition-shadow duration-200 hover:shadow-[0_4px_24px_-6px_rgba(0,75,71,0.1)]"
                >
                  {/* ── Collapsed Row ── */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF6EF]/40"
                  >
                    {/* Expand icon */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors">
                      {isExpanded ? (
                        <ChevronDownIcon size={16} strokeWidth={2.5} />
                      ) : (
                        <ChevronRightIcon size={16} strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Product thumbnails */}
                    <div className="flex -space-x-2 shrink-0">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={item.id}
                          className="h-10 w-10 overflow-hidden rounded-[8px] border-2 border-white bg-[#FAF6EF] shadow-sm"
                          style={{ zIndex: 3 - idx }}
                        >
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.images[0].alt || item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-300">
                              <PackageIcon size={14} strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="z-0 flex h-10 w-10 items-center justify-center rounded-[8px] border-2 border-white bg-[#004b47]/5 text-[11px] font-semibold text-[#004b47] shadow-sm">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Order ID */}
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-sm font-semibold text-[#004b47]">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        {order.items.slice(0, 2).map((item) => (
                          <span
                            key={item.id}
                            className="truncate font-sans text-xs text-neutral-500 max-w-[140px]"
                          >
                            {item.product.name}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="font-sans text-xs text-neutral-400">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="hidden min-w-0 sm:block sm:w-44">
                      <p className="truncate font-sans text-sm font-medium text-[#1a1a1a]">
                        {customerName}
                      </p>
                      <p className="truncate font-sans text-xs text-neutral-400">
                        {customerEmail}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="hidden text-right md:block md:w-24">
                      <p className="font-serif text-sm font-semibold text-[#1a1a1a]">
                        ${Number(order.total).toFixed(2)}
                      </p>
                      <p className="font-sans text-[10px] text-neutral-400">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="hidden lg:block">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide ${
                          statusColors[order.status] ||
                          "bg-neutral-50 text-neutral-600 border-neutral-200"
                        }`}
                      >
                        <HashIcon size={10} strokeWidth={2.5} />
                        {order.status}
                      </span>
                    </div>

                    {/* Payment Status + Method */}
                    <div className="hidden lg:flex lg:items-center lg:gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide ${
                          paymentStatusColors[order.paymentStatus] ||
                          "bg-neutral-50 text-neutral-600 border-neutral-200"
                        }`}
                      >
                        <CreditCardIcon size={10} strokeWidth={2.5} />
                        {order.paymentStatus}
                      </span>
                      {order.paymentMethod && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-sans text-[10px] font-medium tracking-wide text-neutral-600">
                          {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <div className="hidden text-right lg:block lg:w-28">
                      <p className="font-sans text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="font-sans text-[10px] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </button>

                  {/* ── Expanded Detail ── */}
                  {isExpanded && (
                    <div className="border-t border-[#004b47]/10 bg-[#FAF6EF]/40">
                      <div className="grid gap-8 p-6 lg:grid-cols-3 lg:p-8">
                        {/* Left Column: Customer + Shipping */}
                        <div className="space-y-6 lg:col-span-1">
                          {/* Customer Details */}
                          <div>
                            <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                              <UserIcon size={13} strokeWidth={2} />
                              Customer
                            </h3>
                            <div className="mt-3 space-y-2">
                              <p className="font-sans text-sm font-semibold text-[#1a1a1a]">
                                {customerName}
                              </p>
                              <div className="flex items-center gap-2 text-neutral-500">
                                <MailIcon size={12} strokeWidth={2} />
                                <span className="font-sans text-sm">{customerEmail}</span>
                              </div>
                              {customerPhone && (
                                <div className="flex items-center gap-2 text-neutral-500">
                                  <PhoneIcon size={12} strokeWidth={2} />
                                  <span className="font-sans text-sm">{customerPhone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                              <MapPinIcon size={13} strokeWidth={2} />
                              Shipping Address
                            </h3>
                            <div className="mt-3 space-y-1 rounded-[10px] border border-[#004b47]/8 bg-white px-4 py-3">
                              {address.firstName && address.lastName && (
                                <p className="font-sans text-sm font-semibold text-[#1a1a1a]">
                                  {address.firstName} {address.lastName}
                                </p>
                              )}
                              <p className="font-sans text-sm text-neutral-600">
                                {address.address}
                                {address.apartment && `, ${address.apartment}`}
                              </p>
                              <p className="font-sans text-sm text-neutral-600">
                                {address.city}, {address.state} {address.zip}
                              </p>
                              <p className="font-sans text-sm text-neutral-600">
                                {address.country}
                              </p>
                              {address.email && (
                                <div className="flex items-center gap-2 pt-1 text-neutral-500">
                                  <MailIcon size={11} strokeWidth={2} />
                                  <span className="font-sans text-xs">{address.email}</span>
                                </div>
                              )}
                              {address.phone && (
                                <div className="flex items-center gap-2 text-neutral-500">
                                  <PhoneIcon size={11} strokeWidth={2} />
                                  <span className="font-sans text-xs">{address.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Tracking & Notes */}
                          {order.trackingNumber && (
                            <div>
                              <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                                <TruckIcon size={13} strokeWidth={2} />
                                Tracking
                              </h3>
                              <p className="mt-3 font-sans text-sm font-medium text-[#004b47]">
                                {order.trackingNumber}
                              </p>
                            </div>
                          )}
                          {order.notes && (
                            <div>
                              <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                                Notes
                              </h3>
                              <p className="mt-3 rounded-[10px] border border-[#004b47]/8 bg-white px-4 py-3 font-sans text-sm text-neutral-600">
                                {order.notes}
                              </p>
                            </div>
                          )}

                          {/* Status Controls */}
                          <div>
                            <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                              <HashIcon size={13} strokeWidth={2} />
                              Order Status
                            </h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <select
                                value={order.status}
                                disabled={updatingId === order.id}
                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                aria-label={`Status for order ${order.id.slice(-8).toUpperCase()}`}
                                className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide outline-none transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${
                                  statusColors[order.status] ||
                                  "bg-neutral-50 text-neutral-600 border-neutral-200"
                                }`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide ${
                                  paymentStatusColors[order.paymentStatus] ||
                                  "bg-neutral-50 text-neutral-600 border-neutral-200"
                                }`}
                              >
                                <CreditCardIcon size={12} strokeWidth={2.5} />
                                {order.paymentStatus}
                              </span>
                              {order.paymentMethod && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
                                  <DollarSignIcon size={12} strokeWidth={2.5} />
                                  {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Products + Summary */}
                        <div className="space-y-6 lg:col-span-2">
                          {/* Products */}
                          <div>
                            <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                              <PackageIcon size={13} strokeWidth={2} />
                              Products ({order.items.length})
                            </h3>
                            <div className="mt-3 divide-y divide-[#004b47]/8 rounded-[12px] border border-[#004b47]/10 bg-white">
                              {order.items.map((item) => {
                                const p = item.product;
                                const unitPrice = Number(item.price);
                                const lineTotal = unitPrice * item.quantity;
                                const img = p.images?.[0];
                                return (
                                  <div key={item.id} className="flex gap-4 p-4 last:rounded-b-[12px]">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[10px] border border-[#004b47]/10 bg-[#FAF6EF]">
                                      {img ? (
                                        <img
                                          src={img.url}
                                          alt={img.alt || p.name}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-neutral-300">
                                          <PackageIcon size={24} strokeWidth={1.5} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                      <div>
                                        <p className="font-sans text-sm font-semibold text-[#1a1a1a]">
                                          {p.name}
                                        </p>
                                        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                                          {p.brand && (
                                            <span className="font-sans text-xs text-neutral-400">
                                              {p.brand}
                                            </span>
                                          )}
                                          {p.sku && (
                                            <span className="font-sans text-xs text-neutral-400">
                                              SKU: {p.sku}
                                            </span>
                                          )}
                                          {p.category?.name && (
                                            <span className="font-sans text-xs text-neutral-400">
                                              {p.category.name}
                                            </span>
                                          )}
                                        </div>
                                        {item.color && (
                                          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-sans text-[10px] font-medium text-neutral-600">
                                            {item.color}
                                          </span>
                                        )}
                                        {(p.material || p.dimensions) && (
                                          <p className="mt-0.5 font-sans text-xs text-neutral-400">
                                            {p.material}
                                            {p.material && p.dimensions && " · "}
                                            {p.dimensions}
                                          </p>
                                        )}
                                      </div>
                                      <div className="mt-2 flex items-center justify-between">
                                        <span className="font-sans text-xs text-neutral-500">
                                          Qty: {item.quantity} × ${unitPrice.toFixed(2)}
                                        </span>
                                        <span className="font-serif text-sm font-semibold text-[#1a1a1a]">
                                          ${lineTotal.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                              <DollarSignIcon size={13} strokeWidth={2} />
                              Summary
                            </h3>
                            <div className="mt-3 space-y-2 rounded-[12px] border border-[#004b47]/10 bg-white p-5">
                              <div className="flex items-center justify-between font-sans text-sm text-neutral-600">
                                <span>Subtotal</span>
                                <span>${Number(order.subtotal).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between font-sans text-sm text-neutral-600">
                                <span>Shipping</span>
                                <span>
                                  {Number(order.shippingCost) === 0
                                    ? "FREE"
                                    : `$${Number(order.shippingCost).toFixed(2)}`}
                                </span>
                              </div>
                              {Number(order.discount) > 0 && (
                                <div className="flex items-center justify-between font-sans text-sm text-emerald-600">
                                  <span>Discount</span>
                                  <span>-${Number(order.discount).toFixed(2)}</span>
                                </div>
                              )}
                              <div className="border-t border-[#004b47]/10 pt-2" />
                              <div className="flex items-center justify-between font-serif text-base font-semibold text-[#1a1a1a]">
                                <span>Total</span>
                                <span>${Number(order.total).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Date Info */}
                          <div className="flex items-center gap-4 rounded-[12px] border border-[#004b47]/8 bg-white px-5 py-3">
                            <CalendarIcon size={14} className="text-neutral-400" strokeWidth={1.5} />
                            <div className="font-sans text-xs text-neutral-500">
                              Ordered on{" "}
                              <span className="font-medium text-[#1a1a1a]">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>{" "}
                              at{" "}
                              <span className="font-medium text-[#1a1a1a]">
                                {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
