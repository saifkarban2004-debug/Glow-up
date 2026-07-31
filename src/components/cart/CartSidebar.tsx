'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CartSidebar() {
  const { isOpen, items, closeCart, updateQuantity, removeItem, subtotal } = useCartStore();
  const cartRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            ref={cartRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-soft-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
              <h2 className="font-heading text-xl text-charcoal">Your Bag</h2>
              <button
                onClick={closeCart}
                className="rounded-full p-2 text-charcoal/60 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close bag</span>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-charcoal/20" />
                  <p className="font-heading text-lg text-charcoal">Your bag is empty</p>
                  <Button onClick={closeCart} variant="outline" className="mt-4">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-cream">
                        <Image
                          src={item.images?.[0] || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-heading text-base text-charcoal">
                              <Link href={`/product/${item.slug}`} onClick={closeCart}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mt-1 font-body text-sm text-charcoal/60">
                              {formatCurrency(item.price as unknown as number)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-charcoal/40 hover:text-rose-gold transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove {item.name}</span>
                          </button>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded border border-charcoal/20">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-charcoal/60 hover:text-charcoal"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 py-1 font-body text-sm text-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-charcoal/60 hover:text-charcoal"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-body font-medium text-charcoal">
                            {formatCurrency((item.price as unknown as number) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-charcoal/10 bg-soft-white/80 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between text-base font-medium text-charcoal">
                  <span className="font-heading">Subtotal</span>
                  <span className="font-body">{formatCurrency(subtotal())}</span>
                </div>
                <p className="mb-6 font-body text-xs text-charcoal/60">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
