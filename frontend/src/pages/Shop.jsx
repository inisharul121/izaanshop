import React from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
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
    <div className="container mx-auto px-4 py-12">
      <SEO title="Shop" description="Browse our collection of educational books, STEM toys, and school supplies." />
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
                  key={cat._id}
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
                <ProductCard key={product._id} product={product} />
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
  );
};

export default Shop;
