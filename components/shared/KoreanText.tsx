import { ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
  style?: CSSProperties;
}

export function KoreanText({
  children,
  as: Tag = "span",
  className = "",
  style,
}: Props) {
  return <Tag className={`handwriting ${className}`} style={style}>{children}</Tag>;
}
