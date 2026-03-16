const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB for seeding'))
  .catch(err => console.error(err));

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
    images: ['https://placehold.co/600x400/FF6B35/white?text=Math+Adventure'],
  },
  {
    name: 'Story of the World',
    slug: 'story-of-the-world',
    description: 'History for young readers.',
    price: 600,
    salePrice: 520,
    stock: 20,
    images: ['https://placehold.co/600x400/FF6B35/white?text=History+Book'],
  },
  {
    name: 'Smart Building Blocks',
    slug: 'smart-building-blocks',
    description: 'STEM building blocks for creative minds.',
    price: 1200,
    salePrice: 950,
    stock: 15,
    images: ['https://placehold.co/600x400/FF6B35/white?text=Building+Blocks'],
  },
];

const seedData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    
    const sampleProducts = products.map((p, index) => {
      return { ...p, category: createdCategories[index % createdCategories.length]._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('✅ Data Seeded!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
