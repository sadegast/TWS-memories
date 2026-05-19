import { Member } from "@/lib/types/member";
import shinyu from "@/content/members/shinyu.json";
import dohoon from "@/content/members/dohoon.json";
import youngjae from "@/content/members/youngjae.json";
import hanjin from "@/content/members/hanjin.json";
import jihoon from "@/content/members/jihoon.json";
import kyungmin from "@/content/members/kyungmin.json";

const memberMap: Record<string, Member> = {
  shinyu: shinyu as Member,
  dohoon: dohoon as Member,
  youngjae: youngjae as Member,
  hanjin: hanjin as Member,
  jihoon: jihoon as Member,
  kyungmin: kyungmin as Member,
};

export function getMember(id: string): Member | null {
  return memberMap[id] ?? null;
}

export function getAllMembers(): Member[] {
  return Object.values(memberMap);
}
