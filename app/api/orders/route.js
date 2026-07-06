import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireStaff } from "@/lib/auth";

const orderIncludes = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  items: {
    include: {
      product: {
        select: {
          id: true, name: true, slug: true,
          images: { select: { url: true, alt: true }, take: 1 },
          colors: { select: { name: true, hex: true } },
          category: { select: { name: true, slug: true } },
        },
      },
    },
  },
};

export async function GET(request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");

    if (all === "true") {
      await requireStaff();
      const orders = await prisma.order.findMany({
        include: orderIncludes,
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, orders });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: { take: 1, select: { url: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    const message = error?.message || "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
    }
    console.error("Get orders error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request) {
  let user = null;
  try {
    user = await requireAuth();
  } catch {}

  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, notes, guestEmail, guestPhone } = body;

    if (!user && !guestEmail) {
      return NextResponse.json(
        { success: false, message: "Please provide an email address to place a guest order." },
        { status: 400 }
      );
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order must contain at least one item." },
        { status: 400 }
      );
    }
    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Shipping address is required." },
        { status: 400 }
      );
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, salePrice: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, message: "One or more products no longer exist." },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const price = Number(product.salePrice ?? product.price);
      subtotal += price * item.quantity;
      return { productId: product.id, quantity: item.quantity, price, color: item.color || null };
    });

    const shippingCost = subtotal >= 100 ? 0 : 15;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        userId: user ? user.id : null,
        guestEmail: user ? null : (guestEmail || null),
        guestPhone: user ? null : (guestPhone || null),
        subtotal, shippingCost, discount: 0, total,
        paymentMethod: paymentMethod || null,
        shippingAddress,
        notes: notes || null,
        items: { create: orderItemsData },
      },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
    });

    if (user) {
      await prisma.cartItem.deleteMany({ where: { userId: user.id } });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong placing your order." }, { status: 500 });
  }
}
