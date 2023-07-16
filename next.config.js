/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    typescript: {
        ignoreBuildErrors: true,
        ignoreDuringBuilds: true,
    },
    experimental: {
        appDir: false,
    },
}

module.exports = nextConfig
