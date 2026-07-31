'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cart';
import { useSession } from 'next-auth/react';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const hasSynced = useRef(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && !hasSynced.current) {
      hasSynced.current = true;
      const localItems = useCartStore.getState().items;

      fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: localItems }),
      })
        .then((res) => res.json())
        .then((dbCartItems) => {
          if (Array.isArray(dbCartItems)) {
            const mappedItems = dbCartItems.map((dbItem: any) => ({
              ...dbItem.product,
              quantity: dbItem.quantity
            }));
            useCartStore.getState().setItems(mappedItems);
          }
        })
        .catch(console.error);
    }
  }, [status]);

  return <>{children}</>;
}
