/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Optimize for faster page loads
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Ensure workspace packages are transpiled
  transpilePackages: ["@repo/common"],

  // Optimize images and static assets
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimize bundle splitting - disable for now due to critters issue
  experimental: {
    // optimizeCss: true, // Temporarily disabled
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
