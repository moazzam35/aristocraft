import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true, name: true, brand: true, description: true,
            price: true, salePrice: true, rating: true, reviewCount: true,
            stock: true, categoryId: true,
            images: { select: { url: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const products = wishlistItems.map((item) => {
      const p = item.product;
      const price = Number(p.price);
      const salePrice = p.salePrice ? Number(p.salePrice) : null;
      return {
        id: p.id,
        title: p.name,
        brand: p.brand || "Aristocraft",
        description: p.description,
        price,
        discountPercentage: salePrice ? Math.round(((price - salePrice) / price) * 100) : 0,
        rating: p.rating,
        category: p.categoryId,
        imageUrl: p.images[0]?.url || "/images/placeholder.jpg",
        thumbnail: p.images[0]?.url || "/images/placeholder.jpg",
        stock: p.stock,
        salePrice,
        reviewCount: p.reviewCount,
      };
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Please log in to view your wishlist." }, { status: 401 });
    }
    console.error("Get wishlist error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong fetching your wishlist." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: "productId is required." }, { status: 400 });
    }

    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: {},
      create: { userId: user.id, productId },
    });

    return NextResponse.json({ success: true, message: "Added to wishlist.", item });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Please log in to update your wishlist." }, { status: 401 });
    }
    console.error("Add wishlist error:", error);
    return NextResponse.json({ success: false, message: "Failed to add item to wishlist." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, message: "productId parameter is required." }, { status: 400 });
    }

    await prisma.wishlist.deleteMany({ where: { userId: user.id, productId } });
    return NextResponse.json({ success: true, message: "Removed from wishlist." });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Please log in to update your wishlist." }, { status: 401 });
    }
    console.error("Delete wishlist error:", error);
    return NextResponse.json({ success: false, message: "Failed to remove item from wishlist." }, { status: 500 });
  }
}
