"use client";

import { useId } from "react";

interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({ className }: BrandMarkProps) {
  const gradientId = `brand-head-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="108 97 296 296"
      role="img"
      aria-label="android skill-tree"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#dd8263" />
          <stop offset="1" stopColor="#d97757" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="#c15f3c" strokeWidth="18" strokeLinecap="round">
        <line x1="160" y1="206" x2="120" y2="158" />
        <line x1="352" y1="206" x2="392" y2="158" />
      </g>
      <circle cx="120" cy="158" r="12" fill="#c15f3c" />
      <circle cx="392" cy="158" r="12" fill="#c15f3c" />

      <path d="M88 344 A168 168 0 0 1 424 344 Z" fill={`url(#${gradientId})`} />

      <circle cx="189" cy="232" r="18" fill="#1a1915" />
      <circle cx="323" cy="232" r="18" fill="#1a1915" />
    </svg>
  );
}
