import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, message: "productId parameter is required." }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, reviews }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong fetching reviews." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: productId, rating, comment." },
        { status: 400 }
      );
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ success: false, message: "Rating must be a number between 1 and 5." }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "You have already reviewed this product." }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: { productId, userId: user.id, rating: ratingNum, comment },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat((agg._avg.rating ?? 0).toFixed(1)),
        reviewCount: agg._count,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "You must be logged in to post a review." }, { status: 401 });
    }
    console.error("Create review error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit your review." }, { status: 500 });
  }
}
