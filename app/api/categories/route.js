import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-static";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        heroImage: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      heroImage: cat.heroImage,
      productCount: cat._count.products,
    }));

    return NextResponse.json({ success: true, categories: result }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
