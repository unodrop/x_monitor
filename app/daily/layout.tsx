import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "加密日报 | X Monitor - 实时加密货币市场指标",
  description: "实时追踪比特币、以太坊、Solana 等主流币种价格，贪婪恐惧指数、AHR999、山寨季指数、全网爆仓、USDT 利率等关键市场指标，助您把握市场脉搏。",
  keywords: [
    "加密日报",
    "加密货币价格",
    "比特币价格",
    "以太坊价格",
    "Solana 价格",
    "贪婪恐惧指数",
    "AHR999",
    "山寨季指数",
    "全网爆仓",
    "USDT 利率",
    "加密货币指标",
    "市场数据",
    "实时行情",
    "X Monitor",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/daily",
    siteName: "X Monitor",
    title: "加密日报 | X Monitor",
    description: "实时追踪加密货币市场关键指标，把握市场脉搏。",
  },
  twitter: {
    card: "summary_large_image",
    title: "加密日报 | X Monitor",
    description: "实时追踪加密货币市场关键指标，把握市场脉搏。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/daily",
  },
};

export default function DailyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

