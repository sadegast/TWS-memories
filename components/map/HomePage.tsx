"use client";

import dynamic from "next/dynamic";
import { FallingSakura } from "@/components/shared/FallingSakura";
import { CloudRegionCards } from "./CloudRegionCards";

const MapContainer = dynamic(
  () => import("./MapContainer").then((m) => ({ default: m.MapContainer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <p className="handwriting-title text-xl animate-gentle-float">
          Loading memories...
        </p>
      </div>
    ),
  }
);

export function HomePage() {
  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Map content (background image now in layout for instant display) */}
      <div className="relative z-[1] h-full w-full">
        <MapContainer />
      </div>

      {/* Cloud region cards — above map, at bottom, horizontal row */}
      <div className="absolute bottom-[9%] left-0 right-0 z-[5]">
        <CloudRegionCards />
      </div>

      {/* CSS Falling Sakura layer (above map, pointer-events: none) */}
      <FallingSakura count={40} containerClassName="z-[10]" />
    </div>
  );
}
