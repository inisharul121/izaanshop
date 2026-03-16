import React from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get(`/products?category=${categoryParam}&sort=${sortParam}`),
          api.get('/categories')
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching shop data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryParam, sortParam]);

  const handleCategoryChange = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) newParams.set('category', slug);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  return (
    <div className="pb-20">
      <SEO title="Shop" description="Browse our collection of educational books, STEM toys, and school supplies." />
      
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden bg-primary/5 mb-12">
        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-4 text-center md:text-left"
          >
            <span className="text-primary font-bold tracking-wider text-xs uppercase">Welcome to IzaanShop</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-dark leading-tight">
              Empower Their <span className="text-primary">Future</span> Through Learning
            </h1>
            <p className="text-gray-600 text-base max-w-lg mx-auto md:mx-0">
              Discover the best educational books, STEM toys, and school supplies for children of all ages.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/3 hidden md:block"
          >
            <img 
              src="https://placehold.co/600x400/FF6B35/white?text=Shop+Hero" 
              alt="Shop Hero" 
              className="w-full max-w-sm mx-auto drop-shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleCategoryChange('')}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${!categoryParam ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${categoryParam === cat.slug ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Price Range
            </h3>
            <input type="range" className="w-full accent-primary" min="0" max="5000" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0৳</span>
              <span>5000৳</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-dark">
              {categoryParam ? categories.find(c => c.slug === categoryParam)?.name : 'Shop All'}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Sort by:</span>
              <select 
                value={sortParam}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('sort', e.target.value);
                  setSearchParams(newParams);
                }}
                className="bg-transparent font-medium text-dark focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
};

export default Shop;
