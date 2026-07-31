import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold disabled:pointer-events-none disabled:opacity-50 font-body',
          {
            'bg-rose-gold text-soft-white hover:bg-rose-gold/90': variant === 'primary',
            'bg-champagne text-charcoal hover:bg-champagne/80': variant === 'secondary',
            'border border-charcoal/20 bg-transparent hover:bg-charcoal/5': variant === 'outline',
            'hover:bg-charcoal/5 text-charcoal': variant === 'ghost',
            'h-9 px-4 py-2': size === 'sm',
            'h-11 px-8 py-3 text-base': size === 'md',
            'h-14 px-10 py-4 text-lg': size === 'lg',
            'h-11 w-11': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
