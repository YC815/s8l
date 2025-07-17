/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  images: {
    domains: ['zeabur.com']
  }
}

module.exports = nextConfig