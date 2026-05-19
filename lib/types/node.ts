// ===== Node Detail (content for /node/[id]) =====

export interface PhotoEntry {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  rotation?: number;
}

export interface MemoryEntry {
  icon: string;
  text: string;
  date?: string;
}

export interface NodeDetail {
  id: string;
  date: string;
  eraTitle: string;
  eraSubtitle: string;
  coverImage: string;
  description: string;
  photos: PhotoEntry[];
  memories: MemoryEntry[];
  colorAccent: string;
}
