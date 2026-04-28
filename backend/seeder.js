const { db } = require('./db');
const { 
  users, 
  categories, 
  products, 
  banners, 
  orderItems, 
  orders, 
  productVariants, 
  productAttributes 
} = require('./db/schema');
const bcrypt = require('bcryptjs');

const seedCategories = [
  { name: 'Books', slug: 'books', description: 'Educational and story books' },
  { name: 'Educational Toys', slug: 'educational-toys', description: 'Learning toys for kids' },
  { name: 'Stationery', slug: 'stationery', description: 'School and office supplies' },
];

const seedProducts = [
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

const seedBanners = [
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
    // Delete in reverse order of dependencies
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(productVariants);
    await db.delete(productAttributes);
    await db.delete(products);
    await db.delete(categories);
    await db.delete(users);
    await db.delete(banners);

    console.log('👤 Creating Admin User...');
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isApproved: true
    });

    console.log('📁 Seeding Categories...');
    const createdCategories = [];
    for (const cat of seedCategories) {
      const [result] = await db.insert(categories).values(cat);
      createdCategories.push({ id: result.insertId, ...cat });
    }

    console.log('🛍️ Seeding Products...');
    for (let i = 0; i < seedProducts.length; i++) {
        const cat = createdCategories[i % createdCategories.length];
        await db.insert(products).values({
          ...seedProducts[i],
          categoryId: cat.id,
        });
    }

    console.log('🖼️ Seeding Banners...');
    for (const banner of seedBanners) {
      await db.insert(banners).values(banner);
    }

    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    process.exit();
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
};

seedData();
