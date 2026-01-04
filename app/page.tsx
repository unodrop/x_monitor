"use client";

import { useState } from "react";
import {
  ExternalLink,
  Search,
  Sparkles,
  Coins,
  Wallet,
  TrendingUp,
  Globe,
  BarChart3,
  Dog,
  Building2,
  BookOpen,
  Bot,
  Code,
  LineChart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon?: string;
  recommended?: boolean;
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
    id: "dev",
    name: "开发工具",
    description: "智能合约开发、测试、部署工具",
    icon: <Code className="h-5 w-5" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "analytics",
    name: "数据分析平台",
    description: "链上数据分析、代币追踪、市场研究",
    icon: <LineChart className="h-5 w-5" />,
    color: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "ai",
    name: "AI",
    description: "AI 工具、智能分析、自动化助手",
    icon: <Bot className="h-5 w-5" />,
    color: "text-violet-600 dark:text-violet-400",
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
    name: "MemeCoin",
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
  {
    id: "research",
    name: "币圈投研工具",
    description: "投研工具、行情查询、K线分析、宏观数据",
    icon: <BookOpen className="h-5 w-5" />,
    color: "text-rose-600 dark:text-rose-400",
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
    icon: "https://www.google.com/s2/favicons?domain=etherscan.io&sz=64",
  },
  {
    id: "2",
    name: "BscScan",
    description: "BSC 区块链浏览器",
    url: "https://bscscan.com",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=bscscan.com&sz=64",
  },
  {
    id: "3",
    name: "PolygonScan",
    description: "Polygon 区块链浏览器",
    url: "https://polygonscan.com",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=polygonscan.com&sz=64",
  },
  {
    id: "4",
    name: "Arbiscan",
    description: "Arbitrum 区块链浏览器",
    url: "https://arbiscan.io",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=arbiscan.io&sz=64",
  },
  {
    id: "5",
    name: "Solscan",
    description: "Solana 区块链浏览器",
    url: "https://solscan.io",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=solscan.io&sz=64",
  },
  {
    id: "5a",
    name: "Optimistic Etherscan",
    description: "Optimism 区块链浏览器",
    url: "https://optimistic.etherscan.io",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=optimistic.etherscan.io&sz=64",
  },
  {
    id: "5b",
    name: "BaseScan",
    description: "Base 区块链浏览器",
    url: "https://basescan.org",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=basescan.org&sz=64",
  },
  {
    id: "5c",
    name: "zkSync Era Explorer",
    description: "zkSync Era 区块链浏览器",
    url: "https://explorer.zksync.io",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=explorer.zksync.io&sz=64",
  },
  {
    id: "5d",
    name: "StarkScan",
    description: "Starknet 区块链浏览器",
    url: "https://starkscan.co",
    category: "explorer",
    icon: "https://www.google.com/s2/favicons?domain=starkscan.co&sz=64",
  },
  // AI
  {
    id: "6",
    name: "ChatGPT",
    description: "OpenAI 的 AI 对话助手",
    url: "https://chat.openai.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=openai.com&sz=64",
    recommended: true,
  },
  {
    id: "7",
    name: "Claude",
    description: "Anthropic 的 AI 助手",
    url: "https://claude.ai",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=claude.ai&sz=64",
    recommended: true,
  },
  {
    id: "8",
    name: "Perplexity",
    description: "AI 驱动的搜索引擎",
    url: "https://www.perplexity.ai",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64",
  },
  {
    id: "9",
    name: "Midjourney",
    description: "AI 图像生成工具",
    url: "https://www.midjourney.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=64",
  },
  {
    id: "10",
    name: "Runway",
    description: "AI 视频和图像编辑工具",
    url: "https://runwayml.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=runwayml.com&sz=64",
  },
  {
    id: "10a",
    name: "NotebookLM",
    description: "Google 的 AI 笔记和研究助手",
    url: "https://notebooklm.google.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=notebooklm.google.com&sz=64",
  },
  {
    id: "10b",
    name: "Cursor",
    description: "AI 代码编辑器",
    url: "https://cursor.sh",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=cursor.sh&sz=64",
    recommended: true,
  },
  {
    id: "10c",
    name: "GitHub Copilot",
    description: "AI 编程助手",
    url: "https://github.com/features/copilot",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
  },
  {
    id: "10d",
    name: "通义千问",
    description: "阿里云 AI 大模型",
    url: "https://tongyi.aliyun.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=aliyun.com&sz=64",
  },
  {
    id: "10e",
    name: "豆包",
    description: "字节跳动 AI 助手",
    url: "https://www.doubao.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=doubao.com&sz=64",
  },
  {
    id: "10f",
    name: "DeepSeek",
    description: "DeepSeek AI 助手",
    url: "https://www.deepseek.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=deepseek.com&sz=64",
  },
  {
    id: "10g",
    name: "Gemini",
    description: "Google AI 助手",
    url: "https://gemini.google.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=google.com&sz=64",
  },
  {
    id: "10h",
    name: "文心一言",
    description: "百度 AI 大模型",
    url: "https://yiyan.baidu.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=baidu.com&sz=64",
  },
  {
    id: "10i",
    name: "Kimi",
    description: "月之暗面 AI 助手",
    url: "https://kimi.moonshot.cn",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=moonshot.cn&sz=64",
  },
  {
    id: "10j",
    name: "Copilot",
    description: "Microsoft AI 编程助手",
    url: "https://copilot.microsoft.com",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=64",
  },
  {
    id: "10k",
    name: "Stable Diffusion",
    description: "AI 图像生成工具",
    url: "https://stability.ai",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=stability.ai&sz=64",
  },
  {
    id: "10l",
    name: "Character.AI",
    description: "AI 角色对话平台",
    url: "https://character.ai",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=character.ai&sz=64",
  },
  {
    id: "10m",
    name: "Jasper",
    description: "AI 内容创作工具",
    url: "https://www.jasper.ai",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=jasper.ai&sz=64",
  },
  {
    id: "10n",
    name: "Notion AI",
    description: "Notion 内置 AI 助手",
    url: "https://www.notion.so/product/ai",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=notion.so&sz=64",
    recommended: true,
  },
  // 钱包
  {
    id: "11",
    name: "MetaMask",
    description: "最流行的以太坊钱包",
    url: "https://metamask.io",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=metamask.io&sz=64",
    recommended: true,
  },
  {
    id: "12",
    name: "Trust Wallet",
    description: "多链加密货币钱包",
    url: "https://trustwallet.com",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=trustwallet.com&sz=64",
  },
  {
    id: "13",
    name: "Coinbase Wallet",
    description: "Coinbase 官方钱包",
    url: "https://www.coinbase.com/wallet",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=coinbase.com&sz=64",
  },
  {
    id: "14",
    name: "Phantom",
    description: "Solana 生态钱包",
    url: "https://phantom.app",
    category: "wallet",
    icon: "https://phantom.com/_web_platform_assets/favicon.ico",
    recommended: true,
  },
  {
    id: "15",
    name: "Rainbow",
    description: "以太坊钱包，界面精美",
    url: "https://rainbow.me",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=rainbow.me&sz=64",
    recommended: true,
  },
  {
    id: "15a",
    name: "OKX Wallet",
    description: "OKX 官方多链钱包",
    url: "https://www.okx.com/web3",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=okx.com&sz=64",
    recommended: true,
  },
  {
    id: "15b",
    name: "SUI Wallet",
    description: "Sui 区块链官方钱包",
    url: "https://suiet.app",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=suiet.app&sz=64",
    recommended: true,
  },
  {
    id: "15c",
    name: "Ledger",
    description: "硬件钱包",
    url: "https://www.ledger.com",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=ledger.com&sz=64",
  },
  {
    id: "15d",
    name: "Trezor",
    description: "硬件钱包",
    url: "https://trezor.io",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=trezor.io&sz=64",
  },
  {
    id: "15e",
    name: "Argent",
    description: "智能合约钱包",
    url: "https://www.argent.xyz",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=argent.xyz&sz=64",
  },
  {
    id: "15f",
    name: "Safe",
    description: "多签钱包",
    url: "https://safe.global",
    category: "wallet",
    icon: "https://www.google.com/s2/favicons?domain=safe.global&sz=64",
  },
  // DeFi
  {
    id: "16",
    name: "Uniswap",
    description: "去中心化交易协议",
    url: "https://uniswap.org",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=uniswap.org&sz=64",
    recommended: true,
  },
  {
    id: "17",
    name: "Aave",
    description: "去中心化借贷协议",
    url: "https://aave.com",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=aave.com&sz=64",
    recommended: true,
  },
  {
    id: "18",
    name: "Compound",
    description: "算法货币市场协议",
    url: "https://compound.finance",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=compound.finance&sz=64",
  },
  {
    id: "19",
    name: "Curve Finance",
    description: "稳定币和 ETH 交易池",
    url: "https://curve.fi",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=curve.fi&sz=64",
  },
  {
    id: "20",
    name: "1inch",
    description: "DEX 聚合器",
    url: "https://1inch.io",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=1inch.io&sz=64",
  },
  {
    id: "21",
    name: "PancakeSwap",
    description: "BSC 上的 DEX",
    url: "https://pancakeswap.finance",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=pancakeswap.finance&sz=64",
  },
  {
    id: "21a",
    name: "SushiSwap",
    description: "多链 DEX 和 DeFi 协议",
    url: "https://www.sushi.com",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=sushi.com&sz=64",
  },
  {
    id: "21b",
    name: "MakerDAO",
    description: "去中心化稳定币协议",
    url: "https://makerdao.com",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=makerdao.com&sz=64",
  },
  {
    id: "21c",
    name: "Lido",
    description: "流动性质押协议",
    url: "https://lido.fi",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=lido.fi&sz=64",
  },
  {
    id: "21d",
    name: "Yearn Finance",
    description: "DeFi 收益聚合器",
    url: "https://yearn.fi",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=yearn.fi&sz=64",
  },
  {
    id: "21e",
    name: "Balancer",
    description: "自动化做市商协议",
    url: "https://balancer.fi",
    category: "defi",
    icon: "https://www.google.com/s2/favicons?domain=balancer.fi&sz=64",
  },
  // 空投
  {
    id: "22",
    name: "Layer3",
    description: "Web3 任务和空投平台",
    url: "https://layer3.xyz",
    category: "airdrop",
    icon: "https://www.google.com/s2/favicons?domain=layer3.xyz&sz=64",
  },
  {
    id: "23",
    name: "Galxe",
    description: "Web3 凭证数据网络",
    url: "https://galxe.com",
    category: "airdrop",
    icon: "https://www.google.com/s2/favicons?domain=galxe.com&sz=64",
  },
  {
    id: "24",
    name: "QuestN",
    description: "Web3 任务和空投平台",
    url: "https://questn.com",
    category: "airdrop",
    icon: "https://questn.com/favicon.ico",
  },
  {
    id: "26",
    name: "Zealy",
    description: "社区参与和奖励平台",
    url: "https://zealy.io",
    category: "airdrop",
    icon: "https://www.google.com/s2/favicons?domain=zealy.io&sz=64",
  },
  {
    id: "26a",
    name: "TaskOn",
    description: "Web3 任务和空投平台",
    url: "https://taskon.xyz",
    category: "airdrop",
    icon: "https://www.google.com/s2/favicons?domain=taskon.xyz&sz=64",
  },
  {
    id: "26b",
    name: "Gleam",
    description: "社交媒体任务平台",
    url: "https://gleam.io",
    category: "airdrop",
    icon: "https://gleam.io/favicon.ico",
  },
  // 开发工具
  {
    id: "32",
    name: "Remix IDE",
    description: "以太坊智能合约开发环境",
    url: "https://remix.ethereum.org",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=remix.ethereum.org&sz=64",
  },
  {
    id: "33",
    name: "Hardhat",
    description: "以太坊开发框架",
    url: "https://hardhat.org",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=hardhat.org&sz=64",
  },
  {
    id: "34",
    name: "OpenZeppelin",
    description: "智能合约安全库",
    url: "https://www.openzeppelin.com",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=openzeppelin.com&sz=64",
  },
  {
    id: "34e",
    name: "Foundry",
    description: "以太坊开发工具链",
    url: "https://book.getfoundry.sh",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=getfoundry.sh&sz=64",
  },
  {
    id: "34e1",
    name: "Anchor",
    description: "Solana 智能合约框架",
    url: "https://www.anchor-lang.com",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=anchor-lang.com&sz=64",
  },
  {
    id: "34e2",
    name: "Solana Playground",
    description: "Solana 在线开发环境",
    url: "https://beta.solpg.io",
    category: "dev",
    icon: "https://beta.solpg.io/favicon.ico",
  },
  {
    id: "34e3",
    name: "TON Development",
    description: "TON 区块链开发工具",
    url: "https://ton.org/develop",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=ton.org&sz=64",
  },
  {
    id: "34e4",
    name: "Truffle",
    description: "以太坊开发框架",
    url: "https://trufflesuite.com",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=trufflesuite.com&sz=64",
  },
  {
    id: "34e5",
    name: "Brownie",
    description: "Python 以太坊开发框架",
    url: "https://eth-brownie.readthedocs.io",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=readthedocs.io&sz=64",
  },
  {
    id: "34e6",
    name: "Wagmi",
    description: "React Hooks for Ethereum",
    url: "https://wagmi.sh",
    category: "dev",
    icon: "https://wagmi.sh/logo-dark.svg",
  },
  {
    id: "34e7",
    name: "Viem",
    description: "TypeScript 以太坊接口库",
    url: "https://viem.sh",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=viem.sh&sz=64",
  },
  {
    id: "34e8",
    name: "Ethers.js",
    description: "以太坊 JavaScript 库",
    url: "https://ethers.org",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=ethers.org&sz=64",
  },
  {
    id: "34e9",
    name: "Web3.js",
    description: "以太坊 JavaScript API",
    url: "https://web3js.readthedocs.io",
    category: "dev",
    icon: "https://www.google.com/s2/favicons?domain=readthedocs.io&sz=64",
  },
  // 数据分析平台
  {
    id: "27",
    name: "Dune Analytics",
    description: "区块链数据分析平台",
    url: "https://dune.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=dune.com&sz=64",
  },
  {
    id: "28",
    name: "Nansen",
    description: "链上数据分析平台",
    url: "https://www.nansen.ai",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=nansen.ai&sz=64",
  },
  {
    id: "29",
    name: "DefiLlama",
    description: "DeFi TVL 和协议数据",
    url: "https://defillama.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=defillama.com&sz=64",
    recommended: true,
  },
  {
    id: "30",
    name: "Token Terminal",
    description: "加密货币基本面分析",
    url: "https://www.tokenterminal.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=tokenterminal.com&sz=64",
  },
  {
    id: "31",
    name: "Etherscan Gas Tracker",
    description: "以太坊 Gas 价格追踪",
    url: "https://etherscan.io/gastracker",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=etherscan.io&sz=64",
  },
  {
    id: "34a",
    name: "Arkham",
    description: "链上情报和分析平台",
    url: "https://www.arkhamintelligence.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=arkhamintelligence.com&sz=64",
  },
  {
    id: "34b",
    name: "Zerion",
    description: "DeFi 投资组合追踪",
    url: "https://zerion.io",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=zerion.io&sz=64",
  },
  {
    id: "34c",
    name: "Zapper",
    description: "DeFi 资产管理平台",
    url: "https://zapper.fi",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=zapper.fi&sz=64",
  },
  {
    id: "34d",
    name: "Debank",
    description: "DeFi 钱包和投资组合追踪",
    url: "https://debank.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=debank.com&sz=64",
  },
  {
    id: "34f",
    name: "DexScreener",
    description: "DEX 代币价格追踪和图表",
    url: "https://dexscreener.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=dexscreener.com&sz=64",
  },
  {
    id: "34g",
    name: "Dextools",
    description: "DEX 交易分析和工具",
    url: "https://www.dextools.io",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=dextools.io&sz=64",
  },
  {
    id: "34h",
    name: "Birdeye",
    description: "Solana 代币分析和追踪",
    url: "https://birdeye.so",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=birdeye.so&sz=64",
  },
  {
    id: "34i",
    name: "RugCheck",
    description: "代币安全性和 Rug Pull 检测",
    url: "https://rugcheck.xyz",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=rugcheck.xyz&sz=64",
  },
  {
    id: "34j",
    name: "Token Sniffer",
    description: "代币安全扫描和风险检测",
    url: "https://tokensniffer.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=tokensniffer.com&sz=64",
  },
  {
    id: "34k",
    name: "Honeypot.is",
    description: "智能合约安全检测工具",
    url: "https://www.honeypot.is",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=honeypot.is&sz=64",
  },
  {
    id: "34l",
    name: "Bubblemaps",
    description: "代币持有者分布可视化",
    url: "https://bubblemaps.io",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=bubblemaps.io&sz=64",
  },
  {
    id: "34m",
    name: "GeckoTerminal",
    description: "DEX 代币价格追踪",
    url: "https://www.geckoterminal.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=geckoterminal.com&sz=64",
  },
  {
    id: "34n",
    name: "DexGuru",
    description: "多链 DEX 分析平台",
    url: "https://dex.guru",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=dex.guru&sz=64",
  },
  {
    id: "34o",
    name: "MoonScan",
    description: "BSC 代币分析工具",
    url: "https://moonscan.io",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=moonscan.io&sz=64",
  },
  {
    id: "34p",
    name: "CoinMarketCap",
    description: "币圈行情查询工具",
    url: "https://coinmarketcap.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=coinmarketcap.com&sz=64",
  },
  {
    id: "34q",
    name: "Coinglass",
    description: "合约数据",
    url: "https://www.coinglass.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=coinglass.com&sz=64",
    recommended: true,
  },
  {
    id: "34r",
    name: "AICoin",
    description: "K线查看工具",
    url: "https://www.aicoin.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=aicoin.com&sz=64",
  },
  {
    id: "34s",
    name: "TradingView",
    description: "专业交易者投资工具",
    url: "https://www.tradingview.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=tradingview.com&sz=64",
    recommended: true,
  },
  {
    id: "34t",
    name: "金十数据",
    description: "宏观数据",
    url: "https://www.jin10.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=jin10.com&sz=64",
  },
  {
    id: "34u",
    name: "CoinGecko",
    description: "加密货币价格追踪和市场数据",
    url: "https://www.coingecko.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=coingecko.com&sz=64",
  },
  {
    id: "34v",
    name: "Messari",
    description: "加密货币研究和数据平台",
    url: "https://messari.io",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=messari.io&sz=64",
  },
  {
    id: "34w",
    name: "Glassnode",
    description: "链上数据和分析平台",
    url: "https://glassnode.com",
    category: "analytics",
    icon: "https://www.google.com/s2/favicons?domain=glassnode.com&sz=64",
  },
  // 预测市场
  {
    id: "35",
    name: "Polymarket",
    description: "去中心化预测市场平台",
    url: "https://polymarket.com",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=polymarket.com&sz=64",
    recommended: true,
  },
  {
    id: "36",
    name: "Augur",
    description: "去中心化预测市场协议",
    url: "https://www.augur.net",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=augur.net&sz=64",
  },
  {
    id: "37",
    name: "Omen",
    description: "基于 Gnosis 的预测市场",
    url: "https://omen.eth.link",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=omen.eth.link&sz=64",
  },
  {
    id: "38",
    name: "PlotX",
    description: "无 Gas 预测市场平台",
    url: "https://plotx.io",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=plotx.io&sz=64",
  },
  {
    id: "39",
    name: "Azuro",
    description: "去中心化预测市场基础设施",
    url: "https://azuro.org",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=azuro.org&sz=64",
  },
  {
    id: "40a",
    name: "Manifold Markets",
    description: "去中心化预测市场",
    url: "https://manifold.markets",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=manifold.markets&sz=64",
  },
  {
    id: "40b",
    name: "Metaculus",
    description: "预测市场平台",
    url: "https://www.metaculus.com",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=metaculus.com&sz=64",
  },
  {
    id: "40c",
    name: "Kalshi",
    description: "受监管的预测市场交易平台",
    url: "https://kalshi.com",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=kalshi.com&sz=64",
    recommended: true,
  },
  {
    id: "40d",
    name: "Opinion",
    description: "预测市场平台",
    url: "https://opinion.com",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=opinion.com&sz=64",
    recommended: true,
  },
  // 土狗/Meme 平台
  {
    id: "48d",
    name: "GMGN",
    description: "Meme 币交易和分析平台",
    url: "https://gmgn.ai",
    category: "meme",
    icon: "https://www.google.com/s2/favicons?domain=gmgn.ai&sz=64",
    recommended: true,
  },
  {
    id: "48e",
    name: "PooCoin",
    description: "BSC 土狗币价格图表和追踪",
    url: "https://poocoin.app",
    category: "meme",
    icon: "https://www.google.com/s2/favicons?domain=poocoin.app&sz=64",
  },
  // 交易所
  {
    id: "49",
    name: "Binance",
    description: "全球最大的加密货币交易所",
    url: "https://www.binance.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=binance.com&sz=64",
    recommended: true,
  },

  {
    id: "51",
    name: "OKX",
    description: "全球知名加密货币交易所",
    url: "https://www.okx.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=okx.com&sz=64",
    recommended: true,
  },
  {
    id: "50",
    name: "Coinbase",
    description: "美国领先的加密货币交易所",
    url: "https://www.coinbase.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=coinbase.com&sz=64",
  },
  {
    id: "52",
    name: "Kraken",
    description: "安全可靠的加密货币交易所",
    url: "https://www.kraken.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=kraken.com&sz=64",
  },
  {
    id: "53",
    name: "Bybit",
    description: "专业衍生品交易平台",
    url: "https://www.bybit.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=bybit.com&sz=64",
  },
  {
    id: "54",
    name: "Gate.io",
    description: "全球加密货币交易平台",
    url: "https://www.gate.io",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=gate.io&sz=64",
  },
  {
    id: "55",
    name: "KuCoin",
    description: "全球加密货币交易所",
    url: "https://www.kucoin.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=kucoin.com&sz=64",
  },
  {
    id: "56",
    name: "Huobi",
    description: "全球数字资产交易平台",
    url: "https://www.huobi.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=huobi.com&sz=64",
  },
  {
    id: "57",
    name: "Bitget",
    description: "全球领先的加密货币衍生品交易平台",
    url: "https://www.bitget.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=bitget.com&sz=64",
  },
  {
    id: "57a",
    name: "MEXC",
    description: "全球加密货币交易所",
    url: "https://www.mexc.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=mexc.com&sz=64",
  },
  {
    id: "57b",
    name: "Bitfinex",
    description: "专业加密货币交易平台",
    url: "https://www.bitfinex.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=bitfinex.com&sz=64",
  },
  {
    id: "57c",
    name: "Crypto.com",
    description: "加密货币交易和支付平台",
    url: "https://crypto.com",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=crypto.com&sz=64",
  },
  {
    id: "57d",
    name: "dYdX",
    description: "去中心化衍生品交易所",
    url: "https://dydx.exchange",
    category: "exchange",
    icon: "https://www.google.com/s2/favicons?domain=dydx.exchange&sz=64",
  },
  // 币圈投研工具（媒体和投研平台）
  {
    id: "60",
    name: "rootdata",
    description: "投研工具",
    url: "https://rootdata.com",
    category: "research",
    icon: "https://www.google.com/s2/favicons?domain=rootdata.com&sz=64",
    recommended: true,
  },
  {
    id: "62",
    name: "区块律动",
    description: "最好用的币圈媒体",
    url: "https://www.theblockbeats.info",
    category: "research",
    icon: "https://www.google.com/s2/favicons?domain=theblockbeats.info&sz=64",
  },
  {
    id: "64",
    name: "星球日报",
    description: "快讯媒体",
    url: "https://www.odaily.news",
    category: "research",
    icon: "https://www.google.com/s2/favicons?domain=odaily.news&sz=64",
  },
  {
    id: "65",
    name: "Foresight News",
    description: "币圈媒体",
    url: "https://foresightnews.pro",
    category: "research",
    icon: "https://www.google.com/s2/favicons?domain=foresightnews.pro&sz=64",
    recommended: true,
  },
  {
    id: "66",
    name: "深潮",
    description: "币圈深度文章媒体",
    url: "https://techflowpost.mirror.xyz",
    category: "research",
    icon: "https://www.google.com/s2/favicons?domain=techflowpost.mirror.xyz&sz=64",
  },
  {
    id: "70",
    name: "PANews",
    description: "币圈媒体",
    url: "https://www.panewslab.com",
    category: "research",
    icon: "https://www.google.com/s2/favicons?domain=panewslab.com&sz=64",
    recommended: true,
  },
  {
    id: "73",
    name: "The Block",
    description: "区块链新闻和研究",
    url: "https://www.theblock.co",
    category: "research",
    icon: "https://www.google.com/s2/favicons?domain=theblock.co&sz=64",
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
    const matchesCategory =
      !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl dark:bg-blue-900/10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl dark:bg-indigo-900/10" />
      </div>

      {/* Header */}
      <SiteHeader />

      {/* Main Content - flex-1 to push footer to bottom */}
      <div className="flex-1">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 relative z-10">
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
          <h3 className="text-2xl font-bold text-black dark:text-white">
            分类
          </h3>
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
                  <div className={category.color}>{category.icon}</div>
                </div>
                <div className="whitespace-nowrap">
                  <h4
                    className={`text-sm font-bold ${
                      isSelected
                        ? "text-black dark:text-white"
                        : "text-black dark:text-white"
                    }`}
                  >
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
              ? `${categories.find((c) => c.id === selectedCategory)?.name} (${
                  filteredTools.length
                })`
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredTools.map((tool) => {
              return (
                <a
                  key={tool.id}
                  href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
                  className="group relative flex items-start gap-3 rounded-xl border border-black/10 bg-white/90 backdrop-blur-xl p-3 shadow-sm transition-all duration-200 hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-gray-950/90 dark:hover:border-white/20 cursor-pointer"
                >
                  {tool.recommended && (
                    <div className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 px-2 py-0.5 shadow-lg">
                      <span className="text-[10px] font-bold text-white">推荐</span>
                    </div>
                  )}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
            <Image
                      width={44}
                      height={44}
                      src={tool.icon as string}
                      alt={tool.name}
                      className="h-11 w-11 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-black dark:text-white line-clamp-1">
                        {tool.name}
                      </h4>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-0 transition-all group-hover:opacity-100 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 mt-0.5" />
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 backdrop-blur-sm mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              © 2026 Airdrop.uno 区块链工具导航平台.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
