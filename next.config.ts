import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // default is "1mb" 4mb max
    },
  },
  images: { 
    remotePatterns:[
      {
        protocol: "https",
        hostname: "zd5cjqkbzkd7qb9h.public.blob.vercel-storage.com",
      }
    ]
  }
};

export default nextConfig;
