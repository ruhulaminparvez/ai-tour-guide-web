/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['media-cdn.tripadvisor.com', 'www.tripadvisor.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig

