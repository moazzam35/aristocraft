"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PackageIcon from "lucide-react/dist/esm/icons/package";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import { useAuthStore } from "@/hooks/store/auth-store";

type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  color: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    images: { url: string }[];
  };
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
  trackingNumber: string | null;
  items: OrderItem[];
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, hasFetched, isLoading, fetchUser } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (hasFetched && !isLoading && !user) {
      router.push("/login");
    }
  }, [hasFetched, isLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to load orders.");
        }
      } catch (err) {
        setError("Something went wrong loading your orders.");
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [user]);

  if (isLoading || !hasFetched || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF]">
        <p className="text-[0.9rem] text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] px-4 pb-16 pt-32 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-neutral-500 transition-colors hover:text-[#004b47]"
        >
          <ArrowLeftIcon size={14} strokeWidth={2} />
          Back to account
        </Link>

        <h1 className="font-serif text-[1.9rem] tracking-tight text-neutral-900">My Orders</h1>
        <p className="mt-1 text-[0.9rem] text-neutral-500">
          Track and review your past orders.
        </p>

        {loadingOrders ? (
          <p className="mt-10 text-[0.9rem] text-neutral-500">Loading orders...</p>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.84rem] text-red-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-[24px] bg-white p-12 text-center shadow-[0_20px_50px_-25px_rgba(0,30,28,0.25)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
              <PackageIcon size={26} strokeWidth={1.4} />
            </div>
            <div>
              <p className="text-[0.95rem] font-medium text-neutral-900">No orders yet</p>
              <p className="mt-1 text-[0.82rem] text-neutral-400">
                When you place an order, it'll show up here.
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#004b47] px-6 py-2.5 text-[0.85rem] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-[20px] bg-white shadow-[0_16px_40px_-24px_rgba(0,30,28,0.25)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
                  <div>
                    <p className="text-[0.78rem] uppercase tracking-wide text-neutral-400">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[0.82rem] text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[0.74rem] font-semibold ${
                      statusColors[order.status] || "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col gap-3 px-6 py-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[0.85rem] font-medium text-neutral-900">
                          {item.product.name}
                        </p>
                        <p className="text-[0.78rem] text-neutral-400">
                          Qty {item.quantity} {item.color && `· ${item.color}`}
                        </p>
                      </div>
                      <p className="text-[0.85rem] font-semibold text-neutral-900">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-6 py-4">
                  {order.trackingNumber ? (
                    <p className="text-[0.82rem] text-neutral-500">
                      Tracking: <span className="font-medium text-neutral-800">{order.trackingNumber}</span>
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-[0.95rem] font-semibold text-neutral-900">
                    Total: ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}