"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Member } from "@/lib/types/member";
import { asset } from "@/lib/assetPath";
import { KoreanText } from "@/components/shared/KoreanText";

interface Props {
  member: Member;
}

export function MemberPage({ member }: Props) {
  const router = useRouter();

  return (
    <div
      className="min-h-full flex items-center justify-center p-8"
      style={{ backgroundColor: member.color + "15" }}
    >
      <div className="max-w-md w-full">
        <motion.button
          className="mb-8 flex items-center gap-2 text-text-secondary hover:text-sakura-blue transition-colors group"
          onClick={() => router.push("/home")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="handwriting text-sm">Back to Map</span>
        </motion.button>

        <motion.div
          className="relative p-12 rounded-3xl shadow-soft text-center overflow-hidden"
          style={{ backgroundColor: member.color + "40" }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${member.color} 0%, transparent 70%)`,
            }}
          />

          <motion.div
            className="relative mb-6 flex justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={asset(`/images/${member.id}_main.png`)}
              alt={member.name}
              className="w-28 h-28 rounded-full object-cover"
            />
          </motion.div>

          <KoreanText
            as="h1"
            className="handwriting-title text-5xl mb-2"
            style={member.koreanNameColor ? { color: member.koreanNameColor } : undefined}
          >
            {member.koreanName}
          </KoreanText>

          <p
            className="text-2xl tracking-widest mb-8"
            style={{ fontWeight: 500, color: member.nameColor || undefined }}
          >
            {member.name}
          </p>

          <div className="relative py-4 px-6 rounded-2xl border border-dashed border-mist-blue/40 bg-white/40">
            {member.customMessage ? (
              <p className="handwriting text-text-muted text-sm leading-relaxed">
                {member.customMessage}
              </p>
            ) : (
              <>
                <p className="handwriting text-text-muted text-sm">
                  Member gallery coming in Phase 2
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Photos, timeline & growth records
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
