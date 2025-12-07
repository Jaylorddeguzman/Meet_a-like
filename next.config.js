/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false, // Disable to prevent double-renders causing flicker
  experimental: {
    instrumentationHook: true, // Enable instrumentation for self-ping
    optimizeCss: true, // Enable CSS optimization
  },
  onDemandEntries: {
    // Reduce auto-reload frequency
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  images: {
    domains: [],
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  optimizeFonts: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Exclude BigQuery and other Node.js modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'google-auth-library': false,
        '@google-cloud/bigquery': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
