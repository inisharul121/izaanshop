import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const storage = localStorage.getItem('izaan-shop-storage');
  if (storage) {
    const { state } = JSON.parse(storage);
    if (state.user?.token) {
      config.headers.Authorization = `Bearer ${state.user.token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

export default api;
