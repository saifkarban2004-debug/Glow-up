import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: true,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-neutral-50 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl uppercase">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {category.products.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: Number(product.price),
                  compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
