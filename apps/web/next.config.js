/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Optimize for faster page loads
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Ensure workspace packages are transpiled
  transpilePackages: ["@repo/common", "@repo/ui"],

  // Optimize images and static assets
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimize bundle splitting - disable for now due to critters issue
  experimental: {
    // optimizeCss: true, // Temporarily disabled
  },
  
  // Set Turbopack root for workspace compatibility in Docker builds
  turbopack: {
    root: process.env.TURBOPACK_ROOT || process.cwd(),
  },

  // Allow dev access from your droplet IP to suppress cross-origin warning
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: [
    'http://139.59.0.171',
    'http://139.59.0.171:3000',
    'http://139.59.0.171:3003',
  ],
  
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
