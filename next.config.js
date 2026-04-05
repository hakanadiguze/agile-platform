/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow iframing the agile tools hosted on GitHub Pages
  async headers() {
    return [
      {
        source: '/platform/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
