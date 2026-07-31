import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orders = await prisma.order.findMany();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, status, ...data } = body;

    if (!id) {
      return new NextResponse('Order ID is required', { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status, ...data }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDERS_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
