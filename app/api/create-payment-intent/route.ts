import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items provided." },
        { status: 400 }
      );
    }

    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    for (const item of items) {
      const product = products.find((p: { id: string }) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.productId} not found.` },
          { status: 400 }
        );
      }
      const price = Number(product.salePrice ?? product.price);
      subtotal += price * item.quantity;
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    const isProduction = process.env.NODE_ENV === "production";
    const hasRealKey = !!secretKey && !secretKey.includes("Dummy") && !secretKey.startsWith("sk_test_fake");
    const useSimulation = !isProduction || !hasRealKey;

    if (useSimulation) {
      return NextResponse.json({
        success: true,
        clientSecret: `seti_simulated_secret_${Date.now()}`,
        simulated: true,
      });
    }

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secretKey, {
      apiVersion: "2023-10-16" as any,
    });

    const discount = 0;
    const taxable = subtotal - discount;
    const tax = taxable * 0.08;
    const shippingFee = taxable > 100 || taxable <= 0 ? 0 : 9.99;
    const totalAmount = Math.round((taxable + tax + shippingFee) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create payment intent." },
      { status: 500 }
    );
  }
}
