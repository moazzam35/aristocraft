import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { ToastProvider } from "@/components/ui/toast";
import FloatingHeader from "@/components/layout/FloatingHeader";

export const metadata: Metadata = {
  title: {
    default: "Aristocraft — Premium Furniture & Luxury Interiors",
    template: "%s — Aristocraft",
  },
  description: "Explore Aristocraft's premium furniture collections for modern, elegant, and luxury home interiors.",
  openGraph: {
    title: "Aristocraft — Premium Furniture & Luxury Interiors",
    description: "Explore Aristocraft's premium furniture collections for modern, elegant, and luxury home interiors.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://aristocraft.com",
    siteName: "Aristocraft",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aristocraft — Premium Furniture & Luxury Interiors",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aristocraft — Premium Furniture & Luxury Interiors",
    description: "Explore Aristocraft's premium furniture collections for modern, elegant, and luxury home interiors.",
    images: ["/images/og-image.jpg"],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <FloatingHeader />
      <div className="relative">
        {children}
      </div>
      <Footer />
    </ToastProvider>
  );
}