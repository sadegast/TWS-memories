"use client";

import { motion } from "framer-motion";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapHUD({ onZoomIn, onZoomOut, onReset }: Props) {
  return (
    <motion.div
      className="absolute bottom-6 right-6 flex flex-col gap-2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <MapHUDButton onClick={onZoomIn} label="Zoom in">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </MapHUDButton>

      <MapHUDButton onClick={onZoomOut} label="Zoom out">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </MapHUDButton>

      <MapHUDButton onClick={onReset} label="Reset view">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="1" y="1" width="22" height="22" rx="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </MapHUDButton>
    </motion.div>
  );
}

function MapHUDButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm border border-mist-blue/30 text-text-secondary shadow-soft hover:shadow-medium transition-shadow"
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}
