import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, User, Mail, Phone, CreditCard } from 'lucide-react';
import OrderStatusDropdown from '@/components/admin/OrderStatusDropdown';
import PaymentStatusDropdown from '@/components/admin/PaymentStatusDropdown';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 rounded-md hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-charcoal"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-neutral-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items — Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2">
              <Package className="h-4 w-4 text-neutral-500" />
              <h2 className="font-medium text-charcoal">Order Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">{item.product.name}</p>
                    <p className="text-sm text-neutral-500">
                      {formatCurrency(Number(item.price))} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-charcoal">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-charcoal">Total</span>
                <span className="text-lg font-bold text-charcoal">{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar — Right */}
        <div className="space-y-6">
          {/* Status Controls */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <h2 className="font-medium text-charcoal">Order Status</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1 block">
                  Fulfillment
                </label>
                <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1 block">
                  Payment
                </label>
                <PaymentStatusDropdown orderId={order.id} isPaid={order.isPaid} />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1 block">
                  Method
                </label>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <CreditCard className="h-4 w-4 text-neutral-400" />
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-3">
            <h2 className="font-medium text-charcoal">Customer</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-700">
                <User className="h-4 w-4 text-neutral-400" />
                {order.customerName}
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Mail className="h-4 w-4 text-neutral-400" />
                {order.customerEmail}
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Phone className="h-4 w-4 text-neutral-400" />
                {order.phone}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-3">
            <h2 className="font-medium text-charcoal flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-400" />
              Shipping Address
            </h2>
            <div className="text-sm text-neutral-700 leading-relaxed">
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.zipCode}</p>
              <p>{order.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
