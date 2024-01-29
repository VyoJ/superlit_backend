/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backendi/:path*",
        destination: "http://localhost:6969/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
