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
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    unoptimized: true,
  },
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
};

export default nextConfig;
