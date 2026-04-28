export const getImageUrl = (path) => {
  if (!path || path === '/placeholder.png') return '/placeholder.png';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const baseUrl = apiUrl.replace('/api', '').replace(/\/$/, '');
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Preload images to speed up rendering
 * Use for priority images (above the fold) to start loading early
 */
export const preloadImage = (src) => {
  if (typeof window === 'undefined') return;
  if (!src || src === '/placeholder.png') return;
  
  try {
    const img = new Image();
    img.src = getImageUrl(src);
  } catch (err) {
    console.warn('Failed to preload image:', src);
  }
};

/**
 * Preload multiple images in parallel
 * Useful for preloading first few products or banner images
 */
export const preloadImages = (imageSources) => {
  if (typeof window === 'undefined') return;
  imageSources.forEach(src => preloadImage(src));
};
