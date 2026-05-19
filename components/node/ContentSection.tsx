"use client";

import { motion } from "framer-motion";
import type { MemoryEntry } from "@/lib/types/node";

interface Props {
  memories: MemoryEntry[];
  accentColor: string;
  onMemoriesChange: (memories: MemoryEntry[]) => void;
}

const ICON_OPTIONS = [
  { key: "star", emoji: "⭐" },
  { key: "heart", emoji: "💙" },
  { key: "sparkles", emoji: "✨" },
  { key: "music", emoji: "🎵" },
  { key: "bell", emoji: "🔔" },
  { key: "ocean", emoji: "🌊" },
  { key: "smile", emoji: "😊" },
  { key: "graduation", emoji: "🎓" },
  { key: "rocket", emoji: "🚀" },
  { key: "globe", emoji: "🌏" },
  { key: "sakura", emoji: "🌸" },
  { key: "lightning", emoji: "⚡" },
  { key: "fire", emoji: "🔥" },
  { key: "snowflake", emoji: "❄️" },
  { key: "infinity", emoji: "♾️" },
];

function iconEmoji(key: string): string {
  return ICON_OPTIONS.find((o) => o.key === key)?.emoji || "💙";
}

export function ContentSection({ memories, accentColor, onMemoriesChange }: Props) {
  const updateOne = (i: number, memory: MemoryEntry) => {
    const next = [...memories];
    next[i] = memory;
    onMemoriesChange(next);
  };

  const deleteOne = (i: number) => {
    onMemoriesChange(memories.filter((_, j) => j !== i));
  };

  const cycleIcon = (i: number) => {
    const current = memories[i];
    const curIdx = ICON_OPTIONS.findIndex((o) => o.key === current.icon);
    const nextKey = ICON_OPTIONS[(curIdx + 1) % ICON_OPTIONS.length].key;
    updateOne(i, { ...current, icon: nextKey });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {memories.map((memory, i) => {
        const isEmpty = !memory.text || memory.text.trim() === "" || memory.text === "新的回忆";
        return (
          <motion.div
            key={i}
            className="relative p-5 rounded-2xl border border-mist-blue/20 bg-white/60 backdrop-blur-sm shadow-soft group/mem"
            style={{
              borderStyle: isEmpty ? "dashed" : "solid",
            }}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              y: -3,
              boxShadow: "0 6px 20px rgba(168, 200, 232, 0.2)",
            }}
          >
            {/* Icon — click to cycle */}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-lg cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: accentColor + "30" }}
              onClick={() => cycleIcon(i)}
              title="点击切换图标"
            >
              {iconEmoji(memory.icon)}
            </button>

            {/* Text — editable */}
            <div
              className="text-text-primary text-base leading-relaxed mb-2 outline-none min-h-[1.5em]"
              style={{ fontWeight: 500 }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const text = e.currentTarget.textContent || "";
                if (text !== memory.text) updateOne(i, { ...memory, text });
              }}
            >
              {memory.text}
            </div>

            {/* Date — editable */}
            <div
              className="text-sm text-[#4A4A5A] handwriting outline-none inline-block min-w-[4em]"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const text = e.currentTarget.textContent || "";
                if (text !== (memory.date || ""))
                  updateOne(i, { ...memory, date: text || undefined });
              }}
            >
              {memory.date || ""}
            </div>

            {/* Empty placeholder hint */}
            {isEmpty && (
              <span className="absolute top-5 right-5 text-xs text-[#4A4A5A]/30 handwriting pointer-events-none">
                新回忆
              </span>
            )}

            {/* Delete — not on the last empty one */}
            {!isEmpty && (
              <button
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/80 text-[#4A4A5A]/40 hover:text-red-400 transition-all opacity-0 group-hover/mem:opacity-100 flex items-center justify-center text-xs"
                onClick={() => deleteOne(i)}
                title="删除此回忆"
              >
                ×
              </button>
            )}

            {/* Hover highlight */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover/mem:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${accentColor}10 0%, transparent 60%)`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
