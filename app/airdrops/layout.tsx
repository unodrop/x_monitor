import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "优质空投项目 | X Monitor - 精选区块链空投机会",
  description: "发现优质区块链空投项目。精选的预测市场、Perp DEX、数字银行与支付、AI 与机器人等领域的早期空投机会，助您把握 Web3 投资先机。",
  keywords: [
    "空投项目",
    "区块链空投",
    "加密货币空投",
    "Web3 空投",
    "预测市场空投",
    "Perp DEX 空投",
    "数字银行空投",
    "AI 空投",
    "早期项目",
    "空投机会",
    "代币空投",
    "DeFi 空投",
    "空投导航",
    "优质空投",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/airdrops",
    siteName: "X Monitor",
    title: "优质空投项目 | X Monitor",
    description: "发现优质区块链空投项目。精选的预测市场、Perp DEX、数字银行与支付、AI 与机器人等领域的早期空投机会。",
  },
  twitter: {
    card: "summary_large_image",
    title: "优质空投项目 | X Monitor",
    description: "发现优质区块链空投项目。精选的预测市场、Perp DEX、数字银行与支付、AI 与机器人等领域的早期空投机会。",
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
    canonical: "/airdrops",
  },
};

export default function AirdropsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

