import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Heart, Star, ChevronLeft, ShieldCheck, 
  Truck, RefreshCcw, Minus, Plus, Share2, Info, ChevronRight 
} from 'lucide-react';
import api from '../utils/api';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeVariant, setActiveVariant] = useState(null);
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        
        // Group duplicate attributes (e.g. if someone added "Color" twice)
        if (data.attributes && data.attributes.length > 0) {
          data.attributes = data.attributes.reduce((acc, curr) => {
            const existing = acc.find(a => a.name.toLowerCase() === curr.name.toLowerCase());
            if (existing) {
              existing.options = [...new Set([...existing.options, ...curr.options])];
            } else {
              acc.push({ ...curr });
            }
            return acc;
          }, []);
        }

        setProduct(data);
        setActiveImg(0);
        // Initialize selected options if variable
        if (data.type === 'VARIABLE' && data.attributes?.length > 0) {
          const initial = {};
          data.attributes.forEach(attr => {
            initial[attr.name] = attr.options[0];
          });
          setSelectedOptions(initial);
        }
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (product?.type === 'VARIABLE' && product.variants) {
      const match = product.variants.find(v => 
        Object.entries(selectedOptions).every(([key, val]) => v.options[key] === val)
      );
      setActiveVariant(match);
    }
  }, [selectedOptions, product]);

  const getImageUrl = (img) => {
    if (!img) return 'https://placehold.co/800x800/F8F9FA/2D3748?text=Product';
    if (img.startsWith('http')) return img;
    const cleanPath = img.startsWith('/') ? img : `/${img}`;
    return `http://localhost:5001${cleanPath}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Loading amazing product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <Info className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-dark">Product Missing</h2>
        <p className="text-gray-500">We couldn't find the product you're looking for. It might have been moved or deleted.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    </div>
  );

  const gallery = [
    product.images?.main,
    ...(product.images?.gallery || [])
  ].filter(Boolean);

  const displayPrice = (activeVariant && activeVariant.price !== null) ? activeVariant.price : product.price;
  const displaySalePrice = (activeVariant && activeVariant.salePrice !== null) ? activeVariant.salePrice : product.salePrice;
  const displayStock = (activeVariant && activeVariant.stock !== null) ? activeVariant.stock : product.stock;

  const discount = displaySalePrice 
    ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100)
    : null;

  const handleOptionChange = (name, val) => {
    setSelectedOptions(prev => ({ ...prev, [name]: val }));
  };

  const handleAddToCart = () => {
    if (product.type === 'VARIABLE' && !activeVariant) {
      alert('Please select all available options');
      return;
    }
    
    // Create a product instance with variant info for cart
    const itemToAdd = {
      ...product,
      price: displayPrice,
      salePrice: displaySalePrice,
      selectedVariant: activeVariant,
      selectedOptions: selectedOptions
    };
    addToCart(itemToAdd, quantity);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-gray-50/50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-dark truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="sticky top-24 space-y-6">
              <motion.div 
                layoutId={`img-${product.id}`}
                className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group"
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={getImageUrl(gallery[activeImg])} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {discount && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {discount}% OFF
                  </div>
                )}

                <button className="absolute top-4 right-4 p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-all shadow-sm opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4" />
                </button>
              </motion.div>

              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {gallery.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border transition-all ${activeImg === i ? 'border-primary ring-2 ring-primary/10' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <img src={getImageUrl(img)} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info (7 cols) */}
          <div className="lg:col-span-6 flex flex-col pt-4">
            <div className="space-y-6">
              <div>
                <Link to={`/shop?category=${product.category?.slug}`} className="inline-block px-3 py-1 bg-gray-100 text-gray-600 font-bold text-[10px] uppercase tracking-wider rounded-md mb-4 hover:bg-gray-200 transition-all">
                  {product.category?.name}
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-dark leading-tight mb-4">
                  {product.name}
                  {activeVariant?.sku && <span className="block text-xs text-gray-400 font-mono mt-2">{activeVariant.sku}</span>}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">(24 Reviews)</span>
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${displayStock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {displayStock > 0 ? `In Stock (${displayStock})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Variant Selectors */}
              {product.type === 'VARIABLE' && product.attributes?.length > 0 && (() => {
                // CSS color lookup for known color names
                const COLOR_MAP = {
                  red: '#ef4444', blue: '#3b82f6', green: '#22c55e', black: '#111111',
                  white: '#f8fafc', yellow: '#eab308', pink: '#ec4899', purple: '#a855f7',
                  orange: '#f97316', gray: '#6b7280', grey: '#6b7280', brown: '#92400e',
                  navy: '#1e3a5f', teal: '#14b8a6', cyan: '#06b6d4', maroon: '#7f1d1d',
                  beige: '#d6c5a1', cream: '#fffdd0', gold: '#d97706', silver: '#94a3b8',
                };
                const getColorHex = (name) => COLOR_MAP[name.toLowerCase()] || null;

                return (
                  <div className="space-y-5 py-6 border-t border-b border-gray-100">
                    {product.attributes.map(attr => {
                      const isColor = attr.name.toLowerCase() === 'color';
                      const selected = selectedOptions[attr.name];
                      return (
                        <div key={attr.id || attr.name} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{attr.name}</span>
                            {selected && (
                              <span className="text-xs font-bold text-dark">{selected}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {attr.options.map(opt => {
                              const colorHex = isColor ? getColorHex(opt) : null;
                              const isSelected = selected === opt;
                              if (colorHex) {
                                // Color swatch
                                return (
                                  <button
                                    key={opt}
                                    title={opt}
                                    onClick={() => handleOptionChange(attr.name, opt)}
                                    className={`w-9 h-9 rounded-full border-2 transition-all relative flex items-center justify-center ${isSelected ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-transparent hover:border-gray-300 hover:scale-105'}`}
                                    style={{ backgroundColor: colorHex }}
                                  >
                                    {isSelected && (
                                      <span className="w-2.5 h-2.5 rounded-full bg-white/80 block shadow-sm" />
                                    )}
                                  </button>
                                );
                              }
                              // Default pill chip
                              return (
                                <button
                                  key={opt}
                                  onClick={() => handleOptionChange(attr.name, opt)}
                                  className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${isSelected ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-baseline gap-3">
                  {displaySalePrice ? (
                    <>
                      <span className="text-4xl font-bold text-primary tracking-tight">{displaySalePrice}৳</span>
                      <span className="text-lg text-gray-400 line-through font-medium">{displayPrice}৳</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-dark tracking-tight">{displayPrice}৳</span>
                  )}
                </div>
                
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors border-r border-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-dark">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors border-l border-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={handleAddToCart}
                  disabled={displayStock <= 0}
                  className={`flex-[3] py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 active:scale-95 ${displayStock > 0 ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {displayStock > 0 ? 'Add To Basket' : 'Out of Stock'}
                </button>
                <button className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-400">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Truck, title: 'Safe Shipping', desc: 'World wide' },
                  { icon: RefreshCcw, title: '7 Days Return', desc: 'Free guarantee' },
                  { icon: ShieldCheck, title: '24 Month', desc: 'Full warranty' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] text-dark uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>


              {/* Tabs Section */}
              <div className="pt-10">
                <div className="flex border-b border-gray-100 mb-8">
                  {['description', 'specifications', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-dark'}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="min-h-[200px] text-gray-500 leading-relaxed text-sm">
                  {activeTab === 'description' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {product.description}
                    </motion.div>
                  )}
                  {activeTab === 'specifications' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      <div className="flex justify-between border-b border-gray-50 py-2 max-w-md">
                        <span className="font-medium text-gray-400">Category</span>
                        <span className="text-dark font-bold">{product.category?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 py-2 max-w-md">
                        <span className="font-medium text-gray-400">Availability</span>
                        <span className="text-dark font-bold">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'reviews' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-400 text-sm">
                      No reviews yet for this product.
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts?.length > 0 && (
          <section className="mt-24 pt-24 border-t border-gray-100">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-dark tracking-tight">You Might Also Like</h2>
              <Link to="/shop" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
