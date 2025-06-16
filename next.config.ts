/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mindful-fireworks-e94e8b5d87.media.strapiapp.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig

