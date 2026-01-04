"use client";

import {
  ExternalLink,
  BarChart3,
  TrendingUp,
  CreditCard,
  Bot,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AirdropProject {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  featured?: boolean;
  xUrl?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  {
    id: "prediction",
    name: "预测市场",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    id: "perpdex",
    name: "Perp DEX",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "banking",
    name: "数字银行与支付",
    icon: <CreditCard className="h-5 w-5" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "ai",
    name: "AI 与机器人",
    icon: <Bot className="h-5 w-5" />,
    color: "text-violet-600 dark:text-violet-400",
  },
];

const airdropProjects: AirdropProject[] = [
  // 预测市场
  {
    id: "1",
    name: "Polymarket",
    description: "去中心化预测市场平台",
    url: "https://polymarket.com",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=polymarket.com&sz=64",
    featured: true,
    xUrl: "https://x.com/Polymarket",
  },
  {
    id: "2",
    name: "Kalshi",
    description: "受监管的预测市场交易平台",
    url: "https://kalshi.com",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=kalshi.com&sz=64",
    featured: true,
    xUrl: "https://x.com/Kalshi",
  },
  {
    id: "3",
    name: "Opinion Labs",
    description: "预测市场平台",
    url: "https://opinionlabs.xyz",
    category: "prediction",
    icon: "https://www.google.com/s2/favicons?domain=opinionlabs.xyz&sz=64",
    featured: true,
    xUrl: "https://x.com/opinionlabsxyz",
  },
  // Perp DEX
  {
    id: "4",
    name: "Variational",
    description: "去中心化永续合约交易平台",
    url: "https://variational.io",
    category: "perpdex",
    icon: "https://www.google.com/s2/favicons?domain=variational.io&sz=64",
    featured: true,
    xUrl: "https://x.com/variational_io",
  },
  {
    id: "5",
    name: "Nado",
    description: "去中心化衍生品交易平台",
    url: "https://nado.xyz",
    category: "perpdex",
    icon: "https://www.google.com/s2/favicons?domain=nado.xyz&sz=64",
    featured: true,
    xUrl: "https://x.com/nadoHQ",
  },
  {
    id: "6",
    name: "Cascade",
    description: "去中心化永续合约交易所",
    url: "https://cascade.xyz",
    category: "perpdex",
    icon: "https://www.google.com/s2/favicons?domain=cascade.xyz&sz=64",
    featured: true,
    xUrl: "https://x.com/cascade_xyz",
  },
  // 数字银行与支付
  {
    id: "7",
    name: "Tria",
    description: "数字银行与支付解决方案",
    url: "https://tria.co",
    category: "banking",
    icon: "https://www.google.com/s2/favicons?domain=tria.co&sz=64",
    featured: true,
    xUrl: "https://x.com/useTria",
  },
  {
    id: "8",
    name: "KAST",
    description: "数字银行平台",
    url: "https://kast.xyz",
    category: "banking",
    icon: "https://www.google.com/s2/favicons?domain=kast.xyz&sz=64",
    featured: true,
    xUrl: "https://x.com/KASTxyz",
  },
  {
    id: "9",
    name: "Rain Cards",
    description: "数字支付卡服务",
    url: "https://raincards.com",
    category: "banking",
    icon: "https://www.google.com/s2/favicons?domain=raincards.com&sz=64",
    featured: true,
    xUrl: "https://x.com/raincards",
  },
  // AI 与机器人
  {
    id: "10",
    name: "OpenMind AGI",
    description: "通用人工智能研究平台",
    url: "https://x.com/openmind_agi",
    category: "ai",
    icon: "https://pbs.twimg.com/profile_images/2003248356898811904/QhOkyp-u_400x400.jpg",
    featured: true,
    xUrl: "https://x.com/openmind_agi",
  },
  {
    id: "11",
    name: "GoKite AI",
    description: "AI 工具与自动化平台",
    url: "https://gokite.ai",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=gokite.ai&sz=64",
    featured: true,
    xUrl: "https://x.com/GoKiteAI",
  },
  {
    id: "12",
    name: "Flock",
    description: "AI 机器人协作平台",
    url: "https://flock.io",
    category: "ai",
    icon: "https://www.google.com/s2/favicons?domain=flock.io&sz=64",
    featured: true,
    xUrl: "https://x.com/flock_io",
  },
];

export default function AirdropsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10" />
      </div>

      {/* Content */}
      <main className="relative z-10 pt-16 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Page Header Section */}
          <div className="mb-12">

            {/* Title and Description */}
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
                优质空投项目
              </h1>
              <p className="mx-auto max-w-2xl text-lg font-medium text-gray-600 dark:text-gray-400">
                精选优质区块链空投项目，按分类整理，助您把握早期机会
              </p>
            </div>
          </div>
          {categories.map((category) => {
            const categoryProjects = airdropProjects.filter(
              (project) => project.category === category.id
            );

            if (categoryProjects.length === 0) return null;

            return (
              <section key={category.id} className="mb-12">
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ${category.color}`}
                  >
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    {category.name}
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {categoryProjects.map((project) => {
                    return (
                      <div
                        key={project.id}
                        className="group relative flex items-start gap-3 rounded-xl border border-black/10 bg-white/90 backdrop-blur-xl p-3 shadow-sm transition-all duration-200 hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-gray-950/90 dark:hover:border-white/20"
                      >
                        {project.featured && (
                          <div className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 px-2 py-0.5 shadow-lg">
                            <span className="text-[10px] font-bold text-white">
                              重点
                            </span>
                          </div>
                        )}
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-start gap-3 cursor-pointer"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
                            <Image
                              width={44}
                              height={44}
                              src={project.icon}
                              alt={project.name}
                              className="h-11 w-11 object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-bold text-black dark:text-white line-clamp-1">
                                {project.name}
                              </h4>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-0 transition-all group-hover:opacity-100 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 mt-0.5" />
                            </div>
                            <p className="text-xs font-medium leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </a>
                        {project.xUrl && (
                          <a
                            href={project.xUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white/90 text-gray-600 transition-all duration-200 hover:border-black/20 hover:bg-white hover:text-black hover:shadow-sm dark:border-white/10 dark:bg-gray-950/90 dark:text-gray-400 dark:hover:border-white/20 dark:hover:bg-gray-950 dark:hover:text-white"
                            title="访问 X 主页"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/60 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-black to-gray-900 dark:from-white dark:to-gray-100">
                <span className="text-sm font-bold text-white dark:text-black">
                  X
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                © 2026 Airdrop.uno 区块链工具导航平台.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="cursor-pointer">
                回到首页
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
