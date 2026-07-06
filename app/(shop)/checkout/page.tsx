"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CreditCardIcon from "lucide-react/dist/esm/icons/credit-card";
import WalletIcon from "lucide-react/dist/esm/icons/wallet";
import DollarSignIcon from "lucide-react/dist/esm/icons/dollar-sign";
import { useCartStore, type CartItem, getSubtotal, getDiscount } from "@/hooks/store/cart-store";
import { useAuthStore } from "@/hooks/store/auth-store";
import StripePayment from "@/components/checkout/StripePayment";

type Step = "shipping" | "review" | "payment" | "confirmation";
const STEPS: { key: string; label: string }[] = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" },
];

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState<Step>("shipping");

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placeError, setPlaceError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [confirmedItems, setConfirmedItems] = useState<CartItem[]>([]);
  const [confirmedTotals, setConfirmedTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    grandTotal: 0,
  });
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const subtotal = useMemo(() => getSubtotal(cart), [cart]);
  const discount = useMemo(() => getDiscount(cart), [cart]);
  const taxable = subtotal - discount;
  const tax = taxable * 0.08;
  const shippingFee = taxable > 100 || taxable <= 0 ? 0 : 9.99;
  const grandTotal = taxable + tax + shippingFee;

  const stepIndex = step === "shipping" ? 0 : step === "confirmation" ? 2 : 1;

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shipping.firstName.trim()) errs.firstName = "First name is required";
    if (!shipping.lastName.trim()) errs.lastName = "Last name is required";
    if (!shipping.email.trim()) errs.email = "Email address is required";
    if (!shipping.phone.trim()) errs.phone = "Phone number is required";
    if (!shipping.address.trim()) errs.address = "Address is required";
    if (!shipping.city.trim()) errs.city = "City is required";
    if (!shipping.state.trim()) errs.state = "State/Province is required";
    if (!shipping.zip.trim()) errs.zip = "Zip/Postal code is required";
    if (!shipping.country.trim()) errs.country = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingChange = (field: keyof typeof shipping, val: string) => {
    setShipping((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => { const copy = { ...prev }; delete copy[field]; return copy; });
    }
  };

  const goNext = () => {
    if (step === "shipping" && validateShipping()) {
      setPlaceError("");
      setStep("review");
    }
  };

  const placeCodOrder = async () => {
    try {
      setPlaceError("");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            color: item.color || null,
          })),
          shippingAddress: {
            firstName: shipping.firstName,
            lastName: shipping.lastName,
            email: shipping.email,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            country: shipping.country,
          },
          paymentMethod: "cod",
          guestEmail: user ? undefined : shipping.email,
          guestPhone: user ? undefined : shipping.phone,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setPlaceError(data.message || "Failed to place order.");
        return;
      }
      setConfirmedItems([...cart]);
      setConfirmedTotals({ subtotal, discount, tax, shipping: shippingFee, grandTotal });
      setConfirmedOrderId(data.order.id);
      clearCart();
      setStep("confirmation");
    } catch {
      setPlaceError("Something went wrong placing your order. Please try again.");
    }
  };

  const goToPayment = () => {
    setPlaceError("");
    setStep("payment");
  };

  const goBack = () => {
    if (step === "review") {
      setStep("shipping");
      setErrors({});
    } else if (step === "payment") {
      setStep("review");
    }
  };

  const confirmOrder = (orderId: string) => {
    setConfirmedItems([...cart]);
    setConfirmedTotals({ subtotal, discount, tax, shipping: shippingFee, grandTotal });
    setConfirmedOrderId(orderId);
    clearCart();
    setStep("confirmation");
  };

  if (step === "confirmation") {
    return (
      <ConfirmationStep
        items={confirmedItems}
        totals={confirmedTotals}
        shipping={shipping}
        orderId={confirmedOrderId}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <main className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#FAFAF8" }}>
        <PageBackgroundDecor />
        <div className="text-center px-6 relative z-10">
          <div className="w-px h-16 mx-auto mb-8" style={{ backgroundColor: "#1C1C1C14" }} />
          <p className="text-xs font-light tracking-widest uppercase mb-3" style={{ color: "#1C1C1C66", letterSpacing: "0.14em" }}>Your cart</p>
          <p className="text-base font-light mb-8" style={{ color: "#1C1C1C", lineHeight: 1.7 }}>No items in your cart to checkout.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "#004B47", letterSpacing: "0.04em" }}>
            <span>←</span>
            <span>Return to shop</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: "#FAFAF8" }}>
      <PageBackgroundDecor />
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="mb-14 md:mb-16">
          <p className="text-xs font-light tracking-widest uppercase mb-4" style={{ color: "#1C1C1C66", letterSpacing: "0.14em" }}>Secure Checkout</p>
          <h1 className="text-3xl sm:text-4xl font-light mb-10" style={{ color: "#1C1C1C", letterSpacing: "-0.025em", lineHeight: 1.1 }}>Checkout Process</h1>
          <ProgressIndicator stepIndex={stepIndex} />
        </div>

        {!user && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You are checking out as a guest.{" "}
            <Link href="/login" className="font-semibold underline">Log in</Link>{" "}to track your orders in your account.
          </div>
        )}

        {placeError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {placeError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="flex-1 min-w-0 relative">
            <AnimatePresence mode="wait">
              {step === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SectionLabel>Shipping Details</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="First name" value={shipping.firstName} onChange={(v) => handleShippingChange("firstName", v)} error={errors.firstName} />
                    <Field label="Last name" value={shipping.lastName} onChange={(v) => handleShippingChange("lastName", v)} error={errors.lastName} />
                    <Field label="Email address" type="email" value={shipping.email} onChange={(v) => handleShippingChange("email", v)} error={errors.email} />
                    <Field label="Phone number" type="tel" value={shipping.phone} onChange={(v) => handleShippingChange("phone", v)} error={errors.phone} />
                    <Field label="Street Address" value={shipping.address} onChange={(v) => handleShippingChange("address", v)} span="full" error={errors.address} />
                    <Field label="City" value={shipping.city} onChange={(v) => handleShippingChange("city", v)} error={errors.city} />
                    <Field label="State / Province" value={shipping.state} onChange={(v) => handleShippingChange("state", v)} error={errors.state} />
                    <Field label="Zip / Postal Code" value={shipping.zip} onChange={(v) => handleShippingChange("zip", v)} error={errors.zip} />
                    <Field label="Country" value={shipping.country} onChange={(v) => handleShippingChange("country", v)} error={errors.country} />
                  </div>

                  <div className="mt-10">
                    <SectionLabel>Payment Method</SectionLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: "card", label: "Credit / Debit Card", icon: CreditCardIcon },
                        { value: "paypal", label: "PayPal", icon: WalletIcon },
                        { value: "cod", label: "Cash on Delivery", icon: DollarSignIcon },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPaymentMethod(opt.value)}
                            className="flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer"
                            style={{
                              borderColor: paymentMethod === opt.value ? "#004B47" : "#1C1C1C1A",
                              backgroundColor: paymentMethod === opt.value ? "#004B4708" : "#fff",
                              color: paymentMethod === opt.value ? "#004B47" : "#1C1C1C",
                            }}
                          >
                            <Icon size={20} strokeWidth={1.5} />
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-6"
                >
                  <SectionLabel>Review Your Order</SectionLabel>
                  <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: "#1C1C1C0D", backgroundColor: "#fff" }}>
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase mb-2 text-neutral-400">Shipping To</p>
                      <p className="text-sm text-neutral-800">
                        {shipping.firstName} {shipping.lastName}<br />
                        {shipping.address}<br />
                        {shipping.city}, {shipping.state} {shipping.zip}<br />
                        {shipping.country}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">{shipping.email} · {shipping.phone}</p>
                    </div>
                    <div className="border-t pt-4" style={{ borderColor: "#1C1C1C0D" }}>
                      <p className="text-xs font-bold tracking-widest uppercase mb-2 text-neutral-400">Payment Method</p>
                      <p className="flex items-center gap-2 text-sm text-neutral-800">
                        {paymentMethod === "cod" && <DollarSignIcon size={16} strokeWidth={1.5} />}
                        {paymentMethod === "card" && <CreditCardIcon size={16} strokeWidth={1.5} />}
                        {paymentMethod === "paypal" && <WalletIcon size={16} strokeWidth={1.5} />}
                        {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "card" ? "Credit / Debit Card" : "PayPal"}
                      </p>
                    </div>
                    <div className="border-t pt-4" style={{ borderColor: "#1C1C1C0D" }}>
                      <p className="text-xs font-bold tracking-widest uppercase mb-2 text-neutral-400">Items ({cart.length})</p>
                      <div className="space-y-2">
                        {cart.map((item) => {
                          const discounted = item.price * (1 - item.discountPercentage / 100);
                          return (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="font-light text-neutral-700">{item.title} <span className="text-neutral-400">x{item.quantity}</span></span>
                              <span className="font-medium">${(discounted * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="border-t pt-3 space-y-1.5" style={{ borderColor: "#1C1C1C0D" }}>
                      <div className="flex justify-between text-xs text-neutral-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                      {discount > 0 && <div className="flex justify-between text-xs text-red-500"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                      <div className="flex justify-between text-xs text-neutral-500"><span>Shipping</span><span>{shippingFee === 0 ? "Complimentary" : `$${shippingFee.toFixed(2)}`}</span></div>
                      <div className="flex justify-between text-xs text-neutral-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                      <div className="flex justify-between items-baseline border-t pt-2 mt-1">
                        <span className="text-xs font-semibold">Total</span>
                        <span className="text-xl font-light">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    By confirming, you agree to our terms and conditions.
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all border cursor-pointer"
                      style={{ borderColor: "#1C1C1C1F", color: "#1C1C1C" }}
                    >
                      Back to Shipping
                    </button>
                    {paymentMethod === "cod" ? (
                      <button
                        type="button"
                        onClick={placeCodOrder}
                        className="flex-1 sm:flex-none px-10 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all text-white cursor-pointer"
                        style={{ backgroundColor: "#004B47" }}
                      >
                        Confirm Order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={goToPayment}
                        className="flex-1 sm:flex-none px-10 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all text-white cursor-pointer"
                        style={{ backgroundColor: "#004B47" }}
                      >
                        Continue to Payment
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-6"
                >
                  <SectionLabel>Payment Details</SectionLabel>
                  <StripePayment
                    items={cart}
                    shippingAddress={shipping}
                    grandTotal={grandTotal}
                    onSuccess={(orderId) => confirmOrder(orderId)}
                    onError={(msg) => setPlaceError(msg)}
                  />
                  <div className="flex items-center gap-4 mt-2 border-t pt-6" style={{ borderColor: "#1C1C1C0D" }}>
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all border cursor-pointer"
                      style={{ borderColor: "#1C1C1C1F", color: "#1C1C1C" }}
                    >
                      Back to Review
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step === "shipping" && (
              <div className="flex items-center gap-4 mt-10 pt-10 border-t" style={{ borderColor: "#1C1C1C0D" }}>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 sm:flex-none px-10 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all text-white cursor-pointer"
                  style={{ backgroundColor: "#004B47" }}
                >
                  Review Order
                </button>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="lg:sticky lg:top-10">
              <OrderSummary cart={cart} subtotal={subtotal} discount={discount} tax={tax} shipping={shippingFee} total={grandTotal} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type ConfirmationStepProps = {
  items: CartItem[];
  totals: { subtotal: number; discount: number; tax: number; shipping: number; grandTotal: number };
  shipping: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; state: string; zip: string; country: string };
  orderId: string;
};

function ConfirmationStep({ items, totals, shipping, orderId }: ConfirmationStepProps) {
  const shortId = `#ORD-${orderId.slice(-8).toUpperCase()}`;

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden px-4 sm:px-6 lg:px-8 py-16">
      <PageBackgroundDecor />
      {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((cls, i) => (
        <div key={i} className={`absolute w-3.5 h-3.5 ${cls}`} style={{ borderColor: "#004B4733", borderWidth: 1.5 }} />
      ))}

      <div className="relative z-10 w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-600 block animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#004B47", letterSpacing: "0.13em" }}>Order Placed!</span>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-full" style={{ backgroundColor: "#004B47" }}>
            <svg width="22" height="18" viewBox="0 0 20 16" fill="none">
              <path d="M1.5 8.5L6.5 14L18.5 1.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-light leading-tight text-neutral-900" style={{ letterSpacing: "-0.02em" }}>
              Thank you, {shipping.firstName}!
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Your purchase is confirmed. A receipt will be sent to {shipping.email}.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-b py-4 my-6" style={{ borderColor: "#1C1C1C0D" }}>
          <div>
            <p className="text-[11px] text-neutral-400 uppercase font-medium">Order Number</p>
            <p className="text-sm font-semibold mt-0.5 font-mono">{shortId}</p>
          </div>
          <div>
            <p className="text-[11px] text-neutral-400 uppercase font-medium">Delivery Address</p>
            <p className="text-xs text-neutral-600 mt-0.5 leading-normal">
              {shipping.firstName} {shipping.lastName}<br />
              {shipping.address}, {shipping.city}<br />
              {shipping.state} {shipping.zip}, {shipping.country}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[11px] text-neutral-400 uppercase font-medium mb-3">Items Purchased</p>
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const discounted = item.price * (1 - item.discountPercentage / 100);
              return (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-light text-neutral-800">{item.title} <span className="text-neutral-400 text-xs">x{item.quantity}</span></span>
                  <span className="font-medium text-neutral-900">${(discounted * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4 flex flex-col gap-2" style={{ borderColor: "#1C1C1C0D" }}>
          <div className="flex justify-between text-xs text-neutral-500"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
          {totals.discount > 0 && <div className="flex justify-between text-xs text-red-500"><span>Discount</span><span>-${totals.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between text-xs text-neutral-500"><span>Tax (8%)</span><span>${totals.tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-xs text-neutral-500"><span>Shipping</span><span>{totals.shipping === 0 ? "Complimentary" : `$${totals.shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between items-baseline pt-2 border-t mt-1">
            <span className="text-xs font-semibold text-neutral-900">Grand Total</span>
            <span className="text-2xl font-light text-neutral-900">${totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/account/orders" className="flex items-center justify-center w-full py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 rounded-full" style={{ backgroundColor: "#004B47" }}>
            View My Orders
          </Link>
          <Link href="/shop" className="flex items-center justify-center w-full py-3.5 text-sm font-medium text-neutral-700 border border-neutral-200 transition-colors hover:bg-neutral-50 rounded-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  span?: "full";
  error?: string;
};

function Field({ label, value, onChange, type = "text", placeholder, span, error }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={span === "full" ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-medium mb-1.5 tracking-wide text-neutral-500" style={{ letterSpacing: "0.06em" }}>
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none font-light transition-all border"
        style={{
          borderColor: error ? "#B3261E" : focused ? "#004B47" : "#1C1C1C1A",
          backgroundColor: "#fff",
          color: "#1C1C1C",
          boxShadow: error ? "0 0 0 3px #B3261E10" : focused ? "0 0 0 3px #004B4710" : "none",
        }}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

type OrderSummaryProps = {
  cart: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
};

function OrderSummary({ cart, subtotal, discount, tax, shipping, total }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl overflow-hidden relative border p-6" style={{ backgroundColor: "#F0EDE6" }}>
      <p className="text-xs font-bold tracking-widest uppercase mb-4 text-neutral-500" style={{ letterSpacing: "0.12em" }}>Order Summary</p>
      <div className="flex flex-col gap-4 mb-6 pb-6 border-b" style={{ borderColor: "#1C1C1C0D" }}>
        {cart.map((item) => {
          const discounted = item.price * (1 - item.discountPercentage / 100);
          return (
            <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-medium mt-0.5" style={{ backgroundColor: "#1C1C1C0D", color: "#1C1C1C99" }}>
                  {item.quantity}
                </span>
                <span className="font-light truncate text-neutral-800 leading-normal">{item.title}</span>
              </div>
              <span className="font-medium text-neutral-900">${(discounted * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 text-sm mb-6 pb-6 border-b" style={{ borderColor: "#1C1C1C0D" }}>
        <div className="flex items-center justify-between"><span className="font-light text-neutral-500">Subtotal</span><span className="text-neutral-900">${subtotal.toFixed(2)}</span></div>
        {discount > 0 && <div className="flex items-center justify-between"><span className="font-light text-neutral-500">Discount</span><span className="font-medium text-red-600">-${discount.toFixed(2)}</span></div>}
        <div className="flex items-center justify-between"><span className="font-light text-neutral-500">Delivery</span><span className="font-medium text-emerald-700">{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</span></div>
        <div className="flex items-center justify-between"><span className="font-light text-neutral-500">Tax (8%)</span><span className="text-neutral-900">${tax.toFixed(2)}</span></div>
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-sm font-semibold text-neutral-700">TOTAL</span>
        <span className="text-2xl font-light text-neutral-900">${total.toFixed(2)}</span>
      </div>
      <div className="rounded-xl p-4 bg-white border">
        <p className="text-xs font-semibold text-emerald-800">Complimentary delivery for orders over $100</p>
        <p className="text-xs text-neutral-500 mt-1 leading-normal">Assembly and placement available. Arrives in 5–10 business days.</p>
      </div>
    </div>
  );
}

function ProgressIndicator({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="flex items-center w-full max-w-md">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium border" style={{ backgroundColor: i <= stepIndex ? "#004B47" : "transparent", borderColor: i <= stepIndex ? "#004B47" : "#1C1C1C26", color: i <= stepIndex ? "#fff" : "#1C1C1C66" }}>
              {i < stepIndex ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="text-xs font-semibold hidden sm:inline" style={{ color: i <= stepIndex ? "#1C1C1C" : "#1C1C1C66" }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="flex-1 mx-3 sm:mx-4 h-px bg-neutral-200" />}
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">{children}</p>
      <div className="flex-1 h-px bg-neutral-200" />
    </div>
  );
}

function PageBackgroundDecor() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="#004B47" fill="none" strokeWidth="0.7" opacity="0.1">
        <line x1="32" y1="32" x2="32" y2="100" />
        <line x1="32" y1="32" x2="100" y2="32" />
      </g>
    </svg>
  );
}