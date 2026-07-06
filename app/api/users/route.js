import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaff, requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireStaff();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    const message = error?.message || String(error);
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, message: "Not authorized." },
        { status: 403 }
      );
    }
    console.error("Get users error:", error?.stack || error);
    return NextResponse.json(
      { success: false, message: message || "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, message: "userId and role are required." },
        { status: 400 }
      );
    }

    if (role !== "STAFF" && role !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, message: "You can only assign STAFF or CUSTOMER roles." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (targetUser.role === "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Cannot change an Admin's role." },
        { status: 403 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    const message = error?.message || String(error);
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, message: "Not authorized." },
        { status: 403 }
      );
    }
    console.error("Update user role error:", error?.stack || error);
    return NextResponse.json(
      { success: false, message: message || "Something went wrong." },
      { status: 500 }
    );
  }
}
