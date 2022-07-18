/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'gravatar.com',
      "s.gravatar.com",
      "tailwindui.com",
      "images.unsplash.com"
    ]
  }
}

module.exports = nextConfig
