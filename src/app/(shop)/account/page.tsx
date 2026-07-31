import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Package, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export const metadata = {
  title: 'My Account | Glow Up',
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    case 'PROCESSING':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Package className="w-3.5 h-3.5" /> Processing</span>;
    case 'SHIPPED':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
    case 'DELIVERED':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
    case 'CANCELLED':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
    default:
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
  }
};

export default async function AccountPage() {
  const session = await auth();

  if (!session || session.user.role === 'admin') {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: {
      customerEmail: session.user.email!,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-cream/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-champagne/40 p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {session.user.image ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-rose-gold/20 shadow-sm">
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-champagne/30 text-charcoal flex items-center justify-center text-3xl font-heading border-2 border-rose-gold/20">
                {session.user.name?.charAt(0) || 'U'}
              </div>
            )}
            
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-3xl font-heading text-charcoal tracking-wide">
                {session.user.name}
              </h1>
              <p className="text-charcoal/60 font-body text-sm">
                {session.user.email}
              </p>
            </div>
          </div>
          
          <SignOutButton />
        </div>

        {/* Order History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading text-charcoal tracking-wide flex items-center gap-3">
            <Package className="w-6 h-6 text-rose-gold" />
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-champagne/40 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-charcoal/40" />
              </div>
              <h3 className="text-xl font-heading text-charcoal mb-2">No orders yet</h3>
              <p className="text-charcoal/60 font-body mb-6">When you place an order, it will appear here.</p>
              <Link 
                href="/"
                className="inline-block bg-charcoal text-white px-8 py-3 rounded-lg hover:bg-black transition-colors font-medium tracking-wide uppercase text-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-champagne/40 shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-cream/20 px-6 py-4 border-b border-champagne/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm font-medium text-charcoal">
                        {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-sm font-semibold text-charcoal">${order.total.toString()}</p>
                      </div>
                      <div className="h-10 w-px bg-champagne/60 hidden sm:block"></div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <ul className="divide-y divide-champagne/20">
                      {order.items.map((item) => (
                        <li key={item.id} className="py-4 flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden bg-cream border border-champagne/40 flex-shrink-0">
                            {item.product.images[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-charcoal/30">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${item.product.slug}`} className="text-base font-medium text-charcoal hover:text-rose-gold transition-colors truncate block">
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-charcoal/60 mt-0.5">
                              Qty: {item.quantity} × ${item.price.toString()}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-medium text-charcoal">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Dummy ShoppingBag component just for the empty state
function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
