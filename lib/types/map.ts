export interface MapRegion {
  id: string;
  name: string;
  koreanName: string;
  pathData: string;
  fillColor: string;
  centerPoint: { x: number; y: number };
  ambientAnimation: "petals" | "water" | "grass" | "clouds" | "light" | "none";
  linkTo?: string;
}

export interface MapNodeAnchor {
  id: string;
  date: string;
  eraTitle: string;
  eraSubtitle: string;
  position: { x: number; y: number };
  connectedTo: string[];
  regionId: string;
  iconType: "star" | "flower" | "bell" | "heart" | "music" | "fire" | "crystal";
}

export interface MapPath {
  from: string;
  to: string;
  pathData: string;
}

export interface MapManifest {
  viewBox: { width: number; height: number };
  regions: MapRegion[];
  nodes: MapNodeAnchor[];
  paths: MapPath[];
}
