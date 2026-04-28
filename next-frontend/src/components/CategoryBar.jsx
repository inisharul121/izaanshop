'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Baby, 
  Shirt, 
  Footprints, 
  Gamepad2, 
  HeartPulse, 
  Utensils, 
  Palette, 
  Home, 
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import api from '../utils/api';

const iconMap = {
  'AGE': <Baby className="w-4 h-4" />,
  'CLOTHING': <Shirt className="w-4 h-4" />,
  'FOOTWEAR': <Footprints className="w-4 h-4" />,
  'TOYS': <Gamepad2 className="w-4 h-4" />,
  'BABY CARE': <ShoppingBag className="w-4 h-4" />,
  'MOMS CARE': <HeartPulse className="w-4 h-4" />,
  'BABY FOOD': <Utensils className="w-4 h-4" />,
  'ART & CRAFT': <Palette className="w-4 h-4" />,
  'LIFESTYLE': <Home className="w-4 h-4" />,
  'DEFAULT': <Sparkles className="w-4 h-4" />
};

const getCategoryIcon = (name) => {
  const upperName = name.toUpperCase();
  if (upperName.includes('AGE')) return iconMap['AGE'];
  if (upperName.includes('CLOTH')) return iconMap['CLOTHING'];
  if (upperName.includes('FOOT')) return iconMap['FOOTWEAR'];
  if (upperName.includes('SHOE')) return iconMap['FOOTWEAR'];
  if (upperName.includes('TOY')) return iconMap['TOYS'];
  if (upperName.includes('CARE') && upperName.includes('BABY')) return iconMap['BABY CARE'];
  if (upperName.includes('MOM')) return iconMap['MOMS CARE'];
  if (upperName.includes('FOOD')) return iconMap['BABY FOOD'];
  if (upperName.includes('ART')) return iconMap['ART & CRAFT'];
  if (upperName.includes('CRAFT')) return iconMap['ART & CRAFT'];
  if (upperName.includes('LIFE')) return iconMap['LIFESTYLE'];
  return iconMap['DEFAULT'];
};

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const CACHE_KEY = 'izaan-categories';
      const CACHE_TIME_KEY = 'izaan-categories-timestamp';
      const FIVE_MINUTES = 5 * 60 * 1000;

      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        const timestamp = sessionStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cached && timestamp && (now - parseInt(timestamp) < FIVE_MINUTES)) {
          setCategories(JSON.parse(cached));
          setLoading(false);
          return;
        }
      } catch (e) { /* sessionStorage not available */ }

      try {
        const { data } = await api.get('/categories');
        setCategories(data);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
          sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        } catch (e) { /* sessionStorage not available */ }
      } catch (err) {
        console.error('Failed to fetch categories into navbar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <div className="bg-gray-50/50 border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 md:justify-center">
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              href={`/?category=${cat.slug}#shop-now`}
              className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-gray-500 uppercase tracking-widest hover:text-primary transition-all shrink-0 group"
            >
              <div className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-primary/20 group-hover:scale-110 transition-all">
                {React.cloneElement(getCategoryIcon(cat.name), { className: "w-4 h-4 text-primary" })}
              </div>
              <span className="flex items-center gap-0.5">{cat.name} <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" /></span>
            </Link>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryBar;
