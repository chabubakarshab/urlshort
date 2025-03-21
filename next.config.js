/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'scontent-lax.cdninstagram.com',
      'scontent.cdninstagram.com',
      'scontent.xx.fbcdn.net',
      'scontent.fkhi5-1.fna.fbcdn.net',
      'video-cdninstagram-com.translate.goog',
      'scontent.flhe42-1.fna',
      'scontent.flhe42-1.fna.fbcdn.net',
      'scontent-lax3-1.cdninstagram.com',
      'scontent-lax3-2.cdninstagram.com',
      'instagram.flhe42-1.fna.fbcdn.net',
      'instagram.fkhi5-1.fna.fbcdn.net',
      'scontent.fhex4-1.fna.fbcdn.net',
      'scontent.fhex4-2.fna.fbcdn.net',
      'scontent.fhex4-1.fna',
      'scontent.fhex4-2.fna',
      // Generic patterns to catch all variations
      'scontent-*.cdninstagram.com',
      'scontent-*.fna.fbcdn.net',
      'instagram.f*-*.fna.fbcdn.net',
      'scontent.f*-*.fna.fbcdn.net',
      'scontent.f*-*.fna'
    ],
  },
  // Add headers to prevent caching issues with Facebook crawler
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
