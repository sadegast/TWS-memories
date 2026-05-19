"use client";

import { useRef, useCallback } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { SvgMap } from "./SvgMap";
import { MapHUD } from "./MapHUD";
import { MAP_VIEWBOX } from "@/lib/constants";

export function MapContainer() {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  const handleZoomIn = useCallback(() => {
    transformRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    transformRef.current?.zoomOut();
  }, []);

  const handleReset = useCallback(() => {
    transformRef.current?.resetTransform();
  }, []);

  return (
    <div className="relative w-full h-full">
      <TransformWrapper
        ref={transformRef}
        initialScale={0.9}
        minScale={1}
        maxScale={1.3}
        centerOnInit
        wheel={{ step: 0.05 }}
        panning={{ velocityDisabled: true }}
        limitToBounds={true}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          <SvgMap />
        </TransformComponent>
      </TransformWrapper>

      <MapHUD onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} />

      {/* Map title overlay */}
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <h1
          className="glitch-text text-5xl md:text-6xl opacity-85"
          style={{ color: "#B0D2EC" }}
          data-text="Memory Map"
        >
          Memory Map
        </h1>
        <p className="text-lg md:text-xl text-text-muted mt-1">drag & scroll to explore</p>
      </div>
    </div>
  );
}
