/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add this to enable Vercel deployment
  target: 'serverless',
}

module.exports = nextConfig