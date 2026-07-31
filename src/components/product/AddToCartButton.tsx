'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';

import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      ...product,
      price: typeof product.price === 'number' ? product.price : Number(product.price),
    } as unknown as Product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex items-center justify-center w-full gap-2 px-8 py-4 text-sm font-medium tracking-wider text-white transition-all bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
    >
      <ShoppingBag className="w-5 h-5" />
      <span>ADD TO CART</span>
    </button>
  );
}
