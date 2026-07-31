import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Merge guest cart with user cart
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Merge logic: Combine quantities
    for (const item of items) {
      const existing = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: item.id,
          },
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            userId: session.user.id,
            productId: item.id,
            quantity: item.quantity,
          },
        });
      }
    }

    // Return the updated merged cart
    const mergedCart = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    return NextResponse.json(mergedCart);
  } catch (error) {
    console.error("Cart Sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
