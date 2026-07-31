import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/product/AddToCartButton';
import { formatCurrency } from '@/lib/utils';
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: 'Product Not Found | Glow Up',
    };
  }

  return {
    title: `${product.name} | Glow Up`,
    description: product.description || `Buy ${product.name} at Glow Up.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Ensure images array exists
  const images = (product.images as string[]) || [];
  const mainImage = images[0] || '/placeholder.png';

  return (
    <main className="container px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col pt-4 sm:pt-10">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
            {product.name}
          </h1>
          
          <div className="mt-4">
            <p className="text-xl font-medium text-neutral-900">
              {formatCurrency(Number(product.price))}
            </p>
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-8">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-neutral-700 leading-relaxed prose prose-sm prose-neutral">
              {product.description}
            </div>
          </div>

          <div className="mt-10">
            <AddToCartButton product={{ 
              ...product, 
              price: Number(product.price),
              compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined
            }} />
          </div>

          {/* Additional details like ingredients, usage can go here */}
          <div className="mt-12 border-t border-neutral-200 pt-8">
            <div className="text-sm text-neutral-500">
              <p>Free standard shipping on orders over $50.</p>
              <p className="mt-2">Free returns within 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
