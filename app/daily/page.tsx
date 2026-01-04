"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  Activity,
  BarChart3,
  AlertTriangle,
  Zap,
  Coins,
  TrendingUp as TrendingUpIcon,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import Image from "next/image";

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  icon: string;
}

interface MarketIndicator {
  name: string;
  value: number | string;
  change?: number;
  unit?: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// 映射图标组件（移到组件外部避免重复创建）
const iconMap: Record<string, React.ReactNode> = {
  "贪婪恐惧指数": <BarChart3 className="h-5 w-5" />,
  "AHR999": <TrendingUpIcon className="h-5 w-5" />,
  "山寨季指数": <Coins className="h-5 w-5" />,
  "全网爆仓": <AlertTriangle className="h-5 w-5" />,
  "USDT 活期利率": <Percent className="h-5 w-5" />,
  "BTC 主导地位": <Activity className="h-5 w-5" />,
  "DeFi TVL": <Zap className="h-5 w-5" />,
  "稳定币市值": <DollarSign className="h-5 w-5" />,
};

export default function DailyPage() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const response = await fetch("/api/daily");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      // 为每个指标添加图标
      const indicatorsWithIcons = data.marketIndicators.map(
        (indicator: Omit<MarketIndicator, "icon">) => ({
          ...indicator,
          icon: iconMap[indicator.name] || <BarChart3 className="h-5 w-5" />,
        })
      );

      setCryptoPrices(data.cryptoPrices);
      setMarketIndicators(indicatorsWithIcons);
    } catch (err) {
      console.error("Error fetching daily data:", err);
      if (!isSilent) {
        setError("获取数据失败，请稍后重试");
      }
    } finally {
      if (!isSilent) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    // 初始加载
    fetchData(false);

    // 倒计时和自动刷新
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // 倒计时结束，静默刷新数据
          fetchData(true);
          return 60; // 重置倒计时
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [fetchData]);

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(2);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10" />
      </div>

      {/* Header */}
      <SiteHeader />

      {/* Main Content - flex-1 to push footer to bottom */}
      <main className="flex-1 relative z-10 pt-8 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Refresh Countdown */}
          {!loading && (
            <div className="mb-6 flex items-center justify-end">
              <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-gray-950/90 dark:text-gray-400">
                {isRefreshing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>更新中...</span>
                  </>
                ) : (
                  <>
                    <span>下次更新：</span>
                    <span className="font-bold text-black dark:text-white">{countdown}s</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Crypto Prices Section */}
              <section className="mb-12">
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                  {cryptoPrices.map((crypto) => (
                <div
                  key={crypto.symbol}
                  className="rounded-xl border border-black/10 bg-white/90 backdrop-blur-xl p-6 shadow-sm transition-all duration-200 hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-gray-950/90 dark:hover:border-white/20"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden">
                        {crypto.icon ? (
                          <Image
                            src={crypto.icon}
                            alt={crypto.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain"
                            unoptimized
                          />
                        ) : (
                          <span className="text-2xl">{crypto.symbol}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black dark:text-white">
                          {crypto.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {crypto.symbol}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 ${
                        crypto.change24h >= 0
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {crypto.change24h >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {crypto.change24h >= 0 ? "+" : ""}
                        {crypto.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        价格
                      </p>
                      <p className="text-2xl font-bold text-black dark:text-white">
                        {formatPrice(crypto.price)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          24h 成交量
                        </p>
                        <p className="text-sm font-semibold text-black dark:text-white">
                          ${formatNumber(crypto.volume24h)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          市值
                        </p>
                        <p className="text-sm font-semibold text-black dark:text-white">
                          ${formatNumber(crypto.marketCap)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                  ))}
                </div>
              </section>

              {/* Market Indicators Section */}
              <section>
                <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                  市场指标
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {marketIndicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-black/10 bg-white/90 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-gray-950/90 dark:hover:border-white/20"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ${indicator.color}`}
                        >
                          {indicator.icon}
                        </div>
                        {indicator.change !== undefined && (
                          <div
                            className={`flex items-center gap-1 text-xs font-semibold ${
                              indicator.change >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {indicator.change >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {indicator.change >= 0 ? "+" : ""}
                            {typeof indicator.change === "number"
                              ? indicator.change.toFixed(2)
                              : indicator.change}
                            {indicator.unit?.includes("%") ? "%" : ""}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {indicator.name}
                        </p>
                        <p className="mb-1 text-2xl font-bold text-black dark:text-white">
                          {typeof indicator.value === "number"
                            ? indicator.value.toFixed(2)
                            : indicator.value}
                          {indicator.unit && (
                            <span className="ml-1 text-sm font-normal text-gray-600 dark:text-gray-400">
                              {indicator.unit}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {indicator.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

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

