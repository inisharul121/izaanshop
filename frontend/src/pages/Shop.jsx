import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isFiltering, setIsFiltering] = React.useState(false);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const keywordParam = searchParams.get('keyword') || '';

  const [dynamicMaxPrice, setDynamicMaxPrice] = React.useState(5000);

  // No longer need top-level debounce effect for priceRange

  React.useEffect(() => {
    const fetchData = async () => {
      if (initialLoading) setLoading(true);
      else setIsFiltering(true);
      
      try {
        const query = new URLSearchParams({
          category: categoryParam,
          sort: sortParam,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          keyword: keywordParam
        }).toString();
        
        const [prodRes, catRes] = await Promise.all([
          api.get(`/products?${query}`),
          api.get('/categories')
        ]);
        
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
        
        if (prodRes.data.storeMaxPrice) {
          setDynamicMaxPrice(Number(prodRes.data.storeMaxPrice));
        }
      } catch (error) {
        console.error('Error fetching shop data', error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setIsFiltering(false);
      }
    };
    fetchData();
  }, [categoryParam, sortParam, minPriceParam, maxPriceParam, keywordParam]);

  const handleCategoryChange = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) newParams.set('category', slug);
    else newParams.delete('category');
    setSearchParams(newParams);
    if (window.innerWidth < 768) setShowMobileFilters(false);
  };

  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const PriceSlider = React.memo(({ initialValue, max, onChange }) => {
    const [localValue, setLocalValue] = React.useState(initialValue || max);
    
    // Update local value if external initialValue changes (e.g. on reset)
    React.useEffect(() => {
      setLocalValue(initialValue || max);
    }, [initialValue, max]);

    // Debounce notify parent
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (localValue != initialValue) {
          onChange(localValue);
        }
      }, 300);
      return () => clearTimeout(timer);
    }, [localValue, initialValue, onChange]);

    return (
      <div className="px-2">
        <input 
          type="range" 
          className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" 
          min="0" 
          max={max} 
          step="1"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
        <div className="flex justify-between items-center mt-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Under</span>
            <span className="text-xl font-black text-dark">{localValue}৳</span>
          </div>
          <button 
            onClick={() => {
              setLocalValue(max);
              onChange('');
            }}
            className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
          >
            Reset
          </button>
        </div>
      </div>
    );
  });

  const FiltersContent = () => (
    <div className="space-y-10 group">
      <div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Categories
        </h3>
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => handleCategoryChange('')}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${!categoryParam ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-primary/5 hover:text-primary'}`}
          >
            All Products
            {!categoryParam && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${categoryParam === cat.slug ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-primary/5 hover:text-primary'}`}
            >
              {cat.name}
              {categoryParam === cat.slug && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Price Budget
        </h3>
        <PriceSlider 
          initialValue={maxPriceParam} 
          max={dynamicMaxPrice} 
          onChange={(val) => {
            const newParams = new URLSearchParams(searchParams);
            if (!val || val == dynamicMaxPrice) newParams.delete('maxPrice');
            else newParams.set('maxPrice', val);
            setSearchParams(newParams);
          }} 
        />
      </div>
    </div>
  );

  return (
    <div className="pb-20 bg-[#F9FAFB] min-h-screen">
      <SEO title="Shop" description="Browse our collection of educational books, STEM toys, and school supplies." />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 mb-12 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <nav className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 overflow-x-auto no-scrollbar">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="text-primary/40 leading-none">Shop</span>
                {categoryParam && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-primary truncate">{categoryParam}</span>
                  </>
                )}
              </nav>
              <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight">
                Explore the <span className="text-primary">Collection</span>
              </h1>
              <p className="text-gray-400 font-medium max-w-lg leading-relaxed">
                Empower your child's journey with our hand-picked selection of educational excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-dark text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          
          {/* Quick Category Chips for Mobile */}
          <div className="flex gap-2">
            {categories.slice(0, 3).map(cat => (
              <button 
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-sm transition-all ${categoryParam === cat.slug ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <FiltersContent />
            </div>
          </aside>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[100] md:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 h-full w-[85%] bg-white z-[101] shadow-2xl p-8 overflow-y-auto md:hidden"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-dark">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-50 rounded-full">
                      <X className="w-5 h-5" /> 
                    </button>
                  </div>
                  <FiltersContent />
                  
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-dark text-white py-4 rounded-2xl font-bold mt-12 shadow-xl"
                  >
                    View Results
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid Header */}
          <main className="flex-1">
            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-dark">
                    {categoryParam ? categories.find(c => c.slug === categoryParam)?.name : 'All Products'}
                  </h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 h-4">
                    {products.length} Products Found
                    <AnimatePresence>
                      {isFiltering && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-1.5 text-primary"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                          Filtering...
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </p>
                </div>
                
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sort:</span>
                  <select 
                    value={sortParam}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('sort', e.target.value);
                      setSearchParams(newParams);
                    }}
                    className="bg-transparent text-sm font-bold text-dark focus:outline-none cursor-pointer appearance-none pr-4"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Lowest $</option>
                    <option value="price-high">Highest $</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {(categoryParam || maxPriceParam !== '5000' || keywordParam) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  {keywordParam && (
                    <span className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold border border-primary/20">
                      {keywordParam}
                      <button onClick={() => removeFilter('keyword')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {categoryParam && (
                    <span className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold border border-primary/20">
                      {categories.find(c => c.slug === categoryParam)?.name}
                      <button onClick={() => removeFilter('category')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {maxPriceParam && Number(maxPriceParam) < dynamicMaxPrice && (
                    <span className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold border border-primary/20">
                      Under {maxPriceParam}৳
                      <button onClick={() => removeFilter('maxPrice')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  <button 
                    onClick={() => setSearchParams({})}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors ml-2"
                  >
                   × Clear All
                  </button>
                </div>
              )}
            </div>

            <div className={`transition-opacity duration-300 ${isFiltering ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-50 flex flex-col gap-4">
                      <div className="w-full flex-1 bg-gray-50 rounded-[2rem] animate-pulse" />
                      <div className="h-6 w-3/4 bg-gray-50 rounded-lg animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-50 rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-6">
                  <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">No items found</h3>
                  <p className="text-gray-400 max-w-xs mx-auto text-sm">We couldn't find any products matching your current filters. Try adjust them or clear all.</p>
                  <button 
                    onClick={() => {
                      setSearchParams({});
                    }}
                    className="mt-8 bg-dark text-white px-8 py-3 rounded-2xl font-bold text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
