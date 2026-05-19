"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarMemberButton } from "./SidebarMemberButton";
import { getAllMembers } from "@/lib/data/members";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const members = getAllMembers();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const collapsedW = isMobile ? 44 : 72;
  const expandedW = isMobile ? 140 : 200;

  return (
    <motion.aside
      className="relative flex flex-col items-center py-4 md:py-8 gap-2 md:gap-4 bg-pearl-white/80 backdrop-blur-sm border-r border-mist-blue/30 shadow-soft z-20"
      animate={{ width: isExpanded ? expandedW : collapsedW }}
      initial={{ width: collapsedW }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Decorative top element */}
      <div className="mb-4">
        <span className="handwriting-title text-2xl md:text-3xl select-none">
          {isExpanded ? "TWS" : "T"}
        </span>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-mist-blue/50 mb-2" />

      {/* Member buttons */}
      <nav className="flex flex-col gap-2 md:gap-3 w-full px-2 md:px-3">
        {members.map((member, index) => (
          <SidebarMemberButton
            key={member.id}
            member={member}
            isExpanded={isExpanded}
            index={index}
          />
        ))}
      </nav>

      {/* Bottom decorative element */}
      <div className="mt-auto">
        <motion.div
          className="text-sm text-text-muted handwriting text-center"
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded && "24/7 with us"}
        </motion.div>
      </div>
    </motion.aside>
  );
}
