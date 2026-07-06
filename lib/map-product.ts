export type ClientProduct = {
  id: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  category: string;
  color: string | undefined;
  imageUrl: string;
  thumbnail: string;
  stock: number;
  details: string | null;
  material: string | null;
  dimensions: string | null;
  weight: number | null;
  images: string[];
  colors: { name: string; hex: string | null }[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isActive: boolean;
  slug: string;
  salePrice: number | null;
};

export function mapProduct(p: {
  id: string;
  name: string;
  brand: string | null;
  description: string;
  price: { toNumber?: () => number; toString?: () => string } | number;
  salePrice: { toNumber?: () => number; toString?: () => string } | number | null;
  rating: number | null;
  reviewCount: number | null;
  stock: number;
  details: string | null;
  material: string | null;
  dimensions: string | null;
  weight: { toNumber?: () => number } | number | null;
  slug: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isActive: boolean;
  category?: { slug: string } | null;
  images?: { url: string }[] | null;
  colors?: { name: string; hex: string | null }[] | null;
}): ClientProduct {
  const price = Number(p.price);
  const salePrice = p.salePrice ? Number(p.salePrice) : null;
  const imageUrl = p.images && p.images.length > 0 ? p.images[0].url : "";

  return {
    id: p.id,
    title: p.name,
    brand: p.brand || "Aristocraft",
    description: p.description,
    price,
    discountPercentage: salePrice
      ? Math.round(((price - salePrice) / price) * 100)
      : 0,
    rating: p.rating != null ? Number(p.rating) : 0,
    reviewCount: p.reviewCount != null ? Number(p.reviewCount) : 0,
    category: p.category?.slug || "",
    color: p.colors && p.colors.length > 0 ? p.colors[0].name : undefined,
    imageUrl,
    thumbnail: imageUrl,
    stock: p.stock,
    details: p.details ?? null,
    material: p.material ?? null,
    dimensions: p.dimensions ?? null,
    weight: p.weight != null ? Number(p.weight) : null,
    images: p.images ? p.images.map((img) => img.url) : [],
    colors: p.colors
      ? p.colors.map((c) => ({ name: c.name, hex: c.hex ?? null }))
      : [],
    isFeatured: p.isFeatured,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    isOnSale: p.isOnSale,
    isActive: p.isActive,
    slug: p.slug,
    salePrice,
  };
}
