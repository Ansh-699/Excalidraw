/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Workspace packages need transpiling for the App Router build
  transpilePackages: ["@repo/common", "@repo/ui"],

  images: {
    formats: ["image/webp", "image/avif"],
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
