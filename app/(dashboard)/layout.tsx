"use client";

import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6EF]">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-8 pb-6 sm:px-6 lg:px-8 lg:pt-10 lg:pb-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
