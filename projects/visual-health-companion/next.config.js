/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.readyplayer.me', 'cdn.readyplayer.me'],
  },
}

module.exports = nextConfig
