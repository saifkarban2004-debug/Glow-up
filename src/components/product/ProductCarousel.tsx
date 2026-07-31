import { Product, Category } from '@prisma/client';
import { ProductCard } from './ProductCard';

type ProductWithCategory = Product & { category?: Category | null };

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: ProductWithCategory[];
}

export function ProductCarousel({ title, subtitle, products }: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl text-charcoal mb-4">{title}</h2>
          {subtitle && (
            <p className="font-body text-charcoal/60 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="h-0.5 w-16 bg-gold mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as unknown as import('@/types').Product} />
          ))}
        </div>
      </div>
    </section>
  );
}
