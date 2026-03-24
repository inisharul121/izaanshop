import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storage = localStorage.getItem('izaan-shop-storage');
    if (storage) {
      try {
        const { state } = JSON.parse(storage);
        if (state.user?.token) {
          config.headers.Authorization = `Bearer ${state.user.token}`;
        }
      } catch (e) {
        console.error('Error parsing storage', e);
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Avoid redirecting on checkout where auth is optional
      if (!window.location.pathname.includes('/checkout')) {
        localStorage.removeItem('izaan-shop-storage');
        const loginPath = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
        window.location.href = `${loginPath}?expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (path) => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'}${path}`;
};

export default api;
