'use client';

import Link from 'next/link';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems, openCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  // Safety fallback in case totalItems is not a function or missing
  const count = typeof totalItems === 'function' ? totalItems() : (totalItems || 0);

  const navLinks = [
    { name: 'Skincare', href: '/category/skincare' },
    { name: 'Makeup', href: '/category/makeup' },
    { name: 'Fragrance', href: '/category/fragrance' },
    { name: 'Accessories', href: '/category/accessories' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-cream/80 backdrop-blur-md border-b border-champagne/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-heading text-2xl tracking-widest text-charcoal uppercase">
              Glow Up
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="group relative font-body text-charcoal/80 hover:text-charcoal transition-colors uppercase text-sm tracking-widest">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-charcoal transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <Link 
              href={!session ? '/login' : session.user?.role === 'admin' ? '/admin' : '/account'} 
              className="text-charcoal/80 hover:text-charcoal transition-colors hidden md:flex items-center gap-2" 
              aria-label="User account"
            >
              <User className="h-5 w-5" />
              {session?.user?.name && (
                <span className="text-sm font-medium tracking-wide">
                  Hi, {session.user.name.split(' ')[0]}
                </span>
              )}
            </Link>
            <button onClick={openCart} className="text-charcoal/80 hover:text-charcoal transition-colors relative" aria-label="Open cart">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-gold text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button className="md:hidden text-charcoal/80 hover:text-charcoal" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
