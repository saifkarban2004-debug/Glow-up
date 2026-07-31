'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * AuthProvider
 * 
 * Wraps the application with NextAuth's SessionProvider
 * to provide authentication context to client components.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
