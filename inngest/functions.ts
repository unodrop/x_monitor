import { inngest } from "@/lib/inngest";
import { supabaseAdmin } from "@/db";
import { checkAndSendTweetsForTarget } from "@/lib/monitor-utils";
import { parseRSS, formatRSSItemsForTelegram } from "@/lib/rss";
import { sendTelegramHTMLMessage } from "@/lib/telegram";
import { formatDailyDataForTelegram } from "@/lib/daily-format";
import { getDailyMetrics } from "@/lib/daily-metrics";

/**
 * KOL 推文监控定时任务
 * 每 3 小时执行一次，检查所有活跃的监控目标
 */
export const checkTweetsFunction = inngest.createFunction(
  {
    id: "check-tweets",
    name: "Check KOL Tweets",
    retries: 2,
  },
  {
    cron: "0 */3 * * *", // 每 3 小时执行一次
  },
  async ({ step }) => {
    return await step.run("check-and-send-tweets", async () => {
      try {
        // 获取所有活跃的监控目标
        const { data: targets, error: targetsError } = await supabaseAdmin
          .from("monitor_targets")
          .select(`
            *,
            notification_configs (
              id,
              name,
              channel_type,
              webhook_url,
              config_json
            )
          `)
          .eq("status", "active")
          .not("notification_config_id", "is", null);

        if (targetsError) {
          console.error("Error fetching monitor targets:", targetsError);
          throw new Error("Failed to fetch monitor targets");
        }

        if (!targets || targets.length === 0) {
          return {
            success: true,
            message: "No active monitor targets found",
            processed: 0,
          };
        }

        // 并发处理所有监控目标
        const results = await Promise.allSettled(
          targets.map((target) =>
            checkAndSendTweetsForTarget(target).then(
              (result) => ({
                target,
                result,
              })
            )
          )
        );

        let processed = 0;
        let newTweetsCount = 0;
        const errors: string[] = [];

        // 处理结果
        results.forEach((settledResult, index) => {
          processed++;

          if (settledResult.status === "fulfilled") {
            const { target, result } = settledResult.value;

            if (!result.success) {
              errors.push(
                `Target ${target.name} (@${target.x_handle}): ${result.error || "Failed to check tweets"}`
              );
            } else {
              if (result.tweetsSent && result.tweetsSent > 0) {
                newTweetsCount += result.tweetsSent;
              }
            }
          } else {
            // Promise 被拒绝的情况
            const target = targets[index];
            errors.push(
              `Target ${target?.name || "Unknown"} (@${target?.x_handle || "Unknown"}): ${settledResult.reason instanceof Error ? settledResult.reason.message : "Unknown error"}`
            );
          }
        });

        return {
          success: true,
          message: "Tweet monitoring completed",
          processed,
          newTweetsCount,
          errors: errors.length > 0 ? errors : undefined,
        };
      } catch (error) {
        console.error("Cron job error:", error);
        throw error;
      }
    });
  }
);

/**
 * 每日新闻推送定时任务
 * 每天 00:00 UTC 执行
 */
export const dailyNewsFunction = inngest.createFunction(
  {
    id: "daily-news",
    name: "Daily News RSS Push",
    retries: 2,
  },
  {
    cron: "0 0 * * *", // 每天 00:00 UTC
  },
  async ({ step }) => {
    return await step.run("send-daily-news", async () => {
      try {
        // 检查环境变量
        const botToken = process.env.X_MONITOR_BOT_TOKEN;
        const chatId = process.env.X_MONITOR_CHAT_ID;
        const topicId = process.env.X_MONITOR_TOPIC_ID
          ? Number(process.env.X_MONITOR_TOPIC_ID)
          : 54;

        if (!botToken || !chatId) {
          throw new Error(
            "X_MONITOR_BOT_TOKEN and X_MONITOR_CHAT_ID are required"
          );
        }

        // 解析 RSS
        const rssUrl =
          process.env.RSS_FEED_URL || "https://openai.com/news/rss.xml";
        const feed = await parseRSS(rssUrl);

        if (feed.items.length === 0) {
          return {
            success: true,
            message: "No new items in RSS feed",
          };
        }

        // 格式化 RSS 内容为 Telegram 消息
        const message = formatRSSItemsForTelegram(feed.items);

        // 发送到指定的 Telegram 群组/话题
        const result = await sendTelegramHTMLMessage(
          {
            botToken,
            chatId,
            topicId,
          },
          message
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to send message");
        }

        return {
          success: true,
          message: "News sent successfully",
          messageId: result.messageId,
          feedTitle: feed.title,
          itemsCount: feed.items.length,
        };
      } catch (error) {
        console.error("Cron job error:", error);
        throw error;
      }
    });
  }
);

/**
 * 每日加密日报推送定时任务
 * 每天早上 10:00 (UTC+8) = 02:00 UTC 执行
 */
export const dailyMetricsFunction = inngest.createFunction(
  {
    id: "daily-metrics",
    name: "Daily Crypto Metrics Push",
    retries: 2,
  },
  {
    cron: "0 2 * * *", // 每天 02:00 UTC (对应 UTC+8 的 10:00)
  },
  async ({ step }) => {
    return await step.run("send-daily-metrics", async () => {
      try {
        // 检查环境变量
        const botToken = process.env.X_MONITOR_BOT_TOKEN;
        const chatId = process.env.X_MONITOR_CHAT_ID;
        const topicId = process.env.X_MONITOR_TOPIC_ID
          ? Number(process.env.X_MONITOR_TOPIC_ID)
          : undefined;

        if (!botToken || !chatId) {
          throw new Error(
            "X_MONITOR_BOT_TOKEN and X_MONITOR_CHAT_ID are required"
          );
        }

        // 获取日报数据
        const data = await getDailyMetrics();

        // 格式化日报数据为 Telegram 消息
        const message = formatDailyDataForTelegram(
          data.cryptoPrices,
          data.marketIndicators
        );

        // 发送到指定的 Telegram 群组/话题
        const result = await sendTelegramHTMLMessage(
          {
            botToken,
            chatId,
            topicId,
          },
          message
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to send message");
        }

        return {
          success: true,
          message: "Daily metrics sent successfully",
          messageId: result.messageId,
          cryptoCount: data.cryptoPrices.length,
          indicatorCount: data.marketIndicators.length,
        };
      } catch (error) {
        console.error("Daily metrics cron job error:", error);
        throw error;
      }
    });
  }
);