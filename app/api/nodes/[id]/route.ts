export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import { getAllNodeIds } from "@/lib/data/nodes";
import fs from "fs/promises";
import path from "path";

export function generateStaticParams() {
  return getAllNodeIds().map((id) => ({ id }));
}

const DATA_DIR = path.join(process.cwd(), "data", "shared-nodes");

interface SharedNodeData {
  eraTitle: string;
  eraSubtitle: string;
  date: string;
  description: string;
  photos: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
    rotation?: number;
  }>;
  memories: Array<{
    icon: string;
    text: string;
    date?: string;
  }>;
  updatedAt: string;
}

function sharedFilePath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

async function readShared(id: string): Promise<SharedNodeData | null> {
  try {
    const raw = await fs.readFile(sharedFilePath(id), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// GET — return shared data for a node
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await readShared(id);
  return NextResponse.json(data);
}

// PUT — save shared data for a node
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const shared: SharedNodeData = {
    eraTitle: body.eraTitle || "",
    eraSubtitle: body.eraSubtitle || "",
    date: body.date || "",
    description: body.description || "",
    photos: body.photos || [],
    memories: body.memories || [],
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(sharedFilePath(id), JSON.stringify(shared, null, 2), "utf-8");

  return NextResponse.json({ ok: true, updatedAt: shared.updatedAt });
}
