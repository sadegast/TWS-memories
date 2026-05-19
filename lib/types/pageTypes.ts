export interface LetterData {
  id: string;
  recipient: string;
  message: string;
  signature: string;
  createdAt: string;
}

export interface StationPhoto {
  id: string;
  dataUrl: string;
  caption?: string;
  createdAt: string;
}

export interface TimelineStation {
  month: string;
  label: string;
  photos: StationPhoto[];
}

export interface SongData {
  id: string;
  title: string;
  koreanTitle?: string;
  album: string;
  releaseDate: string;
  keyLyrics: string;
}
