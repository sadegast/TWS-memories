"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { MapNodeAnchor } from "@/lib/types/map";

interface Props {
  node: MapNodeAnchor;
  index: number;
}

const ICON_PATHS: Record<string, string> = {
  star: "M12 2L15 9L22 9L16 14L18 21L12 17L6 21L8 14L2 9L9 9Z",
  flower: "M12 2C12 6 20 8 20 12C20 16 12 18 12 22C12 18 4 16 4 12C4 8 12 6 12 2Z",
  bell: "M12 2C10 2 8 4 8 7V9C5 9 4 11 4 12H20C20 11 19 9 16 9V7C16 4 14 2 12 2ZM10 15C10 16.5 11 18 12 18S14 16.5 14 15",
  heart: "M12 21C12 21 3 14 3 8C3 5 5 3 8 3C10 3 12 5 12 5C12 5 14 3 16 3C19 3 21 5 21 8C21 14 12 21 12 21Z",
  music: "M9 18V6L20 4V16M9 18C9 20 7.5 21 6 21S3 20 3 18S4.5 15 6 15S9 16 9 18ZM20 16C20 18 18.5 19 17 19S14 18 14 16S15.5 13 17 13S20 14 20 16Z",
  fire: "M12 2C12 2 8 8 8 13C8 15.5 10 17.5 12 17.5S16 15.5 16 13C16 8 12 2 12 2ZM11 19C11 19 7 18 7 21H17C17 18 13 19 11 19Z",
  crystal: "M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8Z",
};

const ICON_COLORS: Record<string, string> = {
  star: "#FFF5D6",
  flower: "#FADADD",
  bell: "#D4E5F7",
  heart: "#FADADD",
  music: "#B4D8F0",
  fire: "#FFF5D6",
  crystal: "#A8C8E8",
};

export function TimeAnchorNode({ node, index }: Props) {
  const router = useRouter();
  const iconPath = ICON_PATHS[node.iconType] || ICON_PATHS.star;
  const iconColor = ICON_COLORS[node.iconType] || "#FFF5D6";

  return (
    <motion.g
      className="cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: 1.5 + index * 0.15,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{ scale: 1.1 }}
      onClick={() => router.push(`/node/${node.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Outer glow ring */}
      <circle
        cx={node.position.x}
        cy={node.position.y}
        r="24"
        fill="none"
        stroke={iconColor}
        strokeWidth="1.5"
        opacity="0.5"
      >
        <animate
          attributeName="r"
          values="24;28;24"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0.25;0.5"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Node circle background */}
      <circle
        cx={node.position.x}
        cy={node.position.y}
        r="16"
        fill="white"
        fillOpacity="0.85"
        stroke={iconColor}
        strokeWidth="2"
        filter="url(#soft-shadow)"
      />

      {/* Icon */}
      <g transform={`translate(${node.position.x - 8}, ${node.position.y - 8})`}>
        <path
          d={iconPath}
          fill={iconColor}
          stroke={iconColor}
          strokeWidth="0.3"
          strokeOpacity="0.5"
          transform="scale(0.7) translate(5, 5)"
        />
      </g>

      {/* Date label */}
      <text
        x={node.position.x}
        y={node.position.y + 55}
        textAnchor="middle"
        fill="#4C3220"
        fontSize="36"
        fontWeight="500"
        fontFamily="var(--font-zcool-kuaile), var(--font-gaegu), cursive"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {node.date}
      </text>

      {/* Era title */}
      <text
        x={node.position.x}
        y={node.position.y + 100}
        textAnchor="middle"
        fill="#91c1ff"
        fontSize="48"
        fontWeight="700"
        fontFamily="var(--font-zcool-kuaile), var(--font-gaegu), cursive"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {node.eraTitle}
      </text>

      {/* Era subtitle */}
      <text
        x={node.position.x}
        y={node.position.y + 145}
        textAnchor="middle"
        fill="#1A1A1A"
        fontSize="36"
        fontWeight="500"
        fontFamily="var(--font-zcool-kuaile), var(--font-gaegu), cursive"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {node.eraSubtitle}
      </text>
    </motion.g>
  );
}
