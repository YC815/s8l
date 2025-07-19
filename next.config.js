/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  images: {
    domains: ['zeabur.com', 'qr-official.line.me', 'scdn.line-apps.com']
  }
}

module.exports = nextConfig