/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    typescript: {
        ignoreBuildErrors: true,
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig
