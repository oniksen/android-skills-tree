"use client";

import { useId, useMemo } from "react";

const COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#38bdf8"];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export default function Confetti({ count = 60 }: { count?: number }) {
  const id = useId();
  const pieces = useMemo(() => {
    const rand = mulberry32(hashString(id) % 100000);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      delay: rand() * 0.7,
      duration: 2.6 + rand() * 1.2,
      color: COLORS[i % COLORS.length],
      width: 6 + rand() * 5,
      height: 8 + rand() * 8,
      radius: rand() > 0.6 ? 9999 : 2,
    }));
  }, [count, id]);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 -top-10 bottom-full z-20 overflow-visible"
      aria-hidden
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.radius,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}