import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronLeft, ShieldCheck, Truck, RefreshCcw, Minus, Plus } from 'lucide-react';
import api from '../utils/api';
import { useStore } from '../store/useStore';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useStore();

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        // For simplicity, handle backend finding by ID vs Slug if needed
        // Assuming backend getProductById is modified or slug matches ID in mock
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading product...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found. <Link to="/shop" className="text-primary underline">Go to Shop</Link></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8">
        <ChevronLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <img 
              src={product.images[0] || 'https://placehold.co/800x800/F8F9FA/2D3748?text=Product'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:border-primary transition-all">
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-primary font-bold text-sm uppercase tracking-wide mb-2">{product.category?.name}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-gray-400 ml-1">4.8 (24 Reviews)</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold text-primary">{product.salePrice}৳</span>
                <span className="text-xl text-gray-400 line-through font-medium">{product.price}৳</span>
                <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded">-{Math.round(((product.price - product.salePrice) / product.price) * 100)}%</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-dark">{product.price}৳</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center border border-gray-200 rounded-md">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50 text-gray-500"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-50 text-gray-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => addToCart(product, quantity)}
              className="flex-1 btn-primary flex items-center justify-center gap-3 text-lg"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="p-3 border border-gray-200 rounded-md hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all text-gray-400">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <div className="text-xs">
                <p className="font-bold">Fast Delivery</p>
                <p className="text-gray-500">2-4 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCcw className="w-6 h-6 text-primary" />
              <div className="text-xs">
                <p className="font-bold">7 Days Return</p>
                <p className="text-gray-500">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div className="text-xs">
                <p className="font-bold">Secure Payment</p>
                <p className="text-gray-500">100% protection</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
