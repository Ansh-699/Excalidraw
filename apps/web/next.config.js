/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for faster page loads
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize images and static assets
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Optimize bundle splitting
  experimental: {
    optimizeCss: true,
  },
  
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
