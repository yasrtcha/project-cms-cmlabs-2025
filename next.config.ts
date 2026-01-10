import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    // --- TAMBAHAN PENTING DI SINI ---
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Mengizinkan domain avatar
      },
    ],
    // -------------------------------
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // React strict mode for better development
  reactStrictMode: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-avatar', '@radix-ui/react-progress', '@radix-ui/react-slot'],
    // Optimize CSS
    optimizeCss: true,
  },
  
  // Production optimizations
  poweredByHeader: false,
  
  // Output standalone for better performance
  output: 'standalone',
  
};

export default nextConfig;