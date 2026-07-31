import Hero from '@/components/home/Hero';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { prisma } from '@/lib/prisma';

// Revalidate this page every hour
export const revalidate = 3600;

export default async function Home() {
  // Helper to serialize Prisma Decimal for Client Components
  const serializeProduct = (product: any) => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined
  });

  // Fetch featured products from the database
  const featuredProducts = (await prisma.product.findMany({
    where: { 
      isFeatured: true, 
      isArchived: false 
    },
    take: 4,
    include: { 
      category: true 
    }
  })).map(serializeProduct);

  const skincareProducts = (await prisma.product.findMany({
    where: {
      category: { slug: 'skincare' },
      isArchived: false
    },
    take: 4,
    include: {
      category: true
    }
  })).map(serializeProduct);

  return (
    <>
      <Hero />
      <ProductCarousel 
        title="Featured Collection" 
        subtitle="Discover our most coveted luxury items, curated for your perfect glow."
        products={featuredProducts} 
      />
      <div className="border-t border-champagne/30" />
      <ProductCarousel 
        title="Skincare Essentials" 
        subtitle="Build your perfect routine with our premium skincare formulations."
        products={skincareProducts} 
      />
    </>
  );
}
