import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    const body = await req.json();
    const { items, formData } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!formData) {
      return NextResponse.json(
        { error: "Shipping information is required" },
        { status: 400 }
      );
    }

    const emailToUse = authSession?.user?.email || formData.email;

    let totalAmount = 0;
    const orderItemsData = items.map((item: any) => {
      totalAmount += item.price * item.quantity;
      return {
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        total: totalAmount,
        status: "PENDING",
        isPaid: false,
        paymentMethod: "COD",
        customerName: formData.firstName + " " + formData.lastName,
        customerEmail: emailToUse,
        phone: formData.phone || "N/A",
        address: formData.address,
        city: formData.city,
        state: formData.state || "N/A",
        zipCode: formData.zipCode,
        country: formData.country || "EG",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Build WhatsApp message
    const itemLines = order.items
      .map(
        (item) =>
          `- ${item.quantity}x ${item.product.name} ($${Number(item.price).toFixed(2)})`
      )
      .join("\n");

    const message = `Hello, I would like to place an order! 🛍️

Order ID: #${order.id.slice(-8).toUpperCase()}

Items:
${itemLines}

Total: $${Number(order.total).toFixed(2)}

Shipping to: ${order.address}, ${order.city}, ${order.country}

Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/201554397756?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      orderId: order.id,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
