"use client";

import React, { createContext, useContext, useState, useCallback, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextType = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

const ToastItem = memo(function ToastItem({ toast }: { toast: Toast }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-2xl pointer-events-auto"
      style={{
        backgroundColor: "#1C1C1C",
        boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
        minWidth: "260px",
      }}
    >
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
        style={{ backgroundColor: toast.variant === "success" ? "#004B47" : "#B3261E" }}
      >
        {toast.variant === "success" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-white">{toast.message}</span>
    </motion.div>
  );
});

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
      role="status"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
