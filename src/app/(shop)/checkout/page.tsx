'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MessageCircle, ShieldCheck, Truck } from 'lucide-react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream px-4">
        <p className="text-charcoal/60 font-body animate-pulse">Checking secure session...</p>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'EG',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
          })),
          formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Clear the cart
      clearCart();

      // Redirect to WhatsApp
      window.location.href = data.whatsappUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
      setIsLoading(false);
    }
  };

  const shipping = 0; // Free shipping for luxury
  const total = subtotal() + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4">
        <h1 className="font-heading text-3xl text-charcoal mb-4">Your bag is empty</h1>
        <p className="text-charcoal/60 mb-8 font-body">Add some luxury items to your bag to proceed.</p>
        <Button onClick={() => window.location.href = '/'}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-heading text-4xl text-charcoal mb-2">Checkout</h1>
          <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-charcoal/60">
            <div className="flex items-center">
              <Truck className="w-4 h-4 mr-2" />
              <span className="font-body uppercase tracking-widest">Free Delivery</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span className="font-body uppercase tracking-widest">Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Form */}
          <div className="w-full lg:w-3/5">
            <form onSubmit={handleSubmit} className="bg-soft-white p-8 md:p-12 rounded-2xl shadow-xl shadow-charcoal/5 border border-blush/30">
              <h2 className="font-heading text-2xl text-charcoal mb-8 pb-4 border-b border-champagne/30">
                Contact & Shipping
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-body">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="+20..."
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="city" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-charcoal/80 mb-2 font-body">Country</label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent border border-blush rounded-lg focus:ring-1 focus:ring-rose-gold focus:border-rose-gold outline-none transition-all appearance-none"
                  >
                    <option value="EG">Egypt</option>
                  </select>
                </div>
              </div>

              {/* COD Info Banner */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Cash on Delivery via WhatsApp</p>
                  <p className="text-xs text-green-600 mt-1">Your order will be sent to us via WhatsApp for confirmation. Pay when your package arrives!</p>
                </div>
              </div>

              <div className="mt-8">
                <Button type="submit" size="lg" className="w-full py-4 text-lg flex items-center justify-center gap-3" isLoading={isLoading}>
                  <MessageCircle className="w-5 h-5" />
                  Place Order via WhatsApp
                </Button>
                <p className="text-center text-xs text-charcoal/40 mt-4 font-body">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-charcoal text-cream p-8 md:p-12 rounded-2xl sticky top-24">
              <h2 className="font-heading text-2xl mb-8 pb-4 border-b border-cream/20">
                Order Summary
              </h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 bg-white rounded-md overflow-hidden">
                      <Image
                        src={item.images?.[0] || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-heading text-sm text-soft-white truncate">{item.name}</h3>
                      <p className="text-xs text-champagne/80 mt-1 font-body">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-body text-sm">{formatCurrency((item.price as unknown as number) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream/20 pt-6 space-y-4 font-body text-sm">
                <div className="flex justify-between text-cream/80">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal())}</span>
                </div>
                <div className="flex justify-between text-cream/80">
                  <span>Shipping</span>
                  <span className="text-champagne">Complimentary</span>
                </div>
                <div className="flex justify-between text-cream/80">
                  <span>Payment</span>
                  <span className="text-champagne">Cash on Delivery</span>
                </div>
                <div className="border-t border-cream/20 pt-6 mt-4 flex justify-between items-center text-lg">
                  <span className="font-heading">Total</span>
                  <span className="font-body font-medium text-rose-gold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
