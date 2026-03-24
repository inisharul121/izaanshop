export const getImageUrl = (img) => {
  if (!img) return 'https://placehold.co/400x500/F8F9FA/2D3748?text=Product';
  if (img.startsWith('http')) return img;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api' : '');
  const baseUrl = apiUrl.replace('/api', '');
  
  const cleanPath = img.startsWith('/') ? img : `/${img}`;
  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
};
