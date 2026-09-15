/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'gravatar.com' },
      { hostname: 's.gravatar.com' },
      { hostname: 'tailwindui.com' },
      { hostname: 'images.unsplash.com' }
    ]
  }
}

module.exports = nextConfig
