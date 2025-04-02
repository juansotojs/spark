/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.externals.push({
      '@prisma/client': '@prisma/client',
    });
    return config;
  },
};

module.exports = nextConfig; 