"use client";

import { usePathname } from "next/navigation";
import { asset } from "@/lib/assetPath";

export function MapBackground() {
  const pathname = usePathname();

  if (pathname !== "/home") return null;

  return (
    <img
      src={asset("/images/main_map-01.png")}
      alt=""
      className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
      fetchPriority="high"
      loading="eager"
      aria-hidden="true"
    />
  );
}
