"use client";

import { useMemo } from "react";

const SAKURA_COLORS = ["#87CDEF", "#ACDEF5", "#CCEDFC", "#E3F5FF", "#F0F0F0"];
const CONFETTI_COLORS = ["#FADADD", "#FFF5D6", "#B4D8F0", "#D5F0E0", "#E8D5F5"];

// Deterministic pencil doodle data
function generateDoodles() {
  const types = ["star", "heart", "note", "plane", "cloud", "smile"];
  const doodles: Array<{
    id: number;
    type: string;
    x: string;
    y: string;
    size: number;
    rotation: number;
    duration: number;
    delay: number;
  }> = [];
  for (let i = 0; i < 22; i++) {
    doodles.push({
      id: i,
      type: types[i % types.length],
      x: `${((i * 137 + 73) % 94)}%`,
      y: `${((i * 89 + 41) % 88)}%`,
      size: 18 + ((i * 31) % 28),
      rotation: (i * 47) % 360,
      duration: 4.5 + ((i * 13) % 6),
      delay: (i * 1.7) % 4,
    });
  }
  return doodles;
}

// Deterministic sakura petal data
function generateSakuraPetals() {
  return Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${(i * 29 + 11) % 100}%`,
    size: 12 + ((i * 17) % 18),
    color: SAKURA_COLORS[i % SAKURA_COLORS.length],
    duration: 9 + ((i * 19) % 10),
    delay: (i * 3.3) % 12,
    drift: -15 + ((i * 37) % 30),
  }));
}

// Deterministic confetti data
function generateConfetti() {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${((i * 43 + 7) % 96)}%`,
    width: 6 + ((i * 11) % 8),
    height: 10 + ((i * 7) % 14),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    duration: 7 + ((i * 17) % 9),
    delay: (i * 2.1) % 10,
    rotation: (i * 53) % 360,
  }));
}

// SVG doodle paths
function DoodleSVG({ type, size }: { type: string; size: number }) {
  switch (type) {
    case "star":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          <path
            d="M12 2 L15 9 L22 9 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9 L9 9 Z"
            stroke="#5B8BA0"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          <path
            d="M12 21 C12 21 3 14 3 8 C3 5.5 5 4 7 4 C8.5 4 10 5 12 7 C14 5 15.5 4 17 4 C19 4 21 5.5 21 8 C21 14 12 21 12 21Z"
            stroke="#5B8BA0"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>
      );
    case "note":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          <circle cx="8" cy="16" r="3" stroke="#5B8BA0" strokeWidth="1" opacity="0.6" />
          <line x1="11" y1="16" x2="18" y2="8" stroke="#5B8BA0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="18" y1="8" x2="18" y2="16" stroke="#5B8BA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="18" y1="8" x2="14" y2="8" stroke="#5B8BA0" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "plane":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          <path
            d="M2 12 L10 8 L22 2 L16 14 L12 22 L10 16 Z"
            stroke="#5B8BA0"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 30 20" width={size} height={size * 0.7} fill="none">
          <path
            d="M6 16 C3 16 0 14 1 10 C0 6 4 3 8 4 C9 2 13 0 16 2 C20 0 24 2 25 6 C28 6 30 9 28 12 C30 14 28 17 25 16 Z"
            stroke="#5B8BA0"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>
      );
    case "smile":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          <circle cx="12" cy="12" r="10" stroke="#5B8BA0" strokeWidth="1" opacity="0.6" />
          <circle cx="8" cy="10" r="1.2" fill="#5B8BA0" opacity="0.5" />
          <circle cx="16" cy="10" r="1.2" fill="#5B8BA0" opacity="0.5" />
          <path d="M8 15 Q12 19 16 15" stroke="#5B8BA0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
}

export function BackgroundElements() {
  const doodles = useMemo(() => generateDoodles(), []);
  const petals = useMemo(() => generateSakuraPetals(), []);
  const confetti = useMemo(() => generateConfetti(), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Layer 1: Soft gradient base */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "linear-gradient(135deg, #FBF9F6 0%, #F0F4FA 30%, #FBF9F6 60%, #E8F0FA 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Layer 2: Pencil sketch doodle watermarks */}
      {doodles.map((d) => (
        <div
          key={`doodle-${d.id}`}
          className="absolute animate-pencil-sketch-breathe"
          style={{
            left: d.x,
            top: d.y,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            transform: `rotate(${d.rotation}deg)`,
          }}
        >
          <DoodleSVG type={d.type} size={d.size} />
        </div>
      ))}

      {/* Layer 3: Blue sakura petals */}
      {petals.map((petal) => (
        <div
          key={`petal-${petal.id}`}
          className="absolute animate-sakura-fall animate-sakura-sway"
          style={{
            left: petal.left,
            top: "-30px",
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDuration: `${petal.duration}s, ${petal.duration * 0.4}s`,
            animationDelay: `${petal.delay}s, ${petal.delay * 0.5}s`,
            color: petal.color,
            opacity: 0.5,
          }}
        >
          <svg viewBox="-15 -15 30 30" className="w-full h-full">
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(0)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(72)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(144)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(216)" />
            <path d="M0,0 C-8,-10 -13,-18 0,-26 C13,-18 8,-10 0,0Z" fill="currentColor" transform="rotate(288)" />
            <circle cx="0" cy="0" r="2.5" fill="#FFF5D6" opacity="0.4" />
          </svg>
        </div>
      ))}

      {/* Layer 4: Hand-drawn confetti */}
      {confetti.map((c) => (
        <div
          key={`confetti-${c.id}`}
          className="absolute animate-confetti-fall"
          style={{
            left: c.left,
            top: "-20px",
            width: `${c.width}px`,
            height: `${c.height}px`,
            backgroundColor: c.color,
            borderRadius: c.id % 3 === 0 ? "50%" : c.id % 3 === 1 ? "2px" : "0",
            opacity: 0.6,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
            transform: `rotate(${c.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
