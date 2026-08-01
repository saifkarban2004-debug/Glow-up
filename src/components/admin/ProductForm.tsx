'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  compareAtPrice: number | string | null;
  stock: number;
  categoryId: string;
  isFeatured: boolean;
  images: string[];
}

interface ProductFormProps {
  initialData?: Product | null;
  categories: Category[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price ? Number(initialData.price).toString() : '',
    compareAtPrice: initialData?.compareAtPrice ? Number(initialData.compareAtPrice).toString() : '',
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || '',
    isFeatured: initialData?.isFeatured || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let uploadedImageUrls: string[] = [];

      if (imageFiles.length > 0) {
        // 1. Get a signed upload token from our backend
        const sigRes = await fetch('/api/upload');
        const sigData = await sigRes.json();
        if (!sigRes.ok) throw new Error(sigData.error || 'Failed to get upload signature');

        const { signature, timestamp, cloudName, apiKey, folder } = sigData;

        // 2. Upload each image directly to Cloudinary from the browser
        const uploadPromises = imageFiles.map(async (file) => {
          const cloudinaryForm = new FormData();
          cloudinaryForm.append('file', file);
          cloudinaryForm.append('signature', signature);
          cloudinaryForm.append('timestamp', timestamp.toString());
          cloudinaryForm.append('api_key', apiKey);
          cloudinaryForm.append('folder', folder);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: cloudinaryForm }
          );

          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
          return data.secure_url as string;
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const existingImages = initialData?.images || [];
      const allImages = [...existingImages, ...uploadedImageUrls];

      const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        stock: Number(formData.stock),
        images: allImages,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save product');
      }

      toast.success(initialData ? 'Product updated successfully' : 'Product created successfully');
      router.push('/admin/products');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-lg font-medium text-charcoal">Basic Information</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-charcoal">
                Product Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Luminous Hydration Serum"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-charcoal">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the product..."
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-charcoal">Pricing</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-charcoal">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-neutral-500 text-sm">$</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 pl-7 pr-3 py-2 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="compareAtPrice" className="text-sm font-medium text-charcoal">
                Compare at Price (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-neutral-500 text-sm">$</span>
                <input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 pl-7 pr-3 py-2 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-charcoal">Inventory & Organization</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium text-charcoal">
                Stock Quantity
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium text-charcoal">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold bg-white"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-rose-gold focus:ring-rose-gold"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-charcoal">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Images Placeholder */}
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-lg font-medium text-charcoal">Images</h2>
          <div className="rounded-md border-2 border-dashed border-neutral-300 p-8 text-center bg-neutral-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-sm text-neutral-500">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
              />
              {imageFiles.length > 0 ? (
                <p>{imageFiles.length} file(s) selected.</p>
              ) : (
                <p>Select images to upload.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
