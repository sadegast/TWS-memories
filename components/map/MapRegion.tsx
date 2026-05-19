"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { MapRegion as MapRegionType } from "@/lib/types/map";

interface Props {
  region: MapRegionType;
}

// Sakura island color palette — blue-white tones at 80% opacity
const ISLAND_COLORS = ["#87CDEF", "#ACDEF5", "#CCEDFC", "#E3F5FF", "#F0F0F0"];
const ISLAND_OPACITY = 0.8;
const BUBBLE_COLOR = "#F5F5F5";
const BUBBLE_OPACITY = 0.4;

// Generate a deterministic but varied set of petals for each region
function generatePetals(regionId: string, cx: number, cy: number) {
  const seed = regionId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = 12 + (seed % 9);
  const petals: Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    color: string;
    flip: boolean;
  }> = [];

  for (let i = 0; i < count; i++) {
    const angle = ((i / count) * Math.PI * 2) + (seed % 360) * (Math.PI / 180);
    const radius = 30 + (seed * (i + 1)) % 80;
    const x = cx + Math.cos(angle) * radius + ((seed + i * 7) % 30) - 15;
    const y = cy + Math.sin(angle) * radius * 0.7 + ((seed + i * 13) % 25) - 12;
    const size = 24 + ((seed * (i + 3)) % 45);
    const rotation = ((seed * (i + 1) * 17) % 360);
    const color = ISLAND_COLORS[(seed + i) % ISLAND_COLORS.length];
    const flip = (seed + i) % 3 === 0;

    petals.push({ id: i, x, y, size, rotation, color, flip });
  }

  return petals;
}

// Generate a deterministic drift animation path for bumper-car effect
function generateDriftValues(seed: number): { values: string; dur: number } {
  const w1 = ((seed * 7) % 80) - 40;
  const h1 = ((seed * 13) % 60) - 30;
  const w2 = ((seed * 17) % 70) - 50;
  const h2 = ((seed * 23) % 55) - 20;
  const w3 = ((seed * 29) % 60) - 25;
  const h3 = ((seed * 31) % 65) - 35;
  const w4 = ((seed * 37) % 75) - 45;
  const h4 = ((seed * 41) % 50) - 15;

  return {
    values: `0,0; ${w1},${h1}; ${w2},${h2}; ${w3},${h3}; ${w4},${h4}; ${-w1},${-h1}; 0,0`,
    dur: 22 + (seed % 18),
  };
}

// Generate a slightly unique organic bubble shape around the center
function generateBubblePath(regionId: string): string {
  const seed = regionId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  // Larger, rounder dimensions — still varied per region
  const rx = 230 + (seed % 55);           // half-width: 230–285
  const ry = 195 + ((seed * 3) % 55);     // half-height: 195–250

  // Tighter control-point range for rounder, fuller bubbles (0.82–0.98)
  const cpTop = 0.82 + ((seed * 7) % 16) / 100;
  const cpRight = 0.84 + ((seed * 11) % 14) / 100;
  const cpBottom = 0.82 + ((seed * 13) % 16) / 100;
  const cpLeft = 0.84 + ((seed * 5) % 14) / 100;

  // Build an organic blob with 4 cubic bezier curves, centered at origin
  const top = -ry;
  const bottom = ry;
  const left = -rx;
  const right = rx;

  const cxTop = rx * cpTop;
  const cxRight = rx * cpRight;
  const cxBottom = rx * cpBottom;
  const cxLeft = rx * cpLeft;

  return [
    `M ${left},0`,
    `C ${left},${top * 0.8} ${-cxLeft},${top} 0,${top}`,
    `C ${cxRight},${top} ${right},${top * 0.8} ${right},0`,
    `C ${right},${bottom * 0.8} ${cxBottom},${bottom} 0,${bottom}`,
    `C ${-cxBottom},${bottom} ${left},${bottom * 0.8} ${left},0`,
    "Z",
  ].join(" ");
}

export function MapRegion({ region }: Props) {
  const router = useRouter();
  const seed = region.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [isHovered, setIsHovered] = useState(false);
  const isClickable = Boolean(region.linkTo);

  const petals = useMemo(
    () => generatePetals(region.id, region.centerPoint.x, region.centerPoint.y),
    [region.id, region.centerPoint.x, region.centerPoint.y]
  );

  const bubblePath = useMemo(
    () => generateBubblePath(region.id),
    [region.id]
  );

  const drift = useMemo(
    () => generateDriftValues(seed),
    [seed]
  );

  const handleClick = () => {
    if (region.linkTo) {
      router.push(region.linkTo);
    }
  };

  return (
    <motion.g
      style={{ cursor: isClickable ? "pointer" : "default" }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={isClickable ? { filter: "url(#node-glow)" } : {}}
    >
      {/* Bumper-car drift: slow meandering movement unique to each region */}
      <animateTransform
        attributeName="transform"
        type="translate"
        values={drift.values}
        keyTimes="0; 0.17; 0.33; 0.5; 0.67; 0.83; 1"
        dur={`${drift.dur}s`}
        repeatCount="indefinite"
      />

      {/* Bubble backing */}
      <g transform={`translate(${region.centerPoint.x}, ${region.centerPoint.y})`}>
        <motion.path
          d={bubblePath}
          fill={BUBBLE_COLOR}
          opacity={BUBBLE_OPACITY}
          style={{ pointerEvents: "none" }}
          animate={isClickable ? { scale: isHovered ? 1.03 : 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.03;1;0.98;1"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="5s"
            repeatCount="indefinite"
          />
        </motion.path>
      </g>

      {/* Transparent hit area for clickable regions */}
      {isClickable && (
        <rect
          x={region.centerPoint.x - 300}
          y={region.centerPoint.y - 260}
          width={600}
          height={520}
          fill="transparent"
          style={{ pointerEvents: "fill" }}
        />
      )}

      {/* Sakura petal cluster forming an island */}
      {petals.map((petal) => (
        <motion.g
          key={petal.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: isHovered && isClickable ? 1.06 : 1 }}
          transition={{
            duration: 0.6,
            delay: 0.8 + petal.id * 0.04,
            ease: "easeOut",
          }}
        >
          <g
            transform={`translate(${petal.x}, ${petal.y}) rotate(${petal.rotation}) scale(${petal.size / 30}) ${petal.flip ? "scale(-1, 1)" : ""}`}
            opacity={ISLAND_OPACITY}
          >
            <use href="#sakura-petal" fill={petal.color} />
          </g>
        </motion.g>
      ))}

      {/* Sakura burst particles on hover */}
      {isClickable &&
        isHovered &&
        Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const distance = 60 + (i % 3) * 30;
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance;
          return (
            <motion.g
              key={`burst-${i}`}
              initial={{ opacity: 0.8, scale: 0.5, x: region.centerPoint.x, y: region.centerPoint.y }}
              animate={{ opacity: 0, scale: 1.2, x: region.centerPoint.x + dx, y: region.centerPoint.y + dy }}
              transition={{ duration: 0.8 + (i * 0.05), repeat: Infinity, ease: "easeOut" }}
            >
              <use
                href="#sakura-petal"
                fill={ISLAND_COLORS[i % ISLAND_COLORS.length]}
                transform={`rotate(${i * 45})`}
              />
            </motion.g>
          );
        })}

      {/* Region name label */}
      <text
        x={region.centerPoint.x}
        y={region.centerPoint.y - 15}
        textAnchor="middle"
        fill="url(#name-gradient)"
        fontSize="51"
        fontWeight="600"
        fontFamily="var(--font-zcool-kuaile), var(--font-gaegu), cursive"
        opacity={isClickable ? 0.65 : 0.55}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {region.name}
      </text>

      {/* Korean name */}
      <text
        x={region.centerPoint.x}
        y={region.centerPoint.y + 35}
        textAnchor="middle"
        fill="#0D3A6D"
        fontSize="39"
        fontWeight="500"
        fontFamily="var(--font-zcool-kuaile), var(--font-gaegu), cursive"
        opacity="0.45"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {region.koreanName}
      </text>
    </motion.g>
  );
}
