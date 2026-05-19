"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getMapRegions } from "@/lib/data/nodes";

// Hand-drawn envelope icon
function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 48 40" width="44" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="42" height="28" rx="4" fill="#F0F4FA" stroke="#87CDEF" strokeWidth="1.5" />
      <path d="M3 6 L24 21 L45 6" stroke="#87CDEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="20" r="5" fill="#FADADD" opacity="0.6" />
      <path d="M20 20 C22 17, 26 17, 28 20 C26 23, 22 23, 20 20Z" fill="#FADADD" opacity="0.5" />
    </svg>
  );
}

// Hand-drawn train icon
function TrainIcon() {
  return (
    <svg viewBox="0 0 52 40" width="48" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Engine body */}
      <rect x="4" y="16" width="26" height="16" rx="5" fill="#D4E5F7" stroke="#87CDEF" strokeWidth="1.5" />
      {/* Chimney */}
      <rect x="8" y="8" width="8" height="10" rx="3" fill="#87CDEF" stroke="#87CDEF" strokeWidth="1.2" />
      {/* Smoke */}
      <circle cx="12" cy="4" r="3" fill="#E3F5FF" opacity="0.7" />
      <circle cx="9" cy="-1" r="2.5" fill="#F0F0F0" opacity="0.5" />
      {/* Wheels */}
      <circle cx="12" cy="34" r="4" fill="#F0F4FA" stroke="#A0A0B0" strokeWidth="1.2" />
      <circle cx="24" cy="34" r="4" fill="#F0F4FA" stroke="#A0A0B0" strokeWidth="1.2" />
      {/* Carriage */}
      <rect x="34" y="14" width="16" height="18" rx="4" fill="#E3F5FF" stroke="#87CDEF" strokeWidth="1.5" />
      <circle cx="40" cy="34" r="4" fill="#F0F4FA" stroke="#A0A0B0" strokeWidth="1.2" />
      {/* Connector */}
      <line x1="30" y1="24" x2="34" y2="24" stroke="#A0A0B0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Hand-drawn bridge / twilight icon
function BridgeIcon() {
  return (
    <svg viewBox="0 0 48 40" width="44" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Moon */}
      <circle cx="36" cy="10" r="7" fill="#FFF5D6" opacity="0.7" />
      <circle cx="39" cy="8" r="6" fill="#F0F4FA" />
      {/* Bridge arch */}
      <path d="M6 30 Q6 14, 24 14 Q42 14, 42 30" fill="none" stroke="#87CDEF" strokeWidth="2" strokeLinecap="round" />
      {/* Bridge railing posts */}
      <line x1="10" y1="30" x2="10" y2="22" stroke="#87CDEF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="30" x2="16" y2="18" stroke="#87CDEF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="30" x2="24" y2="16" stroke="#87CDEF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="30" x2="32" y2="18" stroke="#87CDEF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="30" x2="38" y2="22" stroke="#87CDEF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Stars */}
      <circle cx="8" cy="8" r="1.5" fill="#FFF5D6" />
      <circle cx="16" cy="4" r="1" fill="#FFF5D6" opacity="0.6" />
      <circle cx="28" cy="3" r="1.5" fill="#FFF5D6" opacity="0.4" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "memory-post-office": <EnvelopeIcon />,
  "time-train": <TrainIcon />,
  "twilight-bridge": <BridgeIcon />,
};

// Three distinct cloud border-radius shapes
const CLOUD_SHAPES: Record<string, string> = {
  "memory-post-office":
    "55% 45% 50% 48% / 52% 48% 55% 45%",
  "time-train":
    "48% 52% 45% 50% / 55% 45% 50% 52%",
  "twilight-bridge":
    "50% 48% 52% 45% / 48% 55% 45% 50%",
};

// Three async float animation classes
const FLOAT_CLASSES = [
  "animate-cloud-float-1",
  "animate-cloud-float-2",
  "animate-cloud-float-3",
];

function CloudRegionCard({
  region,
  index,
}: {
  region: { id: string; name: string; koreanName: string; linkTo?: string };
  index: number;
}) {
  const router = useRouter();

  return (
    <motion.div
      className="cloud-card cursor-pointer select-none"
      style={{ borderRadius: CLOUD_SHAPES[region.id] }}
      onClick={() => region.linkTo && router.push(region.linkTo)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.12, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Float wrapper */}
      <div className={FLOAT_CLASSES[index]}>
        {/* Icon */}
        <div className="flex justify-center mb-3">
          {ICON_MAP[region.id]}
        </div>
        {/* English name */}
        <p
          className="text-base md:text-lg font-semibold text-center leading-snug"
          style={{
            fontFamily: "var(--font-zcool-kuaile), var(--font-gaegu), cursive",
            color: "#7EBEFB",
          }}
        >
          {region.name}
        </p>
        {/* Korean name */}
        <p
          className="text-xs md:text-sm mt-1 text-center"
          style={{
            fontFamily: "var(--font-gaegu), cursive",
            color: "#8ea8c0",
          }}
        >
          {region.koreanName}
        </p>
      </div>
    </motion.div>
  );
}

export function CloudRegionCards() {
  const cloudRegions = getMapRegions().filter((r) => r.linkTo);

  return (
    <>
      {/* Hidden SVG for hand-drawn border filter */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="cloud-hand-drawn" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Cloud cards row */}
      <div className="flex flex-row items-center justify-center gap-10 md:gap-12 px-6">
        {cloudRegions.map((region, i) => (
          <CloudRegionCard key={region.id} region={region} index={i} />
        ))}
      </div>
    </>
  );
}
