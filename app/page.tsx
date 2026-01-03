"use client";

import { useState } from "react";
import { ExternalLink, Search, Sparkles, Newspaper, Coins, Wallet, TrendingUp, Globe, Zap, ArrowRight, BarChart3, Dog, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  {
    id: "tools",
    name: "工具",
    description: "区块链开发、数据分析、钱包等实用工具",
    icon: <Zap className="h-5 w-5" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "news",
    name: "资讯",
    description: "区块链新闻、市场分析、行业动态",
    icon: <Newspaper className="h-5 w-5" />,
    color: "text-green-600 dark:text-green-400",
  },
  {
    id: "airdrop",
    name: "空投",
    description: "空投项目、任务平台、积分系统",
    icon: <Coins className="h-5 w-5" />,
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "wallet",
    name: "钱包",
    description: "加密货币钱包、DeFi 协议",
    icon: <Wallet className="h-5 w-5" />,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "defi",
    name: "DeFi",
    description: "去中心化金融协议、流动性挖矿",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "explorer",
    name: "区块浏览器",
    description: "区块链浏览器、交易查询工具",
    icon: <Globe className="h-5 w-5" />,
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "prediction",
    name: "预测市场",
    description: "去中心化预测市场、事件交易平台",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    id: "meme",
    name: "土狗/Meme",
    description: "Meme 币追踪、土狗币平台、社区代币",
    icon: <Dog className="h-5 w-5" />,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "exchange",
    name: "交易所",
    description: "中心化和去中心化交易所、交易平台",
    icon: <Building2 className="h-5 w-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
  },
];

// 工具数据（实际应该从数据库或API获取）
const tools: Tool[] = [
  // 区块浏览器
  {
    id: "1",
    name: "Etherscan",
    description: "以太坊区块链浏览器",
    url: "https://etherscan.io",
    category: "explorer",
  },
  {
    id: "2",
    name: "BscScan",
    description: "BSC 区块链浏览器",
    url: "https://bscscan.com",
    category: "explorer",
  },
  {
    id: "3",
    name: "PolygonScan",
    description: "Polygon 区块链浏览器",
    url: "https://polygonscan.com",
    category: "explorer",
  },
  {
    id: "4",
    name: "Arbiscan",
    description: "Arbitrum 区块链浏览器",
    url: "https://arbiscan.io",
    category: "explorer",
  },
  {
    id: "5",
    name: "Solscan",
    description: "Solana 区块链浏览器",
    url: "https://solscan.io",
    category: "explorer",
  },
  // 资讯
  {
    id: "6",
    name: "CoinGecko",
    description: "加密货币价格追踪和市场数据",
    url: "https://coingecko.com",
    category: "news",
  },
  {
    id: "7",
    name: "CoinMarketCap",
    description: "加密货币市值和价格追踪",
    url: "https://coinmarketcap.com",
    category: "news",
  },
  {
    id: "8",
    name: "The Block",
    description: "区块链新闻和研究",
    url: "https://www.theblock.co",
    category: "news",
  },
  {
    id: "9",
    name: "Decrypt",
    description: "加密货币和 Web3 新闻",
    url: "https://decrypt.co",
    category: "news",
  },
  {
    id: "10",
    name: "CoinDesk",
    description: "加密货币新闻和分析",
    url: "https://www.coindesk.com",
    category: "news",
  },
  // 钱包
  {
    id: "11",
    name: "MetaMask",
    description: "最流行的以太坊钱包",
    url: "https://metamask.io",
    category: "wallet",
  },
  {
    id: "12",
    name: "Trust Wallet",
    description: "多链加密货币钱包",
    url: "https://trustwallet.com",
    category: "wallet",
  },
  {
    id: "13",
    name: "Coinbase Wallet",
    description: "Coinbase 官方钱包",
    url: "https://www.coinbase.com/wallet",
    category: "wallet",
  },
  {
    id: "14",
    name: "Phantom",
    description: "Solana 生态钱包",
    url: "https://phantom.app",
    category: "wallet",
  },
  {
    id: "15",
    name: "Rainbow",
    description: "以太坊钱包，界面精美",
    url: "https://rainbow.me",
    category: "wallet",
  },
  // DeFi
  {
    id: "16",
    name: "Uniswap",
    description: "去中心化交易协议",
    url: "https://uniswap.org",
    category: "defi",
  },
  {
    id: "17",
    name: "Aave",
    description: "去中心化借贷协议",
    url: "https://aave.com",
    category: "defi",
  },
  {
    id: "18",
    name: "Compound",
    description: "算法货币市场协议",
    url: "https://compound.finance",
    category: "defi",
  },
  {
    id: "19",
    name: "Curve Finance",
    description: "稳定币和 ETH 交易池",
    url: "https://curve.fi",
    category: "defi",
  },
  {
    id: "20",
    name: "1inch",
    description: "DEX 聚合器",
    url: "https://1inch.io",
    category: "defi",
  },
  {
    id: "21",
    name: "PancakeSwap",
    description: "BSC 上的 DEX",
    url: "https://pancakeswap.finance",
    category: "defi",
  },
  // 空投
  {
    id: "22",
    name: "Layer3",
    description: "Web3 任务和空投平台",
    url: "https://layer3.xyz",
    category: "airdrop",
  },
  {
    id: "23",
    name: "Galxe",
    description: "Web3 凭证数据网络",
    url: "https://galxe.com",
    category: "airdrop",
  },
  {
    id: "24",
    name: "QuestN",
    description: "Web3 任务和空投平台",
    url: "https://questn.com",
    category: "airdrop",
  },
  {
    id: "25",
    name: "Crew3",
    description: "社区任务和奖励平台",
    url: "https://crew3.xyz",
    category: "airdrop",
  },
  {
    id: "26",
    name: "Zealy",
    description: "社区参与和奖励平台",
    url: "https://zealy.io",
    category: "airdrop",
  },
  // 工具
  {
    id: "27",
    name: "Dune Analytics",
    description: "区块链数据分析平台",
    url: "https://dune.com",
    category: "tools",
  },
  {
    id: "28",
    name: "Nansen",
    description: "链上数据分析平台",
    url: "https://www.nansen.ai",
    category: "tools",
  },
  {
    id: "29",
    name: "DefiLlama",
    description: "DeFi TVL 和协议数据",
    url: "https://defillama.com",
    category: "tools",
  },
  {
    id: "30",
    name: "Token Terminal",
    description: "加密货币基本面分析",
    url: "https://www.tokenterminal.com",
    category: "tools",
  },
  {
    id: "31",
    name: "Etherscan Gas Tracker",
    description: "以太坊 Gas 价格追踪",
    url: "https://etherscan.io/gastracker",
    category: "tools",
  },
  {
    id: "32",
    name: "Remix IDE",
    description: "以太坊智能合约开发环境",
    url: "https://remix.ethereum.org",
    category: "tools",
  },
  {
    id: "33",
    name: "Hardhat",
    description: "以太坊开发框架",
    url: "https://hardhat.org",
    category: "tools",
  },
  {
    id: "34",
    name: "OpenZeppelin",
    description: "智能合约安全库",
    url: "https://www.openzeppelin.com",
    category: "tools",
  },
  // 预测市场
  {
    id: "35",
    name: "Polymarket",
    description: "去中心化预测市场平台",
    url: "https://polymarket.com",
    category: "prediction",
  },
  {
    id: "36",
    name: "Augur",
    description: "去中心化预测市场协议",
    url: "https://www.augur.net",
    category: "prediction",
  },
  {
    id: "37",
    name: "Omen",
    description: "基于 Gnosis 的预测市场",
    url: "https://omen.eth.link",
    category: "prediction",
  },
  {
    id: "38",
    name: "PlotX",
    description: "无 Gas 预测市场平台",
    url: "https://plotx.io",
    category: "prediction",
  },
  {
    id: "39",
    name: "Azuro",
    description: "去中心化预测市场基础设施",
    url: "https://azuro.org",
    category: "prediction",
  },
  {
    id: "40",
    name: "Veil",
    description: "预测市场交易平台",
    url: "https://veil.co",
    category: "prediction",
  },
  // 土狗/Meme 平台
  {
    id: "41",
    name: "DexScreener",
    description: "DEX 代币价格追踪和图表",
    url: "https://dexscreener.com",
    category: "meme",
  },
  {
    id: "42",
    name: "Dextools",
    description: "DEX 交易分析和工具",
    url: "https://www.dextools.io",
    category: "meme",
  },
  {
    id: "43",
    name: "Birdeye",
    description: "Solana 代币分析和追踪",
    url: "https://birdeye.so",
    category: "meme",
  },
  {
    id: "44",
    name: "RugCheck",
    description: "代币安全性和 Rug Pull 检测",
    url: "https://rugcheck.xyz",
    category: "meme",
  },
  {
    id: "45",
    name: "Token Sniffer",
    description: "代币安全扫描和风险检测",
    url: "https://tokensniffer.com",
    category: "meme",
  },
  {
    id: "46",
    name: "Honeypot.is",
    description: "智能合约安全检测工具",
    url: "https://www.honeypot.is",
    category: "meme",
  },
  {
    id: "47",
    name: "PooCoin",
    description: "BSC 代币价格图表和追踪",
    url: "https://poocoin.app",
    category: "meme",
  },
  {
    id: "48",
    name: "Bubblemaps",
    description: "代币持有者分布可视化",
    url: "https://bubblemaps.io",
    category: "meme",
  },
  // 交易所
  {
    id: "49",
    name: "Binance",
    description: "全球最大的加密货币交易所",
    url: "https://www.binance.com",
    category: "exchange",
  },
  {
    id: "50",
    name: "Coinbase",
    description: "美国领先的加密货币交易所",
    url: "https://www.coinbase.com",
    category: "exchange",
  },
  {
    id: "51",
    name: "OKX",
    description: "全球知名加密货币交易所",
    url: "https://www.okx.com",
    category: "exchange",
  },
  {
    id: "52",
    name: "Kraken",
    description: "安全可靠的加密货币交易所",
    url: "https://www.kraken.com",
    category: "exchange",
  },
  {
    id: "53",
    name: "Bybit",
    description: "专业衍生品交易平台",
    url: "https://www.bybit.com",
    category: "exchange",
  },
  {
    id: "54",
    name: "Gate.io",
    description: "全球加密货币交易平台",
    url: "https://www.gate.io",
    category: "exchange",
  },
  {
    id: "55",
    name: "KuCoin",
    description: "全球加密货币交易所",
    url: "https://www.kucoin.com",
    category: "exchange",
  },
  {
    id: "56",
    name: "Huobi",
    description: "全球数字资产交易平台",
    url: "https://www.huobi.com",
    category: "exchange",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl dark:bg-blue-900/10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl dark:bg-indigo-900/10" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 relative z-10">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-black shadow-sm dark:border-white/10 dark:bg-gray-900/70 dark:text-white">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>发现最佳区块链工具</span>
          </div>
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            区块链工具导航
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-gray-700 dark:text-gray-300">
            精选的区块链工具、资讯、空投平台，助您高效探索 Web3 世界
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="搜索工具、资讯或空投平台..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pb-8 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-black dark:text-white">分类</h3>
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="cursor-pointer"
            >
              清除筛选
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.id)
                }
                className={`group relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 cursor-pointer min-w-[120px] ${
                  isSelected
                    ? "border-black bg-black/5 shadow-md dark:border-white dark:bg-white/5"
                    : "border-black/10 bg-white/90 backdrop-blur-xl hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-gray-950/90 dark:hover:border-white/20"
                }`}
                title={category.description}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-black/10 dark:bg-white/10"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <div className={category.color}>
                    {category.icon}
                  </div>
                </div>
                <div className="whitespace-nowrap">
                  <h4 className={`text-sm font-bold ${
                    isSelected
                      ? "text-black dark:text-white"
                      : "text-black dark:text-white"
                  }`}>
                    {category.name}
                  </h4>
                  <p
                    className={`absolute left-4 right-4 top-full mt-2 z-10 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs leading-tight shadow-lg opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300 ${
                      isSelected
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-black dark:text-white">
            {selectedCategory
              ? `${categories.find((c) => c.id === selectedCategory)?.name} (${filteredTools.length})`
              : `全部工具 (${filteredTools.length})`}
          </h3>
        </div>

        {filteredTools.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur-xl p-16 text-center shadow-lg dark:border-white/10 dark:bg-gray-950/90">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
              <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
              未找到匹配的工具
            </h4>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              尝试调整搜索条件或选择其他分类
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => {
              const category = categories.find((c) => c.id === tool.category);
              return (
                <a
                  key={tool.id}
                  href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
                  className="group rounded-2xl border border-black/10 bg-white/90 backdrop-blur-xl p-6 shadow-sm transition-all duration-200 hover:border-black/20 hover:shadow-lg dark:border-white/10 dark:bg-gray-950/90 dark:hover:border-white/20 cursor-pointer"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 ${category?.color || "text-gray-600 dark:text-gray-400"}`}
                    >
                      {category?.icon || <Globe className="h-6 w-6" />}
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300" />
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-black dark:text-white">
                    {tool.name}
                  </h4>
                  <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {category?.name || "其他"}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/60 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-black to-gray-900 dark:from-white dark:to-gray-100">
                <span className="text-sm font-bold text-white dark:text-black">X</span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                © 2026 Airdrop.uno 区块链工具导航平台.
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Dashboard
                <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
