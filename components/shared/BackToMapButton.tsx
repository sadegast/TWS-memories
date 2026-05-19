"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function BackToMapButton() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push("/home")}
      className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full glass-soft handwriting text-text-primary hover:shadow-glow transition-shadow duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Left arrow + sakura petal */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4 L8 12 L16 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Small sakura petal accent */}
        <circle cx="20" cy="6" r="3" fill="#87CDEF" opacity="0.6" />
        <path d="M20,3 C18.5,2 17.5,2 20,6 C22.5,2 21.5,2 20,3Z" fill="#ACDEF5" opacity="0.8" />
      </svg>
      <span className="text-sm">Back to Map</span>
    </motion.button>
  );
}
