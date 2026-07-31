'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';

function CustomerLoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoadingGoogle(true);
    signIn('google', { callbackUrl });
  };

  const handleAppleSignIn = () => {
    setIsLoadingApple(true);
    signIn('apple', { callbackUrl });
  };

  return (
    <div className="w-full max-w-md bg-soft-white rounded-2xl shadow-xl shadow-charcoal/5 p-8 sm:p-12 border border-blush/30">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl text-charcoal mb-3 tracking-wide">
          Welcome to Glow Up
        </h1>
        <p className="text-charcoal/60 text-sm font-light">
          Sign in or create an account to manage your orders and experience luxury.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoadingGoogle || isLoadingApple}
          className="w-full bg-white border border-neutral-200 hover:bg-neutral-50 text-charcoal py-3.5 px-4 rounded-lg font-medium transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center shadow-sm"
        >
          {isLoadingGoogle ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5 text-neutral-500" />
          ) : (
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <button
          onClick={handleAppleSignIn}
          disabled={isLoadingGoogle || isLoadingApple}
          className="w-full bg-black hover:bg-neutral-900 text-white py-3.5 px-4 rounded-lg font-medium transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center shadow-sm"
        >
          {isLoadingApple ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5 text-white/70" />
          ) : (
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.365 21.43c-1.35 0-2.02-.91-3.69-.91-1.64 0-2.31.88-3.66.88-3.32 0-7.39-4.83-7.39-10.4 0-4.66 2.91-7.05 6.09-7.05 1.83 0 3.09 1.1 4.54 1.1 1.48 0 3.02-1.34 5.25-1.34 2.04 0 4.14 1.18 5.16 3.14-4.32 2.51-3.63 8.7 1 10.6-1.12 3-3.13 4.98-7.3 4.98z" />
              <path d="M15.425 2.57c-.88.94-2.19 1.54-3.55 1.44.15-1.5.94-2.82 2.15-3.66.87-.84 2.13-1.42 3.46-1.35-.1 1.52-.96 2.65-2.06 3.57z" />
            </svg>
          )}
          Continue with Apple
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-charcoal/40 leading-relaxed">
          By signing in, you agree to Glow Up&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4 py-12">
      <Suspense fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-gold" />
        </div>
      }>
        <CustomerLoginForm />
      </Suspense>
    </div>
  );
}
