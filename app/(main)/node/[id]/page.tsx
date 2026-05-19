import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNodeDetail, getAllNodeIds } from "@/lib/data/nodes";
import { NodeDetailPage } from "@/components/node/NodeDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllNodeIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const node = getNodeDetail(id);
  if (!node) return { title: "Not Found" };

  return {
    title: `${node.eraTitle} — ${node.eraSubtitle} | TWS`,
    description: node.description.slice(0, 160),
  };
}

export default async function NodeRoute({ params }: Props) {
  const { id } = await params;
  const node = getNodeDetail(id);

  if (!node) notFound();

  return <NodeDetailPage node={node} />;
}
