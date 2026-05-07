/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 14 caches dynamic route segments in the client-side router cache
    // for 30 seconds by default. Setting dynamic to 0 disables this so navigating
    // back to the dashboard always fetches fresh data from the server.
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
