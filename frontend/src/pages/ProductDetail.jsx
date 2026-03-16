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
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
        setActiveImg(0);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

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

  const discount = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

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
                className="aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative group"
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImg}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    src={getImageUrl(gallery[activeImg])} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {discount && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-2xl shadow-xl shadow-red-500/30">
                    {discount}% OFF
                  </div>
                )}

                <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                  <Heart className="w-5 h-5" />
                </button>
              </motion.div>

              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {gallery.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImg(i)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-gray-50 hover:border-gray-200'}`}
                  >
                    <img src={getImageUrl(img)} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    {activeImg === i && <div className="absolute inset-0 bg-primary/10" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info (7 cols) */}
          <div className="lg:col-span-6 flex flex-col pt-4">
            <div className="space-y-6">
              <div>
                <Link to={`/shop?category=${product.category?.slug}`} className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest rounded-full mb-4 hover:bg-primary/20 transition-all">
                  {product.category?.name}
                </Link>
                <h1 className="text-3xl md:text-5xl font-black text-dark leading-tight mb-4 tracking-tight">
                  {product.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center bg-yellow-400/10 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-yellow-700 ml-1">4.8</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">(24 Reviews)</span>
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    <span className={`text-sm font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-baseline gap-4">
                  {product.salePrice ? (
                    <>
                      <span className="text-5xl font-black text-primary tracking-tighter">{product.salePrice}৳</span>
                      <span className="text-xl text-gray-400 line-through font-bold">{product.price}৳</span>
                    </>
                  ) : (
                    <span className="text-5xl font-black text-dark tracking-tighter">{product.price}৳</span>
                  )}
                </div>
                
                <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-400 rounded-xl transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-black text-xl">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-400 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-[2] py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add To Basket
                </button>
                <button className="flex-1 py-5 border-2 border-gray-100 rounded-[1.5rem] hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center text-gray-400 hover:text-red-500">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-5 border-2 border-gray-100 rounded-[1.5rem] hover:bg-gray-50 hover:border-gray-200 transition-all text-gray-400">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                {[
                  { icon: Truck, title: 'Safe Shipping', desc: 'World wide' },
                  { icon: RefreshCcw, title: '7 Days Return', desc: 'Free guarantee' },
                  { icon: ShieldCheck, title: '24 Month', desc: 'Full warranty' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-dark">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
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
                      className={`px-8 py-4 text-sm font-black capitalize transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-dark'}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="min-h-[200px] text-gray-600 leading-loose">
                  {activeTab === 'description' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      {product.description}
                    </motion.div>
                  )}
                  {activeTab === 'specifications' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="grid grid-cols-2 max-w-sm">
                        <span className="font-bold text-dark">Category</span>
                        <span>{product.category?.name}</span>
                      </div>
                      <div className="grid grid-cols-2 max-w-sm">
                        <span className="font-bold text-dark">Stock</span>
                        <span>{product.stock} units</span>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'reviews' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10 text-gray-400 italic">
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
          <section className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-dark">You Might Also Like</h2>
              <Link to="/shop" className="text-primary font-bold hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
