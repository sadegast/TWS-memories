"use client";

import { useMemo } from "react";

const SAKURA_COLORS = ["#87CDEF", "#ACDEF5", "#CCEDFC", "#E3F5FF", "#F0F0F0"];

function generateCssPetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 31 + 17) % 100}%`,
    size: 12 + ((i * 19) % 20),
    color: SAKURA_COLORS[i % SAKURA_COLORS.length],
    duration: 10 + ((i * 23) % 12),
    delay: (i * 3.7) % 14,
    opacity: 0.35 + ((i * 13) % 25) / 100,
  }));
}

interface FallingSakuraProps {
  count?: number;
  containerClassName?: string;
}

export function FallingSakura({ count = 40, containerClassName }: FallingSakuraProps) {
  const petals = useMemo(() => generateCssPetals(count), [count]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${containerClassName ?? ""}`}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={`css-${petal.id}`}
          className="absolute animate-sakura-fall"
          style={{
            left: petal.left,
            top: "-40px",
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            color: petal.color,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <svg viewBox="-15 -15 30 30" className="w-full h-full">
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(0)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(72)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(144)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(216)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(288)" />
            <circle cx="0" cy="0" r="2.5" fill="#FFF5D6" opacity="0.5" />
          </svg>
        </div>
      ))}
    </div>
  );
}
