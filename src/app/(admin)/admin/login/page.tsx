'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel - Hidden on mobile, Decorative */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-plum to-charcoal relative overflow-hidden flex-col justify-center items-center text-soft-white p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full border-2 border-gold opacity-30" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full border border-champagne opacity-20" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-rose-gold blur-3xl opacity-10" />
        </div>

        <div className="z-10 text-center max-w-md">
          <h1 className="font-heading text-5xl md:text-6xl text-soft-white mb-4 tracking-wide">
            Glow Up
          </h1>
          <div className="h-0.5 w-24 bg-gold mx-auto mb-6 rounded-full" />
          <p className="text-xl text-champagne font-light tracking-wider uppercase letter-spacing-2">
            Admin Dashboard
          </p>
          <p className="mt-8 text-sm text-soft-white/60 font-light leading-relaxed">
            Manage your luxury cosmetics boutique, track orders, and curate your premium collection.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-cream p-8 sm:p-12">
        <div className="w-full max-w-md bg-soft-white rounded-2xl shadow-xl shadow-charcoal/5 p-8 border border-blush/30">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl text-charcoal mb-2">Welcome Back</h2>
            <p className="text-charcoal/60 text-sm">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/40 group-focus-within:text-rose-gold transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blush bg-transparent outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-all duration-300 text-charcoal placeholder:text-charcoal/30"
                  placeholder="admin@glowup.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/40 group-focus-within:text-rose-gold transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-blush bg-transparent outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-all duration-300 text-charcoal placeholder:text-charcoal/30"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal/40 hover:text-charcoal transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-gold hover:bg-rose-gold/90 text-soft-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center shadow-md shadow-rose-gold/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream"><Loader2 className="h-8 w-8 animate-spin text-rose-gold" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
