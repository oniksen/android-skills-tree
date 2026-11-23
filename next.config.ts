import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js внедряет инлайновые bootstrap-скрипты и стили.
      // В dev-режиме React требует eval() для отладочных возможностей.
      "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com" +
        (process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""),
      "style-src 'self' 'unsafe-inline'",
      "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://*.google.com",
      // Firebase web SDK: REST + вебсокеты Firestore, Auth.
      "connect-src 'self' https://*.googleapis.com wss://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://apis.google.com",
      "img-src 'self' data: https://*.googleapis.com",
      "font-src 'self'",
      "worker-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
    ].join("; "),
  },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    // Pages render only a client shell (all user data comes from Firestore),
    // so reusing the payload briefly is safe and removes the server round-trip
    // when switching tabs.
    //
    // Development keeps the router cache effectively off (dynamic 0). Next 16
    // requires static to be at least 30 seconds; the short window still avoids
    // stale chunk references after a dev-server restart.
    staleTimes:
      process.env.NODE_ENV === "production"
        ? { dynamic: 30, static: 300 }
        : { dynamic: 0, static: 30 },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
