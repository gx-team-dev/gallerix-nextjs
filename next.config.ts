import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gallerix.se',
        port: '',
      },
    ],
  },
};

export default nextConfig;
