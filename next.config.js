/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: config => {
      config.resolve.fallback = { fs: false, net: false, tls: false };
      return config;
    },
    typescript: {
        ignoreBuildErrors: true,
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig
