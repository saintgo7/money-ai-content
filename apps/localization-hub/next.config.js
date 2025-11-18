/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/shared', '@repo/ai-client', '@repo/database'],
};
module.exports = nextConfig;
