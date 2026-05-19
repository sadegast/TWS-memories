"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/assetPath";

const TOTAL_DURATION = 13;

export function LoadingPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const hasFinishedRef = useRef(false);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const pct = Math.min(video.currentTime / TOTAL_DURATION, 1);
      setProgress(pct);
    };

    const handleEnded = () => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;
      setProgress(1);
      router.push("/home");
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    video.play().catch(() => {
      if (video) {
        video.muted = true;
        setMuted(true);
        video.play().catch(() => {});
      }
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [router]);

  const pct = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Video — bottom layer, cover full screen */}
      <video
        ref={videoRef}
        src={asset("/images/loading_video.mp4")}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
      />

      {/* Soft dark vignette behind UI for readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 65%, rgba(0,0,0,0.3) 0%, transparent 55%)",
        }}
      />

      {/* UI overlay — positioned at middle-lower area */}
      <div
        className="absolute inset-x-0 z-20 flex flex-col items-center"
        style={{ top: "67%" }}
      >
        {/* Row: percentage + progress bar */}
        <div className="flex items-center gap-3 md:gap-4 w-[20rem] md:w-[32rem]">
          {/* Percentage — left side, cute rounded font */}
          <span
            className="text-white text-2xl md:text-3xl flex-shrink-0 w-10 md:w-12 text-right"
            style={{ fontFamily: "var(--font-gaegu), cursive" }}
          >
            {pct}%
          </span>

          {/* Progress bar with overlaid glitch text */}
          <div className="flex-1 relative">
            {/* Track */}
            <div
              className="w-full h-14 rounded-full overflow-hidden bg-white/95"
              style={{
                boxShadow:
                  "0 2px 20px rgba(255,255,255,0.3), 0 0 60px rgba(200,225,255,0.15)",
              }}
            >
              {/* Zebra stripe fill */}
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  transition: "width 0.1s linear",
                  background:
                    "repeating-linear-gradient(-45deg, #fff 0px, #fff 6px, rgba(180,210,240,0.45) 6px, rgba(180,210,240,0.45) 12px)",
                }}
              />
            </div>

            {/* Glitch text overlaid on the bar */}
            <span
              className="absolute inset-0 flex items-center justify-center text-sm md:text-base animate-glitch-text select-none pointer-events-none whitespace-nowrap"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                color: "#F59E9E",
              }}
            >
              lucky to be loved
            </span>
          </div>
        </div>

        {/* Volume toggle */}
        <button
          onClick={toggleMute}
          className="mt-5 text-white/55 hover:text-white/90 transition-colors"
          aria-label={muted ? "开启声音" : "关闭声音"}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          )}
        </button>
      </div>

      {/* Glitch text keyframes */}
      <style jsx>{`
        @keyframes glitch-text {
          0%, 100% { opacity: 1; text-shadow: none; transform: none; }
          4% { opacity: 0.75; text-shadow: 2px 0 #ff6b9d, -2px 0 #4ecdc4; }
          8% { opacity: 1; text-shadow: none; }
          14% { opacity: 0.45; text-shadow: -3px 0 #ff6b9d, 3px 0 #4ecdc4; transform: skewX(-3deg); }
          17% { opacity: 1; text-shadow: none; transform: none; }
          42% { opacity: 0.65; text-shadow: 2px 1px #ff6b9d, -2px -1px #4ecdc4; }
          45% { opacity: 1; text-shadow: none; }
          68% { opacity: 0.35; text-shadow: -3px 2px #ff6b9d, 3px -2px #4ecdc4; clip-path: inset(25% 0 30% 0); }
          72% { opacity: 1; text-shadow: none; clip-path: none; }
          88% { opacity: 0.55; text-shadow: 1px -2px #ff6b9d, -1px 2px #4ecdc4; transform: translateX(2px); }
          91% { opacity: 1; text-shadow: none; transform: none; }
        }
        .animate-glitch-text {
          animation: glitch-text 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
