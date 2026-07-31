'use client';

import { AuthProvider } from './auth-provider';
import { CartProvider } from './cart-provider';

/**
 * Providers
 * 
 * Combines all client-side providers into a single component
 * to keep the root layout clean. Wraps the app with:
 * - AuthProvider (NextAuth session)
 * - CartProvider (Zustand cart hydration)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
