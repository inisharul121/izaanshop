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
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
