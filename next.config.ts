import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static: deployable to any static host or CDN.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
