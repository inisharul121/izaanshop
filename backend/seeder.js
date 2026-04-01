const prisma = require('./utils/prisma');
const bcrypt = require('bcryptjs');

const categories = [
  { name: 'Books', slug: 'books', description: 'Educational and story books' },
  { name: 'Educational Toys', slug: 'educational-toys', description: 'Learning toys for kids' },
  { name: 'Stationery', slug: 'stationery', description: 'School and office supplies' },
];

const products = [
  {
    name: 'Kids Math Adventure',
    slug: 'kids-math-adventure',
    description: 'A fun way to learn math with puzzles and games.',
    price: 450,
    salePrice: 350,
    stock: 50,
    images: JSON.stringify({ main: 'https://placehold.co/600x400/FF6B35/white?text=Math+Adventure', gallery: [] }),
  },
  {
    name: 'Story of the World',
    slug: 'story-of-the-world',
    description: 'History for young readers.',
    price: 600,
    salePrice: 520,
    stock: 20,
    images: JSON.stringify({ main: 'https://placehold.co/600x400/FF6B35/white?text=History+Book', gallery: [] }),
  },
  {
    name: 'Smart Building Blocks',
    slug: 'smart-building-blocks',
    description: 'STEM building blocks for creative minds.',
    price: 1200,
    salePrice: 950,
    stock: 15,
    images: JSON.stringify({ main: 'https://placehold.co/600x400/FF6B35/white?text=Building+Blocks', gallery: [] }),
  },
];

const banners = [
  {
    title: 'New Arrival',
    subtitle: 'Educational Toys for Kids',
    image: 'https://placehold.co/1920x600/FF6B35/white?text=New+Arrivals',
    link: '/shop',
    isActive: true,
    order: 1
  }
];

const seedData = async () => {
  try {
    console.log('🧹 Cleaning existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productAttribute.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.banner.deleteMany();

    console.log('👤 Creating Admin User...');
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isApproved: true
      }
    });

    console.log('📁 Seeding Categories...');
    const createdCategories = [];
    for (const cat of categories) {
      const c = await prisma.category.create({ data: cat });
      createdCategories.push(c);
    }

    console.log('🛍️ Seeding Products...');
    for (let i = 0; i < products.length; i++) {
      await prisma.product.create({
        data: {
          ...products[i],
          categoryId: createdCategories[i % createdCategories.length].id,
        }
      });
    }

    console.log('🖼️ Seeding Banners...');
    for (const banner of banners) {
      await prisma.banner.create({ data: banner });
    }

    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    process.exit();
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
};

seedData();
