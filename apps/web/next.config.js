/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Ensure workspace packages are transpiled
  transpilePackages: ["@repo/common", "@repo/ui"],

  images: {
    formats: ["image/webp", "image/avif"],
  },

  experimental: {
    // optimizeCss: true, // Temporarily disabled (critters issue)
  },

  turbopack: {
    root: process.env.TURBOPACK_ROOT || process.cwd(),
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
