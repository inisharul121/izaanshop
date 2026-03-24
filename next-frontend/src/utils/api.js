import axios from 'axios';
import { getImageUrl } from './helpers';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.NODE_ENV === 'development') return 'http://localhost:5001/api';
  return ''; // Production must have env variable
};

const api = axios.create({
  baseURL: getBaseUrl(),
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
    // 1. Better error logging for Network Issues
    if (!error.response) {
      console.error('🌐 NETWORK ERROR: Cannot reach the backend API.');
      console.error(`Attempted URL: ${error.config?.baseURL}${error.config?.url}`);
      console.error('Possible causes: Backend is NOT running, incorrect NEXT_PUBLIC_API_URL, or CORS issues.');
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.warn('💡 TIP: Check if your backend server is started (npm run dev in /backend)');
      }
    }

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

export { getImageUrl };
export default api;
