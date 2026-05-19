"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <motion.div
        className="text-center px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🌸
        </motion.div>
        <h1 className="handwriting-title text-4xl mb-3">
          Page not found
        </h1>
        <p className="text-text-muted mb-8 text-base">
          This memory hasn&apos;t been written yet.
        </p>
        <Link
          href="/home"
          className="inline-block px-6 py-3 rounded-full bg-mist-blue/30 text-text-secondary handwriting text-base hover:bg-mist-blue/50 transition-colors"
        >
          Return to Map
        </Link>
      </motion.div>
    </div>
  );
}
