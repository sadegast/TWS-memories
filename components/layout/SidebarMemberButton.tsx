"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Member } from "@/lib/types/member";
import { asset } from "@/lib/assetPath";

interface Props {
  member: Member;
  isExpanded: boolean;
  index: number;
}

export function SidebarMemberButton({ member, isExpanded, index }: Props) {
  const router = useRouter();

  return (
    <motion.button
      className="relative flex items-center gap-3 w-full px-2 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/60 group"
      style={{
        backgroundColor: member.color + "60",
        boxShadow: "0 1px 4px rgba(168, 200, 232, 0.15)",
        transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
      }}
      whileHover={{
        y: -3,
        rotate: 0,
        boxShadow: "0 4px 12px rgba(168, 200, 232, 0.25)",
        transition: { type: "spring", stiffness: 400, damping: 20 },
      }}
      onClick={() => router.push(`/member/${member.id}`)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <img
        src={asset(`/images/${member.id}.jpg`)}
        alt={member.name}
        className="w-6 h-6 rounded-full object-cover flex-shrink-0 select-none"
      />

      {/* Name (shown when expanded) */}
      <motion.span
        className="handwriting text-base text-text-primary whitespace-nowrap overflow-hidden"
        animate={{
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? "auto" : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {member.name}
      </motion.span>

      {/* Hover sparkle */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${member.color}40 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
