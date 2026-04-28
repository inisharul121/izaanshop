'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { preloadImages } from '@/utils/helpers';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';

// PriceSlider defined outside ShopClient so React.memo works correctly
const PriceSlider = React.memo(({ initialValue, max, onChange }) => {
  const [localValue, setLocalValue] = React.useState(initialValue || max);
  
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    setLocalValue(initialValue || max);
  }, [initialValue, max]);

  React.useEffect(() => {
    // Skip the very first effect run to prevent mount-time filtering
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (String(localValue) !== String(initialValue)) {
        onChange(localValue);
      }
    }, 400);
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
PriceSlider.displayName = 'PriceSlider';

const ShopClient = ({ initialData }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Track if we've already fetched images to avoid duplicate calls
  const hasAttemptedImageFetch = React.useRef(false);
  
  const [products, setProducts] = React.useState(initialData.products || []);
  const [categories, setCategories] = React.useState(initialData.categories || []);
  const [banners, setBanners] = React.useState(initialData.banners || []);
  const [dynamicMaxPrice, setDynamicMaxPrice] = React.useState(initialData.storeMaxPrice || 5000);
  
  const [isFiltering, setIsFiltering] = React.useState(false);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const keywordParam = searchParams.get('keyword') || '';

  // 1. SYNC PROPS TO STATE
  // Since we are using SSR, when the URL changes, Next.js sends NEW initialData props.
  // We must update our local state when these props arrive.
  React.useEffect(() => {
    setProducts(initialData.products || []);
    setCategories(initialData.categories || []);
    setBanners(initialData.banners || []);
    setDynamicMaxPrice(initialData.storeMaxPrice || 5000);
    setIsFiltering(false); // Stop loading when data arrives
  }, [initialData]);

  // 🚀 PRELOAD ABOVE-THE-FOLD IMAGES (first 6 products + first 3 banners)
  // This starts image downloads immediately without blocking page render
  React.useEffect(() => {
    const imagesToPreload = [];
    
    // Preload first 6 product images (visible above fold)
    products.slice(0, 6).forEach(product => {
      const mainImage = product.images?.main || product.images?.[0];
      if (mainImage) imagesToPreload.push(mainImage);
    });
    
    // Preload first 3 banner images
    banners.slice(0, 3).forEach(banner => {
      if (banner.image) imagesToPreload.push(banner.image);
    });
    
    // Preload all images in parallel
    if (imagesToPreload.length > 0) {
      preloadImages(imagesToPreload);
      console.log(`🖼️ Preloading ${imagesToPreload.length} images for faster display`);
    }
  }, [products, banners]);

  // 1.5. FETCH FULL PRODUCT DATA WITH IMAGES (Client-side)
  // SSR products come without images to keep cache small (<2MB)
  // This effect refetches fresh product data with images on client mount and after filters
  React.useEffect(() => {
    if (!products || products.length === 0) {
      console.log('📦 No products to fetch images for');
      return;
    }
    
    // Check if products already have real images
    if (products[0]?.images?.main && products[0].images.main !== '/placeholder.png') {
      console.log('✅ Products already have real images, skipping refetch');
      console.log('First product images:', products[0].images);
      hasAttemptedImageFetch.current = true;
      return;
    }
    
    // For new products without images, reset the fetch flag to allow refetch
    hasAttemptedImageFetch.current = false;
    
    console.log('🔄 Starting product image fetch...');
    console.log(`📊 Current products count: ${products.length}`);
    console.log('First product:', products[0]);
    
    const fetchProductsWithImages = async () => {
      try {
        // Refetch through the API with current filter params
        const params = new URLSearchParams({
          category: categoryParam || '',
          sort: sortParam || 'newest',
          minPrice: minPriceParam || '',
          maxPrice: maxPriceParam || '',
          keyword: keywordParam || ''
        });
        
        const url = `/products?${params.toString()}`;
        console.log(`🌐 Fetching from: ${url}`);
        
        const response = await api.get(url);
        console.log('📥 API Response:', response.data);
        
        if (response.data?.products) {
          console.log(`✅ Fetched ${response.data.products.length} products with images`);
          console.log('First product from API:', response.data.products[0]);
          setProducts(response.data.products);
          setDynamicMaxPrice(response.data.maxPrice || 5000);
          hasAttemptedImageFetch.current = true;
        } else {
          console.warn('⚠️ Response missing products array');
        }
      } catch (error) {
        console.error('❌ Failed to fetch product images:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        });
        hasAttemptedImageFetch.current = true;
      }
    };

    // Wait 500ms for DOM to settle, then fetch fresh data
    const timer = setTimeout(fetchProductsWithImages, 500);
    return () => clearTimeout(timer);
  }, [products, categoryParam, sortParam, minPriceParam, maxPriceParam, keywordParam]); // Run when products change or filters change


  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // 2. SHOW FILTERING STATE
    // Check if params actually changed to avoid unnecessary re-renders/stuck state
    if (params.toString() === searchParams.toString()) {
      return;
    }

    setIsFiltering(true);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (slug) => {
    updateSearchParams({ category: slug || null });
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowMobileFilters(false);
    }
  };

  const removeFilter = (key) => {
    updateSearchParams({ [key]: null });
  };

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
            updateSearchParams({ maxPrice: val == dynamicMaxPrice ? null : val });
          }} 
        />
      </div>
    </div>
  );

  return (
    <div className="pb-20 bg-[#F9FAFB] min-h-screen">
      {/* Hero Slider */}
      {banners.length > 0 && <HeroSlider banners={banners} />}

      {/* Breadcrumb & Title Section */}
      <section className="bg-white border-b border-gray-100 mb-12 py-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="text-primary/40 leading-none">Shop</span>
            {categoryParam && (
              <>
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="text-primary truncate">{categoryParam}</span>
              </>
            )}
          </nav>
          <h1 className="text-3xl md:text-5xl font-black text-dark tracking-tight">
            Explore the <span className="text-primary">Collection</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-lg leading-relaxed mt-2 text-sm">
            Empower your child's journey with our hand-picked selection of educational excellence.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 scroll-mt-40" id="shop-now">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-dark text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          
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
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 h-4">
                    {products?.length || 0} Products Found
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
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sort:</span>
                  <select 
                    value={sortParam}
                    onChange={(e) => {
                      updateSearchParams({ sort: e.target.value });
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
              {(categoryParam || (maxPriceParam && maxPriceParam != dynamicMaxPrice) || keywordParam) && (
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
                    onClick={() => router.push(pathname)}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors ml-2"
                  >
                   × Clear All
                  </button>
                </div>
              )}
            </div>

            <div className={`transition-opacity duration-300 ${isFiltering ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              {!products || products.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-6">
                  <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">No items found</h3>
                  <p className="text-gray-400 max-w-xs mx-auto text-sm">We couldn't find any products matching your current filters. Try adjust them or clear all.</p>
                  <button 
                    onClick={() => {
                      router.push(pathname);
                    }}
                    className="mt-8 bg-dark text-white px-8 py-3 rounded-2xl font-bold text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product, index) => (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} priority={index < 6} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopClient;
