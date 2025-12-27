import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.shahzadfabricsbrandsshop.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
