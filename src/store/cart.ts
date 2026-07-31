import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setItems: (items) => set({ items }),
      addItem: (product, quantity = 1) => {
        const state = get();
        const existingItem = state.items.find((item) => item.id === product.id);
        const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
        
        set((state) => ({
          items: existingItem
            ? state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: newQuantity } : item
              )
            : [...state.items, { ...product, quantity: newQuantity }],
          isOpen: true,
        }));

        // Fire and forget optimistic sync
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: newQuantity })
        }).catch(() => {});
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId)
        }));

        fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' }).catch(() => {});
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: quantity <= 0 
            ? state.items.filter((item) => item.id !== productId)
            : state.items.map((item) => item.id === productId ? { ...item, quantity } : item)
        }));

        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity })
        }).catch(() => {});
      },
      clearCart: () => {
        set({ items: [] });
        fetch('/api/cart', { method: 'DELETE' }).catch(() => {});
      },
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      subtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'glow-up-cart',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
