'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to bag`);
    openCart();
  };

  const image = product.images?.[0] || '/placeholder.jpg';

  return (
    <div className={cn("group flex flex-col gap-4", className)}>
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-md bg-cream w-full">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Hover overlay with button */}
        <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/10 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100">
          <Button 
            onClick={handleAddToCart}
            className="w-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Bag
          </Button>
        </div>
      </Link>

      <div className="flex flex-col items-center text-center space-y-1">
        {product.category && (
          <span className="text-xs uppercase tracking-widest text-charcoal/60 font-body">
            {typeof product.category === 'object' && 'name' in product.category ? product.category.name : 'Cosmetics'}
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="hover:text-rose-gold transition-colors">
          <h3 className="font-heading text-lg text-charcoal">{product.name}</h3>
        </Link>
        <p className="text-sm text-charcoal/80 font-body">{formatCurrency(product.price)}</p>
      </div>
    </div>
  );
}
