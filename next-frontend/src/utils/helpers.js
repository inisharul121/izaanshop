export const getImageUrl = (img) => {
  if (!img) return 'https://placehold.co/400x500/F8F9FA/2D3748?text=Product';
  if (img.startsWith('http')) return img;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
    : 'http://localhost:5001';
    
  const cleanPath = img.startsWith('/') ? img : `/${img}`;
  return `${baseUrl}${cleanPath}`;
};
