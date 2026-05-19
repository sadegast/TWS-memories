import type { Metadata } from "next";
import { Caveat, Gaegu, Ma_Shan_Zheng, Noto_Sans_KR, Press_Start_2P, ZCOOL_KuaiLe } from "next/font/google";
import "./globals.css";
import { BodyBackground } from "@/components/layout/BodyBackground";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const gaegu = Gaegu({
  variable: "--font-gaegu",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const zcoolKuaile = ZCOOL_KuaiLe({
  variable: "--font-zcool-kuaile",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-ma-shan-zheng",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucky to be loved — TWS",
  description:
    "我们越过那条金光闪闪的界限吧。记录青春成长轨迹的互动式记忆世界。",
  keywords: ["TWS", "TWENTY FOUR SEVEN WITH US", "K-pop", "青春", "成长", "记忆"],
  openGraph: {
    title: "Lucky to be loved — TWS",
    description: "我们越过那条金光闪闪的界限吧",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hans"
      className={`${notoSansKR.variable} ${gaegu.variable} ${zcoolKuaile.variable} ${pressStart.variable} ${caveat.variable} ${maShanZheng.variable} h-full antialiased`}
    >
      <body className="min-h-full relative">
        {/* Semi-transparent overlay for text readability */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ backgroundColor: "rgba(251, 249, 246, 0.55)" }}
          aria-hidden="true"
        />
        {/* Content layer above the overlay */}
        <BodyBackground />
        <div className="relative z-[1] min-h-full flex items-center justify-center">{children}</div>
      </body>
    </html>
  );
}
