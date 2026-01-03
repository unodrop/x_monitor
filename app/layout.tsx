import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "区块链工具导航 | X Monitor - 精选 Web3 工具、资讯、空投平台",
    template: "%s | X Monitor",
  },
  description: "发现最佳区块链工具导航平台。精选的 Web3 工具、加密货币资讯、空投平台、DeFi 协议、交易所、区块浏览器等，助您高效探索区块链世界。",
  keywords: [
    "区块链工具",
    "Web3 工具",
    "加密货币工具",
    "DeFi 工具",
    "空投平台",
    "区块链导航",
    "加密货币交易所",
    "区块浏览器",
    "钱包工具",
    "预测市场",
    "Meme 币",
    "土狗币",
    "区块链资讯",
    "X Monitor",
    "KOL 监控",
    "Twitter 监控",
  ],
  authors: [{ name: "X Monitor" }],
  creator: "X Monitor",
  publisher: "X Monitor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://x-monitor.com"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "X Monitor",
    title: "区块链工具导航 | X Monitor",
    description: "发现最佳区块链工具导航平台。精选的 Web3 工具、加密货币资讯、空投平台、DeFi 协议、交易所等。",
  },
  twitter: {
    card: "summary_large_image",
    title: "区块链工具导航 | X Monitor",
    description: "发现最佳区块链工具导航平台。精选的 Web3 工具、加密货币资讯、空投平台、DeFi 协议、交易所等。",
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
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
