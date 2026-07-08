import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

const productInclude = {
  category: { select: { slug: true } },
  images: { select: { url: true } },
  colors: { select: { name: true, hex: true } },
};

function mapProduct(product: any) {
  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  return {
    id: product.id,
    title: product.name,
    brand: product.brand || "Aristocraft",
    description: product.description,
    price,
    salePrice,
    discountPercentage: salePrice ? Math.round(((price - salePrice) / price) * 100) : 0,
    rating: product.rating,
    category: product.category?.slug,
    color: product.colors?.[0]?.name || null,
    imageUrl: product.images?.[0]?.url || "/images/placeholder.jpg",
    thumbnail: product.images?.[0]?.url || "/images/placeholder.jpg",
    stock: product.stock,
    details: product.details,
    material: product.material,
    dimensions: product.dimensions,
    weight: product.weight,
    images: product.images ? product.images.map((img: any) => img.url) : [],
    colors: product.colors ? product.colors.map((c: any) => ({ name: c.name, hex: c.hex })) : [],
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    isOnSale: product.isOnSale,
    isActive: product.isActive,
    slug: product.slug,
  };
}

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: productInclude,
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: mapProduct(product) }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaff();
    const { id } = await props.params;
    const body = await request.json();
    const { images, colors, ...scalarFields } = body;

    const allowedScalars = ["name", "description", "details", "material", "dimensions",
      "weight", "sku", "brand", "price", "salePrice", "stock", "categoryId",
      "isFeatured", "isNewArrival", "isBestSeller", "isOnSale", "isActive", "slug"];

    const data: Record<string, unknown> = {};
    for (const key of allowedScalars) {
      if (key in scalarFields) data[key] = scalarFields[key];
    }

    let updatedProduct;
    await prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: { url: string; alt?: string }) => ({
              productId: id, url: img.url, alt: img.alt || null,
            })),
          });
        }
      }
      if (colors !== undefined) {
        await tx.productColor.deleteMany({ where: { productId: id } });
        if (colors.length > 0) {
          await tx.productColor.createMany({
            data: colors.map((c: { name: string; hex?: string }) => ({
              productId: id, name: c.name, hex: c.hex || null,
            })),
          });
        }
      }
      updatedProduct = await tx.product.update({
        where: { id },
        data,
        include: productInclude,
      });
    });

    return NextResponse.json({ success: true, product: mapProduct(updatedProduct) });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaff();
    const { id } = await props.params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product." }, { status: 500 });
  }
}
