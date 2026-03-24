export const getImageUrl = (path) => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const baseUrl = apiUrl.replace('/api', '').replace(/\/$/, '');
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
