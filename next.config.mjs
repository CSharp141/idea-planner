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

  async headers() {
    return [
      {
        // Apply security headers to every route.
        source: "/(.*)",
        headers: [
          // Prevent the page from being embedded in an iframe on any other origin.
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing — honour the declared Content-Type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Only send the origin as the Referer header when navigating to an
          // equally secure destination; strip it entirely for cross-origin requests.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for 1 year; include subdomains so cookies can't be
          // downgraded. preload is omitted intentionally — add it once the domain
          // is submitted to the HSTS preload list.
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Disable browser features that this app does not need.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Content Security Policy.
          // - default-src 'self': only same-origin resources by default.
          // - script-src: Next.js requires 'unsafe-inline' and 'unsafe-eval'
          //   in development; in production only same-origin scripts run.
          //   The 'strict-dynamic' token is not used here because nonce-based
          //   CSP requires server-side nonce injection on every request.
          // - style-src 'unsafe-inline': Tailwind CSS inlines critical styles.
          // - img-src: allow data URIs (favicon/inline SVGs) and all HTTPS images
          //   so GitHub avatars and other remote assets load correctly.
          // - connect-src: Supabase REST + Auth endpoints and the Gemini AI API.
          // - frame-ancestors 'none': belt-and-suspenders alongside X-Frame-Options.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com",
              "frame-src 'none'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // Prevent cross-origin access to the app's resources unless explicitly
          // allowed. This blocks CSRF-style attacks on same-site cookies.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
