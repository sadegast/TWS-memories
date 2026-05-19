"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FallingSakura } from "@/components/shared/FallingSakura";
import { BackToMapButton } from "@/components/shared/BackToMapButton";
import { generateTimelineStations } from "@/lib/data/timelineStations";
import { STORAGE_KEYS } from "@/lib/constants";
import type { TimelineStation, StationPhoto } from "@/lib/types/pageTypes";

function loadPhotos(): TimelineStation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.photos);
    if (!raw) return generateTimelineStations();
    const saved = JSON.parse(raw) as TimelineStation[];
    // Merge with generated stations to ensure new months exist
    const generated = generateTimelineStations();
    for (const gen of generated) {
      const existing = saved.find((s) => s.month === gen.month);
      if (existing) {
        gen.photos = existing.photos;
      }
    }
    return generated;
  } catch {
    return generateTimelineStations();
  }
}

function savePhotos(stations: TimelineStation[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.photos, JSON.stringify(stations));
  } catch {
    // localStorage quota exceeded
  }
}

function TrainSVG() {
  return (
    <div className="absolute top-4 left-0 animate-train-move pointer-events-none z-10" style={{ animationDuration: "22s" }}>
      <svg viewBox="0 0 180 50" width="180" height="50" xmlns="http://www.w3.org/2000/svg">
        {/* Engine */}
        <rect x="2" y="18" width="40" height="22" rx="4" fill="#87CDEF" />
        <polygon points="42,18 54,30 42,40" fill="#ACDEF5" />
        <rect x="10" y="10" width="16" height="10" rx="3" fill="#05509F" opacity="0.7" />
        <circle cx="14" cy="42" r="5" fill="#C8CCD4" stroke="#A0A0B0" strokeWidth="1" />
        <circle cx="34" cy="42" r="5" fill="#C8CCD4" stroke="#A0A0B0" strokeWidth="1" />
        {/* Smoke puff */}
        <circle cx="6" cy="6" r="5" fill="#E3F5FF" opacity="0.6">
          <animate attributeName="cy" values="6;-10" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="5;12" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Carriage 1 */}
        <rect x="60" y="16" width="36" height="24" rx="4" fill="#CCEDFC" />
        <circle cx="70" cy="42" r="5" fill="#C8CCD4" stroke="#A0A0B0" strokeWidth="1" />
        <circle cx="86" cy="42" r="5" fill="#C8CCD4" stroke="#A0A0B0" strokeWidth="1" />
        {/* Connector */}
        <rect x="56" y="26" width="6" height="4" rx="1" fill="#A0A0B0" />
        {/* Carriage 2 */}
        <rect x="102" y="16" width="36" height="24" rx="4" fill="#E3F5FF" />
        <circle cx="112" cy="42" r="5" fill="#C8CCD4" stroke="#A0A0B0" strokeWidth="1" />
        <circle cx="128" cy="42" r="5" fill="#C8CCD4" stroke="#A0A0B0" strokeWidth="1" />
        <rect x="98" y="26" width="6" height="4" rx="1" fill="#A0A0B0" />
      </svg>
    </div>
  );
}

export function TimeTrainPage() {
  const [stations, setStations] = useState<TimelineStation[]>([]);
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStations(loadPhotos());
  }, []);

  const handlePhotoUpload = useCallback(
    (month: string) => {
      setActiveStation(month);
      fileInputRef.current?.click();
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !activeStation) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newPhoto: StationPhoto = {
          id: crypto.randomUUID(),
          dataUrl,
          caption: file.name.replace(/\.[^/.]+$/, ""),
          createdAt: new Date().toISOString(),
        };

        const updated = stations.map((s) =>
          s.month === activeStation
            ? { ...s, photos: [...s.photos, newPhoto] }
            : s
        );
        setStations(updated);
        savePhotos(updated);
        setActiveStation(null);
      };
      reader.readAsDataURL(file);
      // Reset input
      e.target.value = "";
    },
    [activeStation, stations]
  );

  const handleDeletePhoto = useCallback(
    (month: string, photoId: string) => {
      const updated = stations.map((s) =>
        s.month === month
          ? { ...s, photos: s.photos.filter((p) => p.id !== photoId) }
          : s
      );
      setStations(updated);
      savePhotos(updated);
    },
    [stations]
  );

  // Scroll to current month on mount
  useEffect(() => {
    if (scrollRef.current && stations.length > 0) {
      const currentMonth = `${new Date().getFullYear()}.${new Date().getMonth() + 1}`;
      const idx = stations.findIndex((s) => s.month === currentMonth);
      if (idx >= 0) {
        const child = scrollRef.current.children[idx] as HTMLElement | undefined;
        child?.scrollIntoView({ inline: "center", behavior: "smooth" });
      }
    }
  }, [stations]);

  return (
    <div className="h-full w-full relative overflow-hidden bg-bg-primary flex flex-col">
      <FallingSakura count={20} containerClassName="z-[5]" />
      <BackToMapButton />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Title */}
      <motion.div
        className="text-center pt-16 pb-4 shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-2"
          style={{ fontFamily: "var(--font-zcool-kuaile), var(--font-gaegu), cursive", color: "#7EBEFB" }}
        >
          Time Train
        </h1>
        <p className="handwriting text-lg" style={{ color: "#0D3A6D" }}>
          시간 열차 · Travel through memories
        </p>
      </motion.div>

      {/* Train track area */}
      <div className="relative mx-8 mb-6 shrink-0 h-20 overflow-hidden">
        {/* Track line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-[#87CDEF]/30">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(to right, #87CDEF 0, #87CDEF 4px, transparent 4px, transparent 16px)" }} />
        </div>
        {/* Train */}
        <TrainSVG />
      </div>

      {/* Horizontal timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 flex gap-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#87CDEF transparent" }}
      >
        {stations.map((station, idx) => (
          <motion.div
            key={station.month}
            className="snap-center shrink-0 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.015, duration: 0.4 }}
          >
            {/* Station dot + connector */}
            <div className="relative mb-3">
              <div className="w-4 h-4 rounded-full bg-[#87CDEF] shadow-glow" />
            </div>

            {/* Month label */}
            <span className="handwriting text-xs mb-3 whitespace-nowrap" style={{ color: "#4C3220" }}>
              {station.label}
            </span>

            {/* Photos area */}
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              {station.photos.length === 0 ? (
                <button
                  onClick={() => handlePhotoUpload(station.month)}
                  className="w-24 h-32 border-2 border-dashed border-[#D4E5F7] rounded-lg flex items-center justify-center hover:border-[#87CDEF] hover:bg-[#87CDEF]/5 transition-all"
                >
                  <span className="text-2xl" style={{ color: "#D4E5F7" }}>+</span>
                </button>
              ) : (
                <>
                  {station.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      {/* Polaroid frame */}
                      <div
                        className="bg-white p-2 pb-7 shadow-soft rounded-sm rotate-[-2deg] hover:rotate-0 transition-transform"
                        style={{ width: "100px" }}
                      >
                        <div className="w-full aspect-square overflow-hidden bg-[#F0F4FA]">
                          <img
                            src={photo.dataUrl}
                            alt={photo.caption || "Memory"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p
                          className="text-[10px] text-center mt-1.5 handwriting truncate px-0.5"
                          style={{ color: "#4C3220" }}
                        >
                          {photo.caption || ""}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePhoto(station.month, photo.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/80 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-soft hover:text-red-400"
                        style={{ color: "#A0A0B0" }}
                      >
                        &#10005;
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handlePhotoUpload(station.month)}
                    className="w-24 h-10 border-2 border-dashed border-[#D4E5F7] rounded-lg flex items-center justify-center hover:border-[#87CDEF] hover:bg-[#87CDEF]/5 transition-all text-sm handwriting"
                    style={{ color: "#A0A0B0" }}
                  >
                    + Add
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
