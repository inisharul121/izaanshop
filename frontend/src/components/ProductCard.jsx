import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  const discount = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  const getImageUrl = (img) => {
    if (!img) return 'https://placehold.co/400x500/F8F9FA/2D3748?text=Product';
    if (img.startsWith('http')) return img;
    return `http://localhost:5001${img}`;
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card flex flex-col h-full group"
    >
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-md mb-4">
        <img 
          src={getImageUrl(product.images?.main || product.images?.[0])} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {discount}% OFF
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3 h-3 ${i < Math.floor(product.ratings?.average || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-[10px] text-gray-400">({product.ratings?.count || 0})</span>
        </div>
        
        <Link to={`/product/${product.slug}`} className="text-sm font-semibold text-dark hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight">
          {product.name}
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            {product.salePrice ? (
              <>
                <span className="text-primary font-bold">{product.salePrice}৳</span>
                <span className="text-gray-400 text-xs line-through">{product.price}৳</span>
              </>
            ) : (
              <span className="text-dark font-bold">{product.price}৳</span>
            )}
          </div>

          <button 
            onClick={() => addToCart(product)}
            className="w-full btn-primary py-1.5 text-xs flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
