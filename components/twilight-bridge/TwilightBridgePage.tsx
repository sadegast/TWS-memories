"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FallingSakura } from "@/components/shared/FallingSakura";
import { BackToMapButton } from "@/components/shared/BackToMapButton";
import { twsSongs } from "@/lib/data/twsSongs";
import type { SongData } from "@/lib/types/pageTypes";

// Deterministic cloud shape per song
function generateCloudPath(songId: string): string {
  const seed = songId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rx = 80 + (seed % 40);
  const ry = 50 + ((seed * 3) % 30);
  const cx = 0;
  const cy = 0;

  const cp = 0.5 + ((seed * 7) % 20) / 100; // 0.50–0.70

  const top = -ry;
  const bottom = ry;
  const left = -rx;
  const right = rx;

  return [
    `M ${left},${cy}`,
    `C ${left},${top * 0.7} ${-rx * cp},${top} ${cx},${top}`,
    `C ${rx * cp},${top} ${right},${top * 0.7} ${right},${cy}`,
    `C ${right},${bottom * 0.7} ${rx * cp},${bottom} ${cx},${bottom}`,
    `C ${-rx * cp},${bottom} ${left},${bottom * 0.7} ${left},${cy}`,
    "Z",
  ].join(" ");
}

// Deterministic float animation params
function getCloudAnimation(songId: string): {
  floatDuration: number;
  floatDelay: number;
  driftX: number;
  driftY: number;
} {
  const seed = songId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    floatDuration: 6 + (seed % 8),
    floatDelay: (seed * 1.3) % 5,
    driftX: -15 + ((seed * 7) % 30),
    driftY: -8 + ((seed * 13) % 16),
  };
}

export function TwilightBridgePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedSong = expandedId ? twsSongs.find((s) => s.id === expandedId) : null;

  const clouds = useMemo(
    () =>
      twsSongs.map((song) => ({
        song,
        path: generateCloudPath(song.id),
        anim: getCloudAnimation(song.id),
      })),
    []
  );

  return (
    <div className="h-full w-full relative overflow-y-auto bg-bg-primary">
      <FallingSakura count={25} containerClassName="z-[5]" />
      <BackToMapButton />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: "var(--font-zcool-kuaile), var(--font-gaegu), cursive", color: "#7EBEFB" }}
          >
            Twilight Bridge
          </h1>
          <p className="handwriting text-lg" style={{ color: "#0D3A6D" }}>
            황혼의 다리 · A world of songs in the clouds
          </p>
        </motion.div>

        {/* Song cloud grid */}
        <div className="relative min-h-[500px] flex flex-wrap items-center justify-center gap-6 md:gap-10 py-8">
          {clouds.map(({ song, path, anim }, idx) => (
            <motion.div
              key={song.id}
              className="relative cursor-pointer select-none"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpandedId(expandedId === song.id ? null : song.id)}
            >
              {/* Float wrapper */}
              <div
                className="animate-gentle-float"
                style={{
                  animationDuration: `${anim.floatDuration}s`,
                  animationDelay: `${anim.floatDelay}s`,
                }}
              >
                <svg
                  viewBox="-100 -70 200 140"
                  width="180"
                  height="130"
                  className="overflow-visible"
                >
                  {/* Cloud shadow */}
                  <path
                    d={path}
                    fill="#87CDEF"
                    opacity="0.12"
                    transform="translate(4, 6)"
                  />
                  {/* Cloud body */}
                  <path
                    d={path}
                    fill="#F0F4FA"
                    stroke="#87CDEF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#soft-shadow)"
                  />
                  {/* Cloud highlight */}
                  <path
                    d={path}
                    fill="url(#cloud-gradient)"
                    opacity="0.3"
                  />
                  {/* Song title */}
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="13"
                    fontWeight="600"
                    fill="#0D3A6D"
                    fontFamily="var(--font-zcool-kuaile), var(--font-gaegu), cursive"
                    style={{ pointerEvents: "none" }}
                  >
                    {song.title}
                  </text>
                  {song.koreanTitle && (
                    <text
                      x="0"
                      y="14"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="9"
                      fill="#8ea8c0"
                      fontFamily="var(--font-gaegu), cursive"
                      style={{ pointerEvents: "none" }}
                    >
                      {song.koreanTitle}
                    </text>
                  )}
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded song detail */}
        <AnimatePresence>
          {expandedSong && (
            <motion.div
              className="fixed inset-0 z-30 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpandedId(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

              {/* Card */}
              <motion.div
                className="relative glass-soft rounded-3xl p-8 max-w-md w-full shadow-glow-strong"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition-colors"
                  style={{ color: "#A0A0B0" }}
                >
                  &#10005;
                </button>

                <div className="text-center">
                  {/* Decorative cloud */}
                  <svg viewBox="-60 -40 120 80" width="120" height="80" className="mx-auto mb-4">
                    <path
                      d={generateCloudPath(expandedSong.id)}
                      fill="#F0F4FA"
                      stroke="#87CDEF"
                      strokeWidth="1.5"
                    />
                  </svg>

                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-zcool-kuaile), var(--font-gaegu), cursive", color: "#7EBEFB" }}
                  >
                    {expandedSong.title}
                  </h2>
                  {expandedSong.koreanTitle && (
                    <p className="text-base mb-3 handwriting" style={{ color: "#0D3A6D" }}>
                      {expandedSong.koreanTitle}
                    </p>
                  )}

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs handwriting px-2.5 py-1 rounded-full bg-[#F0F4FA]" style={{ color: "#7EBEFB" }}>
                        {expandedSong.album}
                      </span>
                      <span className="text-xs handwriting px-2.5 py-1 rounded-full bg-[#FFF5D6]/60" style={{ color: "#4C3220" }}>
                        {expandedSong.releaseDate}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white/50 rounded-2xl">
                    <p
                      className="text-lg handwriting italic leading-relaxed"
                      style={{ color: "#3A3A4A" }}
                    >
                      &ldquo;{expandedSong.keyLyrics}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SVG defs for cloud gradients */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#87CDEF" stopOpacity="0.2" />
            </linearGradient>
            <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#87CDEF" floodOpacity="0.15" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
