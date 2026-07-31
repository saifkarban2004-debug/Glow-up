import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed.", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const orderId = session.metadata?.orderId;
      
      if (orderId) {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            isPaid: true,
            status: "PROCESSING",
            stripeSessionId: session.id,
          },
        });
        console.log(`Order ${orderId} marked as paid.`);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook event", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
