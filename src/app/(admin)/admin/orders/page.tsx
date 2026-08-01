import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Eye } from 'lucide-react';
import OrderStatusDropdown from '@/components/admin/OrderStatusDropdown';
import PaymentStatusDropdown from '@/components/admin/PaymentStatusDropdown';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal">Orders</h1>
      </div>

      <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-900">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Order ID</th>
                <th scope="col" className="px-6 py-4 font-medium">Customer</th>
                <th scope="col" className="px-6 py-4 font-medium">Date</th>
                <th scope="col" className="px-6 py-4 font-medium">Total</th>
                <th scope="col" className="px-6 py-4 font-medium">Payment</th>
                <th scope="col" className="px-6 py-4 font-medium">Fulfillment</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-charcoal">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">{order.customerName || 'Guest'}</span>
                        <span className="text-xs text-neutral-500">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{formatCurrency(Number(order.total))}</td>
                    <td className="px-6 py-4">
                      <PaymentStatusDropdown orderId={order.id} isPaid={order.isPaid} />
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-neutral-400 hover:text-charcoal transition-colors rounded-md hover:bg-neutral-100"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
