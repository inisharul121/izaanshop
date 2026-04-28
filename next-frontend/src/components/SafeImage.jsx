'use client';

import Image from 'next/image';
import React from 'react';

/**
 * SafeImage Component - OPTIMIZED FOR FAST LOADING
 * 
 * ✨ Features:
 * - Auto-detects Data URIs and remote images
 * - Lazy loading for below-fold images
 * - Priority loading for above-fold images
 * - Blur placeholder for faster perceived load
 * - Minimal quality loss (85 instead of 75) for better visuals
 * - Bypasses Next.js 16 private IP block for localhost images in dev
 * - Skips blur placeholder for tiny images (< 40px)
 */
const SafeImage = ({ src, alt, priority = false, loading = 'lazy', quality = 85, style, ...props }) => {
  // Next.js 16 blocks image optimization for private IPs (localhost/127.0.0.1).
  // In development, mark localhost images as unoptimized so they still render.
  const srcStr = typeof src === 'string' ? src : '';
  const isPrivateIP = srcStr.includes('localhost') || srcStr.includes('127.0.0.1') || srcStr.includes('::1');
  const skipOptimizer = process.env.NODE_ENV !== 'production' && isPrivateIP;

  // Skip blur placeholder for tiny images (Next.js warns if < 40x40)
  const isTooSmall = (props.width && props.width < 40) || (props.height && props.height < 40);
  const useBlur = !priority && !skipOptimizer && !isTooSmall;

  const imageProps = {
    src,
    alt: alt || '',
    quality: skipOptimizer ? undefined : quality,
    priority,
    unoptimized: skipOptimizer,
    loading: priority ? undefined : loading,
    placeholder: useBlur ? 'blur' : 'empty',
    ...(useBlur ? { blurDataURL: '/placeholder-blur.png' } : {}),
    style: { ...style },
    ...props
  };

  // Ensure width/height when not using fill
  if (!props.fill && !props.width) {
    imageProps.width = props.width || 400;
    imageProps.height = props.height || 400;
  }

  return <Image {...imageProps} />;
};

export default SafeImage;
