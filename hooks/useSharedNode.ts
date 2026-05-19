"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { NodeDetail, PhotoEntry, MemoryEntry } from "@/lib/types/node";

interface SharedOverlay {
  eraTitle?: string;
  eraSubtitle?: string;
  date?: string;
  description?: string;
  photos?: PhotoEntry[];
  memories?: MemoryEntry[];
  updatedAt?: string;
}

const POLL_INTERVAL = 4000;
const LS_PREFIX = "node-shared-";

function lsKey(id: string) { return LS_PREFIX + id; }
function loadLs(id: string): SharedOverlay | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(lsKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveLs(id: string, data: SharedOverlay) {
  if (typeof window === "undefined") return;
  localStorage.setItem(lsKey(id), JSON.stringify(data));
}

export function useSharedNode(original: NodeDetail) {
  const [data, setData] = useState<NodeDetail>(original);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [remoteUpdatedAt, setRemoteUpdatedAt] = useState<string | null>(null);
  const [useApi, setUseApi] = useState<boolean | null>(null); // null = unknown, true = api, false = localStorage
  const localRef = useRef<NodeDetail>(original);
  const dirtyRef = useRef(false);
  localRef.current = data;

  // Initial load — try API, fallback to localStorage
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/nodes/${original.id}`);
        if (!res.ok) throw new Error("API unavailable");
        const shared: SharedOverlay | null = await res.json();
        if (cancelled) return;

        setUseApi(true);
        if (shared) {
          setRemoteUpdatedAt(shared.updatedAt || null);
          setData((prev) => ({
            ...prev,
            eraTitle: shared.eraTitle ?? original.eraTitle,
            eraSubtitle: shared.eraSubtitle ?? original.eraSubtitle,
            date: shared.date ?? original.date,
            description: shared.description ?? original.description,
            photos: withPlaceholderPhotos(shared.photos ?? original.photos),
            memories: withPlaceholderMemories(shared.memories ?? original.memories),
          }));
        } else {
          setData((prev) => ({
            ...prev,
            photos: withPlaceholderPhotos(original.photos),
            memories: withPlaceholderMemories(original.memories),
          }));
        }
      } catch {
        // API unavailable — use localStorage
        if (cancelled) return;
        setUseApi(false);
        const ls = loadLs(original.id);
        if (ls) {
          setRemoteUpdatedAt(ls.updatedAt || null);
          setData((prev) => ({
            ...prev,
            eraTitle: ls.eraTitle ?? original.eraTitle,
            eraSubtitle: ls.eraSubtitle ?? original.eraSubtitle,
            date: ls.date ?? original.date,
            description: ls.description ?? original.description,
            photos: withPlaceholderPhotos(ls.photos ?? original.photos),
            memories: withPlaceholderMemories(ls.memories ?? original.memories),
          }));
        } else {
          setData((prev) => ({
            ...prev,
            photos: withPlaceholderPhotos(original.photos),
            memories: withPlaceholderMemories(original.memories),
          }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [original.id]);

  // Poll for remote updates (API mode only)
  useEffect(() => {
    if (useApi !== true) return;

    const interval = setInterval(async () => {
      if (dirtyRef.current) return;
      try {
        const res = await fetch(`/api/nodes/${original.id}`);
        if (!res.ok) return;
        const shared: SharedOverlay | null = await res.json();
        if (!shared?.updatedAt || shared.updatedAt === remoteUpdatedAt) return;

        setRemoteUpdatedAt(shared.updatedAt);
        setData((prev) => ({
          ...prev,
          eraTitle: shared.eraTitle ?? prev.eraTitle,
          eraSubtitle: shared.eraSubtitle ?? prev.eraSubtitle,
          date: shared.date ?? prev.date,
          description: shared.description ?? prev.description,
          photos: withPlaceholderPhotos(shared.photos ?? prev.photos),
          memories: withPlaceholderMemories(shared.memories ?? prev.memories),
        }));
      } catch { /* ignore */ }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [original.id, remoteUpdatedAt, useApi]);

  const updateField = useCallback(
    (field: "eraTitle" | "eraSubtitle" | "date" | "description", value: string) => {
      dirtyRef.current = true;
      setData((prev) => ({ ...prev, [field]: value }));
    }, []
  );

  const updatePhotos = useCallback((photos: PhotoEntry[]) => {
    dirtyRef.current = true;
    setData((prev) => ({ ...prev, photos: withPlaceholderPhotos(photos) }));
  }, []);

  const updateMemories = useCallback((memories: MemoryEntry[]) => {
    dirtyRef.current = true;
    setData((prev) => ({ ...prev, memories: withPlaceholderMemories(memories) }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    const current = localRef.current;
    const photos = current.photos.filter((p) => p.src && p.src.length > 10);
    const memories = current.memories.filter(
      (m) => m.text && m.text.trim() !== "" && m.text !== "新的回忆"
    );

    const payload: SharedOverlay = {
      eraTitle: current.eraTitle,
      eraSubtitle: current.eraSubtitle,
      date: current.date,
      description: current.description,
      photos,
      memories,
      updatedAt: new Date().toISOString(),
    };

    if (useApi) {
      try {
        const res = await fetch(`/api/nodes/${original.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const result = await res.json();
          setLastSaved(new Date().toLocaleTimeString());
          setRemoteUpdatedAt(result.updatedAt);
          dirtyRef.current = false;
          setData((prev) => ({
            ...prev,
            photos: withPlaceholderPhotos(photos),
            memories: withPlaceholderMemories(memories),
          }));
          setSaving(false);
          return;
        }
      } catch { /* fall through to localStorage */ }
    }

    // localStorage fallback
    saveLs(original.id, payload);
    setLastSaved(new Date().toLocaleTimeString());
    dirtyRef.current = false;
    setData((prev) => ({
      ...prev,
      photos: withPlaceholderPhotos(photos),
      memories: withPlaceholderMemories(memories),
    }));
    setSaving(false);
  }, [original.id, useApi]);

  const resetToOriginal = useCallback(() => {
    dirtyRef.current = true;
    setData(original);
  }, [original]);

  return {
    data,
    updateField,
    updatePhotos,
    updateMemories,
    save,
    saving,
    lastSaved,
    resetToOriginal,
  };
}

function withPlaceholderPhotos(photos: PhotoEntry[]): PhotoEntry[] {
  const filled = photos.filter((p) => p.src && p.src.length > 10);
  const last = photos[photos.length - 1];
  if (last && (!last.src || last.src.length <= 10)) return photos;
  return [...filled, { src: "", alt: "", width: 800, height: 600, caption: "" }];
}

function withPlaceholderMemories(memories: MemoryEntry[]): MemoryEntry[] {
  const filled = memories.filter(
    (m) => m.text && m.text.trim() !== "" && m.text !== "新的回忆"
  );
  const last = memories[memories.length - 1];
  if (last && (!last.text || last.text.trim() === "" || last.text === "新的回忆")) return memories;
  return [...filled, { icon: "heart", text: "", date: "" }];
}
