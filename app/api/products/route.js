import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

const PUBLIC_CACHE = "public, s-maxage=60, stale-while-revalidate=300";

function mapProduct(p) {
  const price = Number(p.price);
  const salePrice = p.salePrice ? Number(p.salePrice) : null;
  return {
    id: p.id,
    title: p.name,
    brand: p.brand || "Aristocraft",
    description: p.description,
    price,
    salePrice,
    discountPercentage: salePrice ? Math.round(((price - salePrice) / price) * 100) : 0,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    category: p.category?.slug || "",
    color: p.colors?.[0]?.name || undefined,
    imageUrl: p.images?.[0]?.url || "",
    thumbnail: p.images?.[0]?.url || "",
    stock: p.stock,
    details: p.details ?? null,
    material: p.material ?? null,
    dimensions: p.dimensions ?? null,
    weight: p.weight != null ? Number(p.weight) : null,
    images: p.images ? p.images.map((img) => img.url) : [],
    colors: p.colors ? p.colors.map((c) => ({ name: c.name, hex: c.hex ?? null })) : [],
    isFeatured: p.isFeatured,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    isOnSale: p.isOnSale,
    isActive: p.isActive,
    slug: p.slug,
    salePrice,
  };
}

function generateSlug(name) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  return `${base}-${Date.now()}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const where = { isActive: true };
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("newArrival");
    const bestSeller = searchParams.get("bestSeller");
    const onSale = searchParams.get("onSale");
    const showAll = searchParams.get("showAll");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "100", 10) || 100));

    if (showAll === "true") delete where.isActive;
    if (categorySlug) where.category = { slug: categorySlug };
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (featured === "true") where.isFeatured = true;
    if (newArrival === "true") where.isNewArrival = true;
    if (bestSeller === "true") where.isBestSeller = true;
    if (onSale === "true") where.isOnSale = true;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { slug: true } }, images: { select: { url: true } }, colors: { select: { name: true, hex: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const mapped = showAll === "true" ? products : products.map(mapProduct);

    return NextResponse.json({
      success: true,
      products: mapped,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, { headers: { "Cache-Control": PUBLIC_CACHE } });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireStaff();
    const body = await request.json();
    const { name, description, price, categoryId, images, colors, slug, ...rest } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { success: false, message: "name, description, price, and categoryId are required." },
        { status: 400 }
      );
    }

    const finalSlug = slug || generateSlug(name);

    const createData = {
      name,
      description,
      price,
      categoryId,
      slug: finalSlug,
      stock: rest.stock ? Number(rest.stock) : 0,
      isFeatured: rest.isFeatured ?? false,
      isNewArrival: rest.isNewArrival ?? false,
      isBestSeller: rest.isBestSeller ?? false,
      isOnSale: rest.isOnSale ?? false,
      isActive: rest.isActive ?? true,
      ...(rest.details && { details: rest.details }),
      ...(rest.material && { material: rest.material }),
      ...(rest.dimensions && { dimensions: rest.dimensions }),
      ...(rest.weight != null && rest.weight !== "" && { weight: Number(rest.weight) }),
      ...(rest.sku && { sku: rest.sku }),
      ...(rest.brand && { brand: rest.brand }),
      ...(rest.salePrice && { salePrice: rest.salePrice }),
    };

    if (images?.length > 0) {
      createData.images = { create: images.map((img) => ({ url: img.url, alt: img.alt || name })) };
    }
    if (colors?.length > 0) {
      createData.colors = { create: colors.map((c) => ({ name: c.name, hex: c.hex || null })) };
    }

    const product = await prisma.product.create({
      data: createData,
      include: { category: { select: { slug: true } }, images: { select: { url: true } }, colors: { select: { name: true, hex: true } } },
    });

    return NextResponse.json({ success: true, product: mapProduct(product) });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, message: "Failed to create product." }, { status: 500 });
  }
}
