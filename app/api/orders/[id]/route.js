import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireStaff } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            product: {
              include: {
                images: { select: { url: true, alt: true } },
                colors: { select: { name: true, hex: true } },
                category: { select: { name: true, slug: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (order.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json(
        { success: false, message: "Not authorized." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireStaff();
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, trackingNumber } = body;

    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const validPaymentStatuses = ["UNPAID", "PAID", "FAILED", "REFUNDED"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status." },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment status." },
        { status: 400 }
      );
    }

    const data = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;

    const order = await prisma.order.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            product: {
              include: {
                images: { select: { url: true, alt: true } },
                colors: { select: { name: true, hex: true } },
                category: { select: { name: true, slug: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, message: "Not authorized." },
        { status: 403 }
      );
    }
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}