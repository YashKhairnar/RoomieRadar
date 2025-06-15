import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins : ["http://localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/200',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/200',
      },
      {
        protocol: 'https',
        hostname : 'xsgames.co',
        pathname : '/randomusers/assets/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        pathname: '/images/stock/**',
      }
    ],
  }
}

export default nextConfig;
