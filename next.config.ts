import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js внедряет инлайновые bootstrap-скрипты и стили.
      // В dev-режиме React требует eval() для отладочных возможностей.
      "script-src 'self' 'unsafe-inline'" +
        (process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""),
      "style-src 'self' 'unsafe-inline'",
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
