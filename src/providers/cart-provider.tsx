'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

/**
 * CartProvider
 * 
 * Handles client-side hydration of the Zustand cart store.
 * Because we use `skipHydration: true` in the persist middleware,
 * we must manually trigger rehydration on the client to prevent
 * SSR hydration mismatches (server renders 0 items, client has
 * localStorage items).
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
