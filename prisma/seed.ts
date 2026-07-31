import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Starting seed...');

  // Clean the database
  console.log('Cleaning up existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  console.log('Creating categories...');
  const skincareCategory = await prisma.category.create({
    data: {
      name: 'Skincare',
      slug: 'skincare',
      description: 'Nourishing and restorative skincare essentials.',
    },
  });

  const makeupCategory = await prisma.category.create({
    data: {
      name: 'Makeup',
      slug: 'makeup',
      description: 'High-performance makeup for a flawless finish.',
    },
  });

  const fragranceCategory = await prisma.category.create({
    data: {
      name: 'Fragrance',
      slug: 'fragrance',
      description: 'Captivating scents for every occasion.',
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Premium tools and accessories for your beauty routine.',
    },
  });

  // Create Products
  console.log('Creating products...');

  // Skincare
  await prisma.product.createMany({
    data: [
      {
        name: 'Radiance Revival Serum',
        slug: 'radiance-revival-serum',
        description: 'A potent Vitamin C brightening serum that revitalizes dull skin and evens out tone for a luminous complexion.',
        price: 89.00,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'],
        categoryId: skincareCategory.id,
        isFeatured: true,
      },
      {
        name: 'Midnight Repair Cream',
        slug: 'midnight-repair-cream',
        description: 'Advanced night cream infused with retinol to reduce fine lines and deeply hydrate while you sleep.',
        price: 125.00,
        stock: 35,
        images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'],
        categoryId: skincareCategory.id,
        isFeatured: true,
      },
      {
        name: 'Rose Petal Cleanser',
        slug: 'rose-petal-cleanser',
        description: 'A gentle foaming cleanser with rose extract that purifies skin without stripping its natural moisture.',
        price: 45.00,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'],
        categoryId: skincareCategory.id,
        isFeatured: false,
      },
      {
        name: 'Hydra-Glow Moisturizer',
        slug: 'hydra-glow-moisturizer',
        description: 'Lightweight daily moisturizer that provides 24-hour hydration and a dewy, healthy glow.',
        price: 68.00,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1611077544994-681b95388c3a?w=800'],
        categoryId: skincareCategory.id,
        isFeatured: false,
      },
    ],
  });

  // Makeup
  await prisma.product.createMany({
    data: [
      {
        name: 'Velvet Matte Lipstick Collection',
        slug: 'velvet-matte-lipstick-collection',
        description: 'A stunning 12-shade lipstick set featuring a comfortable, long-lasting matte finish in highly pigmented colors.',
        price: 38.00,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'],
        categoryId: makeupCategory.id,
        isFeatured: true,
      },
      {
        name: 'Luminous Silk Foundation',
        slug: 'luminous-silk-foundation',
        description: 'Award-winning, buildable coverage foundation that blurs imperfections for a natural, second-skin finish.',
        price: 52.00,
        stock: 75,
        images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800'],
        categoryId: makeupCategory.id,
        isFeatured: true,
      },
      {
        name: 'Celestial Highlighter Palette',
        slug: 'celestial-highlighter-palette',
        description: 'A 6-shade shimmer palette designed to catch the light and enhance your facial features with a radiant glow.',
        price: 42.00,
        stock: 45,
        images: ['https://images.unsplash.com/photo-1512496015851-a1c8ce8b11dc?w=800'],
        categoryId: makeupCategory.id,
        isFeatured: false,
      },
      {
        name: 'Precision Brow Architect',
        slug: 'precision-brow-architect',
        description: 'Micro-tip brow pencil for hair-like strokes that naturally fill and shape your eyebrows.',
        price: 28.00,
        stock: 120,
        images: ['https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=800'],
        categoryId: makeupCategory.id,
        isFeatured: false,
      },
    ],
  });

  // Fragrance
  await prisma.product.createMany({
    data: [
      {
        name: 'Éclat d\'Or Eau de Parfum',
        slug: 'eclat-dor-eau-de-parfum',
        description: 'An enchanting luxury fragrance opening with vibrant citrus, blooming into jasmine, and settling on a warm base of amber and vanilla.',
        price: 195.00,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'],
        categoryId: fragranceCategory.id,
        isFeatured: true,
      },
      {
        name: 'Blush Rosé Body Mist',
        slug: 'blush-rose-body-mist',
        description: 'A light, refreshing floral body spray perfect for a quick touch-up of delicate scent throughout the day.',
        price: 35.00,
        stock: 90,
        images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800'],
        categoryId: fragranceCategory.id,
        isFeatured: false,
      },
    ],
  });

  // Accessories
  await prisma.product.createMany({
    data: [
      {
        name: 'Crystal-Infused Jade Roller',
        slug: 'crystal-infused-jade-roller',
        description: 'A cooling face massage tool crafted from authentic jade to help reduce puffiness and promote lymphatic drainage.',
        price: 55.00,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1606335543042-57c525922933?w=800'],
        categoryId: accessoriesCategory.id,
        isFeatured: true,
      },
      {
        name: 'Professional Brush Set',
        slug: 'professional-brush-set',
        description: 'A comprehensive 12-piece brush collection with ultra-soft synthetic bristles for flawless makeup application.',
        price: 78.00,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1596462502278-27bf84033001?w=800'],
        categoryId: accessoriesCategory.id,
        isFeatured: false,
      },
    ],
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
To use this seed script, add the following to your package.json:

"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}

(Make sure you have ts-node installed: npm install -D ts-node typescript @types/node)
*/
