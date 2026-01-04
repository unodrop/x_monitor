/**
 * 格式化日报数据为 Telegram 消息
 */

import type { CryptoPrice, MarketIndicator } from "./daily-metrics";

/**
 * 格式化数字（添加正负号和颜色）
 */
function formatChange(change: number | undefined): string {
  if (change === undefined || change === 0) return "";
  const sign = change > 0 ? "+" : "";
  const emoji = change > 0 ? "📈" : "📉";
  return `${emoji} ${sign}${change.toFixed(2)}`;
}

/**
 * 格式化价格
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * 格式化大数字（K, M, B, T）
 */
function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}

/**
 * 格式化日报数据为 Telegram HTML 消息
 */
export function formatDailyDataForTelegram(
  cryptoPrices: CryptoPrice[],
  marketIndicators: MarketIndicator[]
): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  let message = `<b>📊 加密日报 - ${dateStr}</b>\n\n`;

  // 主流币种价格
  message += `<b>💰 主流币种</b>\n`;
  message += `━━━━━━━━━━━━━━━━\n`;
  for (const crypto of cryptoPrices) {
    const changeStr = formatChange(crypto.change24h);
    const priceStr = formatPrice(crypto.price);
    const volumeStr = formatNumber(crypto.volume24h);
    const marketCapStr = formatNumber(crypto.marketCap);

    message += `<b>${crypto.name} (${crypto.symbol})</b>\n`;
    message += `价格: <code>${priceStr}</code> ${changeStr}\n`;
    message += `24h 成交量: <code>$${volumeStr}</code>\n`;
    message += `市值: <code>$${marketCapStr}</code>\n\n`;
  }

  // 市场指标
  message += `<b>📈 市场指标</b>\n`;
  message += `━━━━━━━━━━━━━━━━\n`;
  for (const indicator of marketIndicators) {
    const valueStr =
      typeof indicator.value === "number"
        ? indicator.value.toFixed(2)
        : indicator.value;
    const unitStr = indicator.unit ? ` ${indicator.unit}` : "";
    const changeStr = formatChange(indicator.change);

    message += `<b>${indicator.name}</b>\n`;
    message += `数值: <code>${valueStr}${unitStr}</code> ${changeStr}\n`;
    message += `<i>${indicator.description}</i>\n\n`;
  }

  message += `━━━━━━━━━━━━━━━━\n`;
  message += `<i>数据来源: CoinGecko, Alternative.me, DefiLlama</i>\n`;
  message += `<i>更新时间: ${now.toLocaleTimeString("zh-CN", { hour12: false })}</i>`;

  return message;
}

