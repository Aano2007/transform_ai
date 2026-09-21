const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://127.0.0.1:8000/auth/:path*',
      },
      {
        source: '/health',
        destination: 'http://127.0.0.1:8000/health',
      }
    ];
  },
};

module.exports = nextConfig;
