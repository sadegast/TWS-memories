"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FallingSakura } from "@/components/shared/FallingSakura";
import { BackToMapButton } from "@/components/shared/BackToMapButton";
import { STORAGE_KEYS } from "@/lib/constants";
import type { LetterData } from "@/lib/types/pageTypes";

function loadLetters(): LetterData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.letters);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLetters(letters: LetterData[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.letters, JSON.stringify(letters));
  } catch {
    // localStorage quota exceeded — silently fail
  }
}

// Floating envelope decoration — deterministic drifting paths
const ENVELOPE_DRIFTS = [
  { left: "8%", top: "12%", duration: 14, delay: 0 },
  { left: "78%", top: "8%", duration: 18, delay: 3 },
  { left: "15%", top: "70%", duration: 16, delay: 6 },
  { left: "85%", top: "65%", duration: 20, delay: 2 },
  { left: "50%", top: "82%", duration: 15, delay: 8 },
];

function EnvelopeSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 30" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="36" height="22" rx="3" fill="#F0F4FA" stroke="#87CDEF" strokeWidth="1.5" />
      <path d="M2 4 L20 18 L38 4" stroke="#87CDEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="15" r="4" fill="#FADADD" opacity="0.7" />
    </svg>
  );
}

export function PostOfficePage() {
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLetters(loadLetters());
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;

      const newLetter: LetterData = {
        id: crypto.randomUUID(),
        recipient: recipient.trim() || "To the wind",
        message: message.trim(),
        signature: signature.trim() || "Anonymous",
        createdAt: new Date().toISOString(),
      };

      const updated = [newLetter, ...letters];
      setLetters(updated);
      saveLetters(updated);
      setRecipient("");
      setMessage("");
      setSignature("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    },
    [letters, recipient, message, signature]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = letters.filter((l) => l.id !== id);
      setLetters(updated);
      saveLetters(updated);
    },
    [letters]
  );

  return (
    <div className="h-full w-full relative overflow-y-auto bg-bg-primary">
      {/* Ambient sakura */}
      <FallingSakura count={25} containerClassName="z-[5]" />

      {/* Back button */}
      <BackToMapButton />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        {/* Page title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: "var(--font-zcool-kuaile), var(--font-gaegu), cursive", color: "#7EBEFB" }}
          >
            Memory Post Office
          </h1>
          <p className="handwriting text-lg" style={{ color: "#0D3A6D" }}>
            추억 우체국 · Send a letter across time
          </p>
        </motion.div>

        {/* Letter writing card */}
        <motion.div
          className="glass-soft rounded-3xl p-8 mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          {/* Floating envelope decorations */}
          {ENVELOPE_DRIFTS.map((env, i) => (
            <div
              key={i}
              className="absolute animate-gentle-float"
              style={{
                left: env.left,
                top: env.top,
                animationDuration: `${env.duration}s`,
                animationDelay: `${env.delay}s`,
                opacity: 0.3,
              }}
            >
              <EnvelopeSVG className="w-12 h-9" />
            </div>
          ))}

          {/* Seal decoration */}
          <div className="absolute top-6 right-6 opacity-15 pointer-events-none">
            <svg viewBox="0 0 60 60" width="60" height="60">
              <circle cx="30" cy="30" r="28" fill="none" stroke="#87CDEF" strokeWidth="2" />
              <circle cx="30" cy="30" r="22" fill="none" stroke="#87CDEF" strokeWidth="1" strokeDasharray="4 3" />
              <text x="30" y="26" textAnchor="middle" fontSize="10" fill="#87CDEF" fontFamily="serif">POST</text>
              <text x="30" y="40" textAnchor="middle" fontSize="8" fill="#87CDEF" fontFamily="serif">OFFICE</text>
            </svg>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-[1]">
            <div>
              <label className="block handwriting text-sm mb-1.5" style={{ color: "#0D3A6D" }}>
                To
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Who is this letter for?"
                className="w-full bg-white/50 border border-[#D4E5F7] rounded-xl px-4 py-2.5 text-[#3A3A4A] placeholder:text-[#A0A0B0] focus:outline-none focus:border-[#87CDEF] focus:ring-2 focus:ring-[#87CDEF]/20 transition-all handwriting"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block handwriting text-sm mb-1.5" style={{ color: "#0D3A6D" }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your letter here..."
                rows={5}
                className="w-full bg-white/50 border border-[#D4E5F7] rounded-xl px-4 py-2.5 text-[#3A3A4A] placeholder:text-[#A0A0B0] focus:outline-none focus:border-[#87CDEF] focus:ring-2 focus:ring-[#87CDEF]/20 transition-all handwriting resize-none"
                maxLength={500}
                required
              />
              <p className="text-right text-xs mt-1" style={{ color: "#A0A0B0" }}>{message.length}/500</p>
            </div>
            <div>
              <label className="block handwriting text-sm mb-1.5" style={{ color: "#0D3A6D" }}>
                From
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Sign your name..."
                className="w-full bg-white/50 border border-[#D4E5F7] rounded-xl px-4 py-2.5 text-[#3A3A4A] placeholder:text-[#A0A0B0] focus:outline-none focus:border-[#87CDEF] focus:ring-2 focus:ring-[#87CDEF]/20 transition-all handwriting"
                maxLength={30}
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white tracking-wide handwriting text-lg"
              style={{ background: "linear-gradient(135deg, #7EBEFB, #05509F)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!message.trim()}
            >
              {submitted ? "Sent! " : "Send "} &#9993;
            </motion.button>
          </form>
        </motion.div>

        {/* Letters display */}
        <div>
          <h2
            className="text-2xl font-semibold mb-6 text-center handwriting"
            style={{ color: "#0D3A6D" }}
          >
            Sent Letters
          </h2>

          {letters.length === 0 ? (
            <motion.div
              className="text-center py-16 glass-soft rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-4">
                <EnvelopeSVG className="w-16 h-12 mx-auto opacity-40" />
              </div>
              <p className="handwriting text-lg" style={{ color: "#8ea8c0" }}>
                No letters yet. Write your first letter above!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {letters.map((letter, index) => (
                  <motion.div
                    key={letter.id}
                    className="glass-soft rounded-2xl p-5 relative group"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Envelope fold decoration */}
                    <div className="absolute top-0 left-6 right-6 h-3 bg-[#F0F4FA] rounded-b-md border-b border-x border-[#D4E5F7] opacity-60" />

                    <div className="flex items-start justify-between gap-4 mt-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold handwriting" style={{ color: "#7EBEFB" }}>
                            To: {letter.recipient}
                          </span>
                        </div>
                        <p className="text-[#3A3A4A] handwriting line-clamp-3 whitespace-pre-wrap">
                          {letter.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs handwriting" style={{ color: "#A0A0B0" }}>
                            — {letter.signature}
                          </span>
                          <span className="text-xs" style={{ color: "#A0A0B0" }}>
                            {new Date(letter.createdAt).toLocaleDateString("zh-CN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(letter.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#A0A0B0] hover:text-red-400 shrink-0 text-xs handwriting"
                      >
                        &#10005;
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
