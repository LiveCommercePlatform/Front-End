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
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**", // اگر فقط uploads نیست و جاهای دیگه هم داری
      },
    ],
  },};

export default nextConfig;