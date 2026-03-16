require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy product...');

  // Ensure there's at least one category
  const category = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: {
      name: 'Books',
      slug: 'books',
      description: 'Educational books',
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'dummy-product' },
    update: {},
    create: {
      name: 'Dummy Product',
      slug: 'dummy-product',
      description: 'This is a dummy product for testing the MySQL connection.',
      price: 99.99,
      salePrice: 79.99,
      stock: 100,
      categoryId: category.id,
      images: ['https://placehold.co/600x400/FF6B35/white?text=Dummy+Product'],
    },
  });

  console.log({ category, product });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
