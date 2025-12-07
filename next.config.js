/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true, // Enable instrumentation for self-ping
  },
  images: {
    domains: [],
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
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
