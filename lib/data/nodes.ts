import { NodeDetail } from "@/lib/types/node";
import { MapManifest } from "@/lib/types/map";
import mapManifestData from "@/content/map/map-manifest.json";
import sparklingBlue from "@/content/nodes/sparkling-blue.json";
import summerBeat from "@/content/nodes/summer-beat.json";
import lastBell from "@/content/nodes/last-bell.json";
import tryWithUs from "@/content/nodes/try-with-us.json";
import hajimemashic from "@/content/nodes/hajimemashic.json";
import playHard from "@/content/nodes/play-hard.json";
import noTragedy from "@/content/nodes/no-tragedy.json";

const nodeMap: Record<string, NodeDetail> = {
  "sparkling-blue": sparklingBlue as NodeDetail,
  "summer-beat": summerBeat as NodeDetail,
  "last-bell": lastBell as NodeDetail,
  "try-with-us": tryWithUs as NodeDetail,
  hajimemashic: hajimemashic as NodeDetail,
  "play-hard": playHard as NodeDetail,
  "no-tragedy": noTragedy as NodeDetail,
};

export function getNodeDetail(id: string): NodeDetail | null {
  return nodeMap[id] ?? null;
}

export function getAllNodeIds(): string[] {
  return Object.keys(nodeMap);
}

export const mapManifest: MapManifest = mapManifestData as MapManifest;

export function getMapNodes() {
  return mapManifest.nodes;
}

export function getMapRegions() {
  return mapManifest.regions;
}

export function getMapPaths() {
  return mapManifest.paths;
}
