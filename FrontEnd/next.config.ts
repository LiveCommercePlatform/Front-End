import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui.aceternity.com',
        port: '', // معمولا خالیه
        pathname: '/**', // همه مسیرها
      },
    ],
  },};

export default nextConfig;
