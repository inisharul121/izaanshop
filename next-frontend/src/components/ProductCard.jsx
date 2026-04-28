'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/helpers';
import { ShoppingCart, Star, CreditCard } from 'lucide-react';
import Link from 'next/link';
import SafeImage from './SafeImage';
import { useStore } from '../store/useStore';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product, priority = false }) => {
  const { addToCart } = useStore();
  const router = useRouter();

  const discount = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card flex flex-col h-full group"
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-md mb-4">
        <SafeImage 
          src={getImageUrl(product.images?.main || product.images?.[0])} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {discount}% OFF
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-2.5 h-2.5 md:w-3 md:h-3 ${i < Math.floor(product.ratings?.average || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-[9px] md:text-[10px] text-gray-400 ml-1">({product.ratings?.count || 0})</span>
        </div>
        
        <Link href={`/product/${product.slug}`} className="text-[11px] md:text-sm font-semibold text-dark hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight h-7 md:h-10">
          {product.name}
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-1.5 mb-2 md:mb-3">
            {product.salePrice ? (
              <>
                <span className="text-primary font-bold text-sm md:text-base">{product.salePrice}৳</span>
                <span className="text-gray-400 text-[10px] md:text-xs line-through">{product.price}৳</span>
              </>
            ) : (
              <span className="text-dark font-bold text-sm md:text-base">{product.price}৳</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-primary/10 text-primary border border-primary/20 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ShoppingCart className="w-3 h-3" />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-full bg-dark text-white py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-dark/90 transition-all active:scale-95"
            >
              <CreditCard className="w-3 h-3" />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default ProductCard;
