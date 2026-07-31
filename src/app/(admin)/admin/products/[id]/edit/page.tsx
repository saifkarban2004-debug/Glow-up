import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // Fetch product and categories in parallel for performance
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc'
      }
    })
  ]);

  if (!product) {
    notFound();
  }

  // Format product to match Product interface expected by ProductForm
  const formattedProduct = {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    description: product.description || '',
    images: product.images as string[],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal">Edit Product</h1>
      </div>
      
      <div className="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
        <ProductForm initialData={formattedProduct} categories={categories} />
      </div>
    </div>
  );
}
