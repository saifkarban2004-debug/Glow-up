import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

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
        customerName: formData.firstName + " " + formData.lastName,
        customerEmail: emailToUse,
        phone: formData.phone || "N/A",
        address: formData.address,
        city: formData.city,
        state: formData.state || "N/A",
        zipCode: formData.zipCode,
        country: formData.country || "US",
        items: {
          create: orderItemsData,
        },
      },
    });

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
