import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { mapProduct } from "@/lib/map-product";
import type { ClientProduct } from "@/lib/map-product";
import ProductPageClient from "@/components/products/ProductPageClient";
import { ToastProvider } from "@/components/ui/toast";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return {};

  return {
    title: `${product.name} — Aristocraft`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Aristocraft`,
      description: product.description,
    },
  };
}

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      colors: true,
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 3,
    include: {
      images: true,
      colors: true,
      category: true,
    },
  });

  const clientProduct = mapProduct(product as any);
  const clientRelated = related.map((p) => mapProduct(p as any));

  return (
    <ToastProvider>
      <ProductPageClient product={clientProduct} relatedProducts={clientRelated} />
    </ToastProvider>
  );
}
