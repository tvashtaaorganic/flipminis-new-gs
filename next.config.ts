import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/stores-sitemap-:page.xml',
        destination: '/api/sitemaps/stores/:page',
      },
      {
        source: '/products-sitemap-:page.xml',
        destination: '/api/sitemaps/products/:page',
      },
    ];
  },
};

export default nextConfig;
