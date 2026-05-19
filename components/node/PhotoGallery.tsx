"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { PhotoEntry } from "@/lib/types/node";
import { asset } from "@/lib/assetPath";

interface Props {
  photos: PhotoEntry[];
  accentColor: string;
  onPhotosChange: (photos: PhotoEntry[]) => void;
}

export function PhotoGallery({ photos, accentColor, onPhotosChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo, i) => {
        const isEmpty = !photo.src || photo.src.length <= 10;
        return (
          <PhotoCard
            key={i}
            photo={photo}
            index={i}
            accentColor={accentColor}
            isEmpty={isEmpty}
            onUpdate={(updated) => {
              const next = [...photos];
              next[i] = updated;
              onPhotosChange(next);
            }}
            onDelete={() => {
              // Don't delete the last empty placeholder
              const filled = photos.filter((p) => p.src && p.src.length > 10);
              if (isEmpty && filled.length === photos.filter((p) => p.src && p.src.length > 10).length) {
                // It's the placeholder, don't delete
                return;
              }
              const rest = photos.filter((_, j) => j !== i);
              onPhotosChange(rest);
            }}
          />
        );
      })}
    </div>
  );
}

function PhotoCard({
  photo,
  index,
  accentColor,
  isEmpty,
  onUpdate,
  onDelete,
}: {
  photo: PhotoEntry;
  index: number;
  accentColor: string;
  isEmpty: boolean;
  onUpdate: (p: PhotoEntry) => void;
  onDelete: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const rotation = photo.rotation ?? (index % 3 === 0 ? -2 : index % 3 === 1 ? 1.5 : -0.5);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ ...photo, src: reader.result as string, alt: file.name });
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <motion.div
        className="relative bg-white p-3 pb-10 shadow-soft rounded-sm"
        whileHover={{
          scale: 1.03,
          rotate: 0,
          boxShadow: "0 8px 24px rgba(168, 200, 232, 0.25)",
          zIndex: 10,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Photo area */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer group/photo"
          style={{
            backgroundColor: isEmpty ? accentColor + "15" : accentColor + "30",
            border: isEmpty ? `2px dashed ${accentColor}40` : "none",
          }}
          onClick={() => fileRef.current?.click()}
          title={isEmpty ? "点击上传图片" : "点击更换图片"}
        >
          {isEmpty ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#4A4A5A]/40">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span className="text-xs mt-1 handwriting">添加照片</span>
            </div>
          ) : (
            <>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${asset(photo.src)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Hover overlay: upload icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                <div className="bg-black/30 rounded-full p-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
              </div>
            </>
          )}

          <div className="film-grain absolute inset-0 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accentColor}20 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Caption */}
        <div
          className="absolute bottom-1 left-0 right-0 text-center text-xs text-[#4A4A5A] handwriting px-2 outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const text = e.currentTarget.textContent || "";
            if (text !== (photo.caption || "")) onUpdate({ ...photo, caption: text });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {photo.caption || ""}
        </div>

        {/* Delete button — not on empty placeholder */}
        {!isEmpty && (
          <button
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md text-[#4A4A5A]/50 hover:text-red-400 hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="删除图片"
          >
            ×
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
