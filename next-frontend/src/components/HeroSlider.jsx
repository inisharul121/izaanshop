'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SafeImage from './SafeImage';
import { getImageUrl } from '@/utils/helpers';
import api from '@/utils/api';

const HeroSlider = ({ banners = [] }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [bannersWithImages, setBannersWithImages] = useState(banners);

  // 🚀 Fetch banner images separately to keep SSR cache small
  // banners from SSR come without .image field to prevent 2MB cache bloat
  // We fetch full banners with images on client mount
  useEffect(() => {
    if (banners.length === 0) return;
    
    // If banners already have images, use them directly
    if (banners[0]?.image) {
      setBannersWithImages(banners);
      return;
    }

    // Otherwise, fetch banners with images from API
    const fetchBannerImages = async () => {
      try {
        const response = await api.get('/banners');
        if (response.data && Array.isArray(response.data)) {
          setBannersWithImages(response.data);
        }
      } catch (error) {
        console.warn('Failed to fetch banner images:', error);
        // Fall back to banners from SSR (they'll show placeholder)
        setBannersWithImages(banners);
      }
    };

    fetchBannerImages();
  }, [banners]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % bannersWithImages.length);
  }, [bannersWithImages.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + bannersWithImages.length) % bannersWithImages.length);
  }, [bannersWithImages.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (bannersWithImages.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, bannersWithImages.length]);

  if (!bannersWithImages.length) return null;

  const slide = bannersWithImages[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 })
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-100 py-3 md:py-0">
      <div className="container mx-auto px-4 md:px-0">
        <div className="relative aspect-[2.5/1] sm:aspect-[16/5] w-full rounded-2xl md:rounded-none overflow-hidden shadow-sm md:shadow-none">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <SafeImage
              src={getImageUrl(slide.image)}
              alt={slide.title || 'Promotional banner'}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="100vw"
            />
            {/* Optional text overlay */}
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/20 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-12">
                  <div className="max-w-xl space-y-4">
                    {slide.title && (
                      <h2 className="text-2xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="text-sm md:text-lg text-white/80 font-medium drop-shadow">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.link && (
                      <Link
                        href={slide.link}
                        className="inline-block mt-2 px-6 md:px-8 py-2.5 md:py-3 bg-primary text-white rounded-full font-bold text-xs md:text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                      >
                        Shop Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-dark" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-dark" />
            </button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 md:w-8 h-2 md:h-2.5 bg-primary shadow-lg shadow-primary/30'
                    : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default HeroSlider;
