"use client";

import { memo, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import XIcon from "lucide-react/dist/esm/icons/x";
import PackageIcon from "lucide-react/dist/esm/icons/package";
import TruckIcon from "lucide-react/dist/esm/icons/truck";
import CreditCardIcon from "lucide-react/dist/esm/icons/credit-card";
import MapPinIcon from "lucide-react/dist/esm/icons/map-pin";
import UserIcon from "lucide-react/dist/esm/icons/user";
import HashIcon from "lucide-react/dist/esm/icons/hash";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-[#004b47]/5 text-[#004b47] border-[#004b47]/20",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-[#C76F4D]/10 text-[#C76F4D] border-[#C76F4D]/25",
};

const paymentMethodLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  card_simulated: "Card (Dev)",
  paypal: "PayPal",
};

const paymentStatusColors: Record<string, string> = {
  UNPAID: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-[#C76F4D]/10 text-[#C76F4D] border-[#C76F4D]/25",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

type OrderItemData = {
  id: string;
  quantity: number;
  price: number;
  color: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    brand: string | null;
    description: string;
    details: string | null;
    material: string | null;
    dimensions: string | null;
    weight: number | null;
    price: number;
    salePrice: number | null;
    images: { url: string; alt: string | null }[];
    colors: { name: string; hex: string | null }[];
    category: { name: string; slug: string };
  };
};

type OrderData = {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  shippingAddress: Record<string, string>;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemData[];
  user?: { id: string; name: string; email: string; phone: string | null } | null;
};

const OrderDetailModal = memo(function OrderDetailModal({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrder(data.order);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [orderId, onClose]);

  if (!orderId) return null;

  const customerName = order?.user?.name || "Guest";
  const customerEmail = order?.user?.email || order?.guestEmail || "—";
  const customerPhone = order?.user?.phone || order?.guestPhone || "—";
  const address = order?.shippingAddress || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[14px] border border-[#004b47]/10 bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#004b47] border-t-transparent" />
          </div>
        ) : !order ? (
          <div className="p-8 text-center font-sans text-sm text-neutral-500">Order not found.</div>
        ) : (
          <div className="p-6 lg:p-8">
            {/* ── Header ── */}
            <div className="flex items-start justify-between border-b border-[#004b47]/10 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2
                    id="order-modal-title"
                    className="font-serif text-xl font-semibold text-[#1a1a1a]"
                  >
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                </div>
                <p className="mt-1.5 font-sans text-sm text-neutral-500">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(order.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors duration-200 hover:bg-[#004b47]/8 hover:text-[#1a1a1a]"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* ── Status Badges ── */}
            <div className="mt-5 flex flex-wrap gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide ${
                  statusColors[order.status] || "bg-neutral-50 text-neutral-600 border-neutral-200"
                }`}
              >
                <HashIcon size={12} strokeWidth={2.5} />
                {order.status}
              </span>
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
                  {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                </span>
              )}
            </div>

            {/* ── Two-column layout ── */}
            <div className="mt-7 grid gap-8 lg:grid-cols-3">
              {/* Left: Customer Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Customer */}
                <div>
                  <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    <UserIcon size={13} strokeWidth={2} />
                    Customer
                  </h3>
                  <div className="mt-3 space-y-1.5">
                    <p className="font-sans text-sm font-semibold text-[#1a1a1a]">{customerName}</p>
                    <p className="font-sans text-sm text-neutral-500">{customerEmail}</p>
                    {customerPhone !== "—" && (
                      <p className="font-sans text-sm text-neutral-500">{customerPhone}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    <MapPinIcon size={13} strokeWidth={2} />
                    Shipping Address
                  </h3>
                  <div className="mt-3 space-y-1">
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
                    <p className="font-sans text-sm text-neutral-600">{address.country}</p>
                    {address.email && (
                      <p className="mt-2 font-sans text-sm text-neutral-500">{address.email}</p>
                    )}
                    {address.phone && (
                      <p className="font-sans text-sm text-neutral-500">{address.phone}</p>
                    )}
                  </div>
                </div>

                {/* Tracking */}
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

                {/* Notes */}
                {order.notes && (
                  <div>
                    <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                      Notes
                    </h3>
                    <p className="mt-3 font-sans text-sm text-neutral-600">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Right: Items + Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Items */}
                <div>
                  <h3 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    <PackageIcon size={13} strokeWidth={2} />
                    Items ({order.items.length})
                  </h3>
                  <div className="mt-3 divide-y divide-[#004b47]/8 rounded-[12px] border border-[#004b47]/10">
                    {order.items.map((item) => {
                      const p = item.product;
                      const unitPrice = Number(item.price);
                      const lineTotal = unitPrice * item.quantity;
                      const img = p.images?.[0];
                      return (
                        <div key={item.id} className="flex gap-4 p-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] border border-[#004b47]/10 bg-[#FAF6EF]">
                            {img ? (
                              <Image
                                src={img.url}
                                alt={img.alt || p.name}
                                fill
                                className="object-cover"
                                sizes="80px"
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
                              {p.material && (
                                <p className="mt-0.5 font-sans text-xs text-neutral-400">
                                  {p.material}
                                  {p.dimensions && ` · ${p.dimensions}`}
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
                    Summary
                  </h3>
                  <div className="mt-3 space-y-2 rounded-[12px] border border-[#004b47]/10 bg-[#FAF6EF]/60 p-4">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default OrderDetailModal;
