'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';

export default function OrderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('query', query);
      } else {
        params.delete('query');
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className={`h-4 w-4 ${isPending ? 'text-rose-gold animate-pulse' : 'text-neutral-400'}`} />
      </div>
      <input
        type="text"
        className="block w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold transition-colors"
        placeholder="Search by Order ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
