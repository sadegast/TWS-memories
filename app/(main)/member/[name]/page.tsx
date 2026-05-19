import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMember, getAllMembers } from "@/lib/data/members";
import { MemberPage } from "@/components/member/MemberPage";

interface Props {
  params: Promise<{ name: string }>;
}

export function generateStaticParams() {
  return getAllMembers().map((m) => ({ name: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const member = getMember(name);
  if (!member) return { title: "Not Found" };
  return {
    title: `${member.name} (${member.koreanName}) | TWS`,
    description: `${member.name} — TWS Member`,
  };
}

export default async function MemberRoute({ params }: Props) {
  const { name } = await params;
  const member = getMember(name);

  if (!member) notFound();

  return <MemberPage member={member} />;
}
