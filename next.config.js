/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  images: {
    minimumCacheTTL: 86400, // 1 day
    remotePatterns: [
      {
        protocol: "https",
        hostname: "digitalent.ch",
      },
      {
        protocol: "https",
        hostname: "*digitalent.cloud",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
      },
      { protocol: "https", hostname: "*vercel-insights.com" },
      { protocol: "https", hostname: "vercel-insights.com" },
      { protocol: "https", hostname: "*sentry.io" },
      { protocol: "https", hostname: "sentry.io" },
      { protocol: "https", hostname: "fonts.gstatic.com" },
    ],
  },
};

module.exports = nextConfig;
