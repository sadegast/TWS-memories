"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { NodeDetail } from "@/lib/types/node";
import { useSharedNode } from "@/hooks/useSharedNode";
import { PhotoGallery } from "./PhotoGallery";
import { ContentSection } from "./ContentSection";
import { KoreanText } from "@/components/shared/KoreanText";
import { FadeInView } from "@/components/shared/FadeInView";

interface Props {
  node: NodeDetail;
}

export function NodeDetailPage({ node }: Props) {
  const router = useRouter();
  const {
    data,
    updateField,
    updatePhotos,
    updateMemories,
    save,
    saving,
    lastSaved,
    resetToOriginal,
  } = useSharedNode(node);

  return (
    <div className="min-h-full" style={{ backgroundColor: data.colorAccent + "15" }}>
      {/* Hero section */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: data.colorAccent + "30" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            color: data.colorAccent,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-8 pt-24 pb-16">
          {/* Top bar: back + save status + actions */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
              className="flex items-center gap-2 text-[#4A4A5A] hover:text-sakura-blue transition-colors group"
              onClick={() => router.push("/home")}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="handwriting text-sm group-hover:translate-x-0.5 transition-transform">
                Back to Map
              </span>
            </motion.button>

            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-xs text-[#4A4A5A]/60 handwriting">
                  已保存 {lastSaved}
                </span>
              )}
              <motion.button
                className="text-xs text-[#4A4A5A]/50 hover:text-[#4A4A5A] transition-colors handwriting"
                onClick={resetToOriginal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                title="重置为原始内容"
              >
                reset
              </motion.button>
            </div>
          </div>

          {/* Title section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <KoreanText as="h1" className="handwriting-title text-5xl md:text-7xl mb-3">
              <span
                className="outline-none"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== data.eraTitle) updateField("eraTitle", v);
                }}
              >
                {data.eraTitle}
              </span>
            </KoreanText>
            <p className="text-2xl text-[#4A4A5A] handwriting mb-1">
              <span
                className="outline-none"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== data.eraSubtitle) updateField("eraSubtitle", v);
                }}
              >
                {data.eraSubtitle}
              </span>
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-base text-[#4A4A5A]">
                <span
                  className="outline-none"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const v = e.currentTarget.textContent || "";
                    if (v !== data.date) updateField("date", v);
                  }}
                >
                  {data.date}
                </span>
              </span>
              <div className="w-8 h-px bg-sakura-blue/50" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Description */}
        <FadeInView className="mb-16">
          <div className="prose prose-lg max-w-none">
            <div
              className="text-[#4A4A5A] leading-relaxed text-lg md:text-xl outline-none whitespace-pre-wrap min-h-[3em]"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== data.description) updateField("description", v);
              }}
            >
              {data.description}
            </div>
          </div>
        </FadeInView>

        {/* Photo gallery */}
        <FadeInView className="mb-16" delay={0.2}>
          <h2 className="handwriting-title text-3xl mb-8 flex items-center gap-2">
            <span>photos</span>
            <span className="text-base text-[#4A4A5A]">回忆相片</span>
          </h2>
          <PhotoGallery
            photos={data.photos}
            accentColor={data.colorAccent}
            onPhotosChange={updatePhotos}
          />
        </FadeInView>

        {/* Memories section */}
        <FadeInView delay={0.3}>
          <h2 className="handwriting-title text-3xl mb-8 flex items-center gap-2">
            <span>memories</span>
            <span className="text-base text-[#4A4A5A]">珍贵瞬间</span>
          </h2>
          <ContentSection
            memories={data.memories}
            accentColor={data.colorAccent}
            onMemoriesChange={updateMemories}
          />
        </FadeInView>

        {/* Bottom decorative */}
        <div className="mt-20 pt-8 border-t border-mist-blue/20 text-center">
          <p className="handwriting text-[#4A4A5A] text-base">
            — 我们一起长大的时间 —
          </p>
        </div>
      </div>

      {/* Floating Save button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          className="px-5 py-2.5 rounded-full text-white text-sm font-medium shadow-lg transition-colors"
          style={{
            backgroundColor: data.colorAccent,
            boxShadow: `0 4px 16px ${data.colorAccent}60`,
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 6px 24px ${data.colorAccent}80` }}
          whileTap={{ scale: 0.95 }}
          onClick={save}
          disabled={saving}
        >
          {saving ? "保存中..." : "保存"}
        </motion.button>
      </div>
    </div>
  );
}
