/**
 * RSS 解析工具函数
 */

import Parser from "rss-parser";

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid?: string;
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}

// 创建 RSS 解析器实例
const parser = new Parser({
  customFields: {
    item: [
      ["guid", "guid"],
    ],
  },
  headers: {
    "User-Agent": "X-Monitor RSS Reader/1.0",
  },
});

/**
 * 解析 RSS XML 内容
 */
export async function parseRSS(url: string): Promise<RSSFeed> {
  try {
    // 使用 rss-parser 解析 RSS feed
    const feed = await parser.parseURL(url);

    // 转换格式
    const items: RSSItem[] = (feed.items || []).slice(0, 10).map((item) => {
      // rss-parser 的 Item 类型可能不包含所有字段，使用类型扩展
      const extendedItem = item as Parser.Item & {
        description?: string;
        guid?: string;
        id?: string;
      };
      return {
        title: item.title || "",
        description: item.contentSnippet || item.content || extendedItem.description || "",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || "",
        guid: extendedItem.guid || extendedItem.id || undefined,
      };
    });

    return {
      title: feed.title || "RSS Feed",
      description: feed.description || feed.summary || "",
      link: feed.link || url,
      items,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse RSS feed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * 格式化 RSS 内容为 Telegram 消息
 */
export function formatRSSItemsForTelegram(items: RSSItem[]): string {
  if (items.length === 0) {
    return "📰 今日暂无新内容";
  }

  let message = `📰 <b>今日AI热点</b>\n\n`;
  
  items.forEach((item, index) => {
    if (item.link && item.title) {
      // 标题使用粗体，链接可点击
      message += `<b>${index + 1}.</b> <b><a href="${item.link}">${item.title}</a></b>\n\n`;
    } else if (item.title) {
      message += `<b>${index + 1}.</b> <b>${item.title}</b>\n\n`;
    }
  });

  return message.trim();
}
