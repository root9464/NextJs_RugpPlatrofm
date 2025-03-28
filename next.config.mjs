/* eslint-disable no-undef */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['recharts, rxjs, @ton/core'],
    gzipSize: true,
  
  },
  swcMinify: true,
  reactStrictMode: true,

  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](@xyflow|recharts|rxjs)[\\/]/,
          name: 'vendor-libs',
          chunks: 'all',
          priority: -10,
        },
        default: {
          minChunks: 3,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };

    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
        
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
