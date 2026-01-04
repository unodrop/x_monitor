import { NextResponse } from "next/server";

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
  color: string;
}

/**
 * GET /api/daily
 * 获取加密货币日报数据
 */
export async function GET() {
  try {
    // 获取主流币种价格数据（使用 CoinGecko API）
    const coinIds = ["bitcoin", "ethereum", "solana"];
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
    const marketDataUrl = `https://api.coingecko.com/api/v3/coins/markets?ids=${coinIds.join(",")}&vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false`;

    // 并行请求加密货币价格和市场数据
    const [coinGeckoResponse, marketDataResponse] = await Promise.all([
      fetch(coinGeckoUrl, {
        next: { revalidate: 60 }, // 缓存 60 秒
      }),
      fetch(marketDataUrl, {
        next: { revalidate: 60 },
      }),
    ]);

    if (!coinGeckoResponse.ok) {
      const errorText = await coinGeckoResponse.text().catch(() => "Unknown error");
      console.error("[API Error] Failed to fetch crypto prices:", {
        url: coinGeckoUrl,
        status: coinGeckoResponse.status,
        statusText: coinGeckoResponse.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch crypto prices: ${coinGeckoResponse.status} ${coinGeckoResponse.statusText}`);
    }

    if (!marketDataResponse.ok) {
      const errorText = await marketDataResponse.text().catch(() => "Unknown error");
      console.error("[API Error] Failed to fetch market data:", {
        url: marketDataUrl,
        status: marketDataResponse.status,
        statusText: marketDataResponse.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch market data: ${marketDataResponse.status} ${marketDataResponse.statusText}`);
    }

    const [coinGeckoData, marketData] = await Promise.all([
      coinGeckoResponse.json(),
      marketDataResponse.json(),
    ]);

    // 映射币种中文名称
    const coinNameMap: Record<string, string> = {
      bitcoin: "比特币",
      ethereum: "以太坊",
      solana: "Solana",
    };

    // 构建加密货币价格数据
    const cryptoPrices: CryptoPrice[] = coinIds.map((id) => {
      const data = coinGeckoData[id];
      const market = marketData.find((m: { id: string }) => m.id === id);

      return {
        symbol: id === "bitcoin" ? "BTC" : id === "ethereum" ? "ETH" : "SOL",
        name: coinNameMap[id] || market?.name || id,
        price: data.usd || 0,
        change24h: data.usd_24h_change || 0,
        volume24h: market?.total_volume || 0,
        marketCap: data.usd_market_cap || 0,
        icon: market?.image || "",
      };
    });

    // 并行请求所有市场指标 API
    const [
      fngResponse,
      dominanceResponse,
      defiResponse,
      stablecoinResponse,
    ] = await Promise.allSettled([
      // 贪婪恐惧指数
      fetch("https://api.alternative.me/fng/?limit=2", {
        next: { revalidate: 3600 },
      }),
      // BTC 主导地位
      fetch("https://api.coingecko.com/api/v3/global", {
        next: { revalidate: 300 },
      }),
      // DeFi TVL
      fetch("https://api.llama.fi/v2/chains", {
        next: { revalidate: 300 },
      }),
      // 稳定币市值
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=stablecoins&order=market_cap_desc&per_page=10&page=1",
        {
          next: { revalidate: 300 },
        }
      ),
    ]);

    // 处理贪婪恐惧指数
    let fearGreedIndex = 50;
    let fearGreedChange = 0;
    if (fngResponse.status === "fulfilled" && fngResponse.value.ok) {
      try {
        const fngData = await fngResponse.value.json();
        if (fngData.data && fngData.data.length > 0) {
          fearGreedIndex = parseInt(fngData.data[0].value);
          if (fngData.data.length > 1) {
            fearGreedChange = fearGreedIndex - parseInt(fngData.data[1].value);
          }
        }
      } catch (error) {
        console.error("[API Error] Error parsing fear & greed index:", error);
      }
    } else {
      const reason = fngResponse.status === "rejected" ? fngResponse.reason : "Response not OK";
      const status = fngResponse.status === "fulfilled" ? fngResponse.value.status : "N/A";
      console.error("[API Error] Failed to fetch fear & greed index:", {
        url: "https://api.alternative.me/fng/?limit=2",
        status,
        reason: reason instanceof Error ? reason.message : String(reason),
      });
    }

    // 处理 BTC 主导地位
    let btcDominance = 52.8;
    const btcDominanceChange = 0;
    if (dominanceResponse.status === "fulfilled" && dominanceResponse.value.ok) {
      try {
        const dominanceData = await dominanceResponse.value.json();
        if (dominanceData.data?.market_cap_percentage?.btc) {
          btcDominance = dominanceData.data.market_cap_percentage.btc;
        }
      } catch (error) {
        console.error("[API Error] Error parsing BTC dominance:", error);
      }
    } else {
      const reason = dominanceResponse.status === "rejected" ? dominanceResponse.reason : "Response not OK";
      const status = dominanceResponse.status === "fulfilled" ? dominanceResponse.value.status : "N/A";
      console.error("[API Error] Failed to fetch BTC dominance:", {
        url: "https://api.coingecko.com/api/v3/global",
        status,
        reason: reason instanceof Error ? reason.message : String(reason),
      });
    }

    // 处理 DeFi TVL
    let defiTvl = 0;
    const defiTvlChange = 0;
    if (defiResponse.status === "fulfilled" && defiResponse.value.ok) {
      try {
        const defiData = await defiResponse.value.json();
        if (Array.isArray(defiData)) {
          defiTvl = defiData.reduce(
            (sum: number, chain: { tvl?: number }) => sum + (chain.tvl || 0),
            0
          );
        }
      } catch (error) {
        console.error("[API Error] Error parsing DeFi TVL:", error);
      }
    } else {
      const reason = defiResponse.status === "rejected" ? defiResponse.reason : "Response not OK";
      const status = defiResponse.status === "fulfilled" ? defiResponse.value.status : "N/A";
      console.error("[API Error] Failed to fetch DeFi TVL:", {
        url: "https://api.llama.fi/v2/chains",
        status,
        reason: reason instanceof Error ? reason.message : String(reason),
      });
    }
    // 如果无法获取真实 DeFi TVL，保持为 0
    // 不使用估算值

    // 处理稳定币市值
    let stablecoinMarketCap = 0;
    const stablecoinChange = 0;
    if (stablecoinResponse.status === "fulfilled" && stablecoinResponse.value.ok) {
      try {
        const stablecoinData = await stablecoinResponse.value.json();
        stablecoinMarketCap = stablecoinData.reduce(
          (sum: number, coin: { market_cap?: number }) => sum + (coin.market_cap || 0),
          0
        );
      } catch (error) {
        console.error("[API Error] Error parsing stablecoin market cap:", error);
      }
    } else {
      const reason = stablecoinResponse.status === "rejected" ? stablecoinResponse.reason : "Response not OK";
      const status = stablecoinResponse.status === "fulfilled" ? stablecoinResponse.value.status : "N/A";
      console.error("[API Error] Failed to fetch stablecoin market cap:", {
        url: "https://api.coingecko.com/api/v3/coins/markets?category=stablecoins",
        status,
        reason: reason instanceof Error ? reason.message : String(reason),
      });
    }
    // 如果无法获取真实稳定币市值，保持为 0
    // 不使用估算值

    // 构建市场指标数据
    const marketIndicators: MarketIndicator[] = [
      {
        name: "贪婪恐惧指数",
        value: fearGreedIndex,
        change: fearGreedChange,
        unit: "/100",
        description: "市场情绪指标",
        color: "text-orange-600 dark:text-orange-400",
      },
      // AHR999 指标已移除 - 需要复杂的历史数据计算，无法从免费 API 获取真实数据
      // 山寨季指数指标已移除 - 需要复杂的历史数据计算，无法从免费 API 获取真实数据
      // 全网爆仓指标已移除 - 没有可用的免费公共 API 提供真实数据
      // USDT 活期利率指标已移除 - 没有可用的免费公共 API 提供真实数据
      {
        name: "BTC 主导地位",
        value: Number(btcDominance.toFixed(1)),
        unit: "%",
        change: Number(btcDominanceChange.toFixed(1)),
        description: "BTC 市值占比",
        color: "text-amber-600 dark:text-amber-400",
      },
      {
        name: "DeFi TVL",
        value: `${(defiTvl / 1e9).toFixed(1)}B`,
        unit: "USD",
        change: Number(defiTvlChange.toFixed(1)),
        description: "DeFi 总锁仓价值",
        color: "text-cyan-600 dark:text-cyan-400",
      },
      {
        name: "稳定币市值",
        value: `${(stablecoinMarketCap / 1e9).toFixed(1)}B`,
        unit: "USD",
        change: Number(stablecoinChange.toFixed(1)),
        description: "稳定币总市值",
        color: "text-emerald-600 dark:text-emerald-400",
      },
    ];

    return NextResponse.json({
      cryptoPrices,
      marketIndicators,
    });
  } catch (error) {
    console.error("[API Error] Error fetching daily data:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch daily data" },
      { status: 500 }
    );
  }
}

