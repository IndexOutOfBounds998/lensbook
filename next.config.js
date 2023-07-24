/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
    typescript: {
        ignoreBuildErrors: true,
        ignoreDuringBuilds: true,
    },
    images: {
        minimumCacheTTL: 60,
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
}

module.exports = nextConfig
