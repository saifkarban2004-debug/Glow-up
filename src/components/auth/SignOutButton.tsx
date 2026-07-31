'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSignOut = async () => {
    setIsLoading(true);
    clearCart();
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-800 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-70 disabled:pointer-events-none"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Sign Out
    </button>
  );
}
