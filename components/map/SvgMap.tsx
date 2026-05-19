"use client";

import { getMapRegions, getMapPaths, getMapNodes } from "@/lib/data/nodes";
import { MapRegion } from "./MapRegion";
import { TimeAnchorNode } from "./TimeAnchorNode";
import { MAP_VIEWBOX } from "@/lib/constants";
import { useMemo, useState, useEffect, useCallback } from "react";

// Sakura color palette
const SAKURA_COLORS = ["#87CDEF", "#ACDEF5", "#CCEDFC", "#E3F5FF", "#F0F0F0"];

function generateFallingSakura(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 137 + 73) % MAP_VIEWBOX.width,
    startY: -40 - ((i * 83) % 200),
    size: 12 + ((i * 47) % 28),
    rotation: (i * 53) % 360,
    color: SAKURA_COLORS[i % SAKURA_COLORS.length],
    duration: 10 + ((i * 37) % 14),
    delay: (i * 2.7) % 12,
    drift: -20 + ((i * 43) % 40),
  }));
}

export function SvgMap() {
  // Filter out clickable regions — rendered as CSS cloud cards instead
  const allRegions = getMapRegions();
  const regions = allRegions.filter((r) => !r.linkTo);
  const paths = getMapPaths();
  const nodes = getMapNodes();

  const fallingSakura = useMemo(() => generateFallingSakura(60), []);

  // Settled petals that accumulate at the bottom over time
  const [settledPetals, setSettledPetals] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    color: string;
  }>>([]);

  const nextIdRef = useMemo(() => ({ current: 10000 }), []);

  const addSettledPetals = useCallback(() => {
    const newPetals = Array.from({ length: 5 }, (_, i) => {
      const id = nextIdRef.current++;
      return {
        id,
        x: Math.random() * MAP_VIEWBOX.width,
        y: MAP_VIEWBOX.height - 10 - Math.random() * 60,
        size: 14 + Math.random() * 24,
        rotation: Math.random() * 360,
        color: SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)],
      };
    });
    setSettledPetals((prev) => [...prev, ...newPetals]);
  }, []);

  useEffect(() => {
    // Initial batch
    addSettledPetals();
    // Accumulate every 4 seconds
    const interval = setInterval(addSettledPetals, 4000);
    return () => clearInterval(interval);
  }, [addSettledPetals]);

  return (
    <div
      className="w-full h-full"
      style={{
        paddingTop: "12%",
        // Paper texture CSS overlay
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    >
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ===== Defs ===== */}
        <defs>
          {/* Sakura petal shape */}
          <path
            id="sakura-petal"
            d="M 0,0 C -8,-10 -13,-18 0,-26 C 13,-18 8,-10 0,0 Z"
          />

          {/* Full sakura flower (5 petals) */}
          <g id="sakura-flower">
            <use href="#sakura-petal" transform="rotate(0)" />
            <use href="#sakura-petal" transform="rotate(72)" />
            <use href="#sakura-petal" transform="rotate(144)" />
            <use href="#sakura-petal" transform="rotate(216)" />
            <use href="#sakura-petal" transform="rotate(288)" />
            <circle cx="0" cy="0" r="3" fill="#FFF5D6" opacity="0.6" />
          </g>

          {/* Soft shadow filter */}
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#87CDEF" floodOpacity="0.25" />
          </filter>

          {/* Glow filter for nodes */}
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Colored pencil texture filter */}
          <filter id="pencil-texture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.06 0"
              in="noise"
              result="coloredNoise"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
          </filter>

          {/* Hand-drawn stroke filter for paths */}
          <filter id="hand-drawn" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.3"
              numOctaves="2"
              result="roughness"
            />
            <feDisplacementMap in="SourceGraphic" in2="roughness" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Region name gradient */}
          <linearGradient id="name-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7EBEFB" />
            <stop offset="100%" stopColor="#05509F" />
          </linearGradient>
        </defs>

        {/* ===== Drift wrapper: gentle pan over entire map ===== */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 40,-20; -30,25; 20,-15; -40,10; 0,0"
            keyTimes="0; 0.2; 0.4; 0.6; 0.8; 1"
            dur="30s"
            repeatCount="indefinite"
          />

        {/* ===== Layer 1: Sakura Petal Islands ===== */}
        {regions.map((region) => (
          <MapRegion key={region.id} region={region} />
        ))}

        {/* ===== Layer 2: Hand-drawn Paths ===== */}
        {paths.map((path, i) => (
          <path
            key={`${path.from}-${path.to}`}
            d={path.pathData}
            fill="none"
            stroke="#87CDEF"
            strokeWidth="2.5"
            strokeDasharray="10 8"
            strokeLinecap="round"
            opacity="0.5"
            filter="url(#hand-drawn)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-36"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>
        ))}

        {/* ===== Layer 3: Falling Sakura Petals ===== */}
        {fallingSakura.map((petal) => (
          <g key={`fall-${petal.id}`}>
            <animate
              attributeName="opacity"
              values="0.6;0.4;0.6"
              dur={`${petal.duration * 0.5}s`}
              repeatCount="indefinite"
              begin={`${petal.delay}s`}
            />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from={`${petal.x} ${petal.startY}`}
                to={`${petal.x + petal.drift} ${MAP_VIEWBOX.height + 60}`}
                dur={`${petal.duration}s`}
                repeatCount="indefinite"
                begin={`${petal.delay}s`}
              />
              <g transform={`rotate(${petal.rotation})`}>
                <use
                  href="#sakura-flower"
                  fill={petal.color}
                  transform={`scale(${petal.size / 28})`}
                />
              </g>
            </g>
          </g>
        ))}

        {/* ===== Layer 3.5: Settled petals accumulating at bottom ===== */}
        {settledPetals.map((petal) => (
          <g key={`settled-${petal.id}`} opacity={0.55 + Math.random() * 0.2}>
            <g
              transform={`translate(${petal.x}, ${petal.y}) rotate(${petal.rotation}) scale(${petal.size / 28})`}
            >
              <use href="#sakura-flower" fill={petal.color} />
            </g>
          </g>
        ))}

        {/* ===== Layer 4: Subtle pencil grain overlay ===== */}
        <rect
          x="0"
          y="0"
          width={MAP_VIEWBOX.width}
          height={MAP_VIEWBOX.height}
          fill="none"
          filter="url(#pencil-texture)"
          opacity="0.3"
          style={{ pointerEvents: "none", mixBlendMode: "multiply" }}
        />

        {/* ===== Layer 5: Time Anchor Nodes ===== */}
        {nodes.map((node, index) => (
          <TimeAnchorNode key={node.id} node={node} index={index} />
        ))}

        </g>
        {/* ===== End drift wrapper ===== */}
      </svg>
    </div>
  );
}
