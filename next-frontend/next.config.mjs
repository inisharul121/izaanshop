import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getApiHostname = () => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    return new URL(url).hostname;
  } catch (e) {
    return 'localhost';
  }
};

const getApiPort = () => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    return new URL(url).port || (url.startsWith('https') ? '' : '5001');
  } catch (e) {
    return '5001';
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin Turbopack workspace root to silence the multi-lockfile warning on cPanel
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: (process.env.NEXT_PUBLIC_API_URL || '').startsWith('https') ? 'https' : 'http',
        hostname: getApiHostname(),
        port: getApiPort(),
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5001',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
      },
      {
        protocol: 'http',
        hostname: '::1',
        port: '5001',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    unoptimized: false, // 🚀 ENABLE image optimization (was killing performance)
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85], // 🚀 Add quality 85 to support optimized SafeImage
    
    // Cache for 1 year (production)
    minimumCacheTTL: 31536000, 
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Reduce device sizes to avoid generating too many variants
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Allow dev origins for private IP image fetching (Next.js 16)
  allowedDevOrigins: ['http://localhost:5001', 'http://127.0.0.1:5001'],
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/wishlist',
        destination: '/',
        permanent: false,
      },
      {
        source: '/categories',
        destination: '/',
        permanent: false,
      },
      {
        source: '/shop',
        destination: '/',
        permanent: false,
      },
      // Redirect missing documentation pages to home for now
      {
        source: '/shipping',
        destination: '/',
        permanent: false,
      },
      {
        source: '/returns',
        destination: '/',
        permanent: false,
      },

      {
        source: '/faq',
        destination: '/',
        permanent: false,
      },
      {
        source: '/contact',
        destination: '/',
        permanent: false,
      },
      {
        source: '/privacy',
        destination: '/',
        permanent: false,
      },
    ];
  },

  // 🚀 Bundle Size & Performance Optimizations
  compress: true, // Enable gzip compression
  
  // Reduce JavaScript bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.logs in production
  },
  
  // Optimize heavy dependencies like framer-motion and lucide-react
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Production minifier optimizations
  // swcMinify: true, // Removed in Next.js 16 (now default)
  
  // Reduce build output footprint for smaller cPanel deployments
  output: 'standalone', 
};

export default nextConfig;
