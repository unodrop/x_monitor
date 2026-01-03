/**
 * 监控工具函数
 * 用于处理单个监控目标的推文检查和通知发送
 */

import { supabaseAdmin } from "@/db";
import { getUserTweets, formatTweetForTelegram } from "@/lib/twitter";
import { sendNotification } from "@/lib/notifications";
import { isAirdropRelated } from "@/lib/airdrop-filter";
import { MonitorTarget, NotificationConfig } from "@/db/types";

interface CheckAndSendTweetsResult {
  success: boolean;
  tweetsSent?: number;
  error?: string;
}

/**
 * 检查并发送单个监控目标的新推文
 * @param target - 监控目标（包含 notification_configs）
 */
export async function checkAndSendTweetsForTarget(
  target: MonitorTarget & { notification_configs: NotificationConfig | null }
): Promise<CheckAndSendTweetsResult> {
  try {
    const notificationConfig = target.notification_configs;

    // 如果没有配置通知渠道，跳过
    if (!notificationConfig || Array.isArray(notificationConfig)) {
      return {
        success: true,
        tweetsSent: 0,
        error: "No notification config",
      };
    }

    // 检查 rest_id
    if (!target.rest_id) {
      return {
        success: false,
        error: "rest_id is missing",
      };
    }

    // 获取用户推文
    const tweetsResult = await getUserTweets(target.rest_id, {
      maxResults: 10,
    });
    if (!tweetsResult.success || !tweetsResult.tweets) {
      return {
        success: false,
        error: tweetsResult.error || "Failed to get tweets",
      };
    }

    if (tweetsResult.tweets.length === 0) {
      return {
        success: true,
        tweetsSent: 0,
      };
    }

    // 按时间倒序排序（确保最新的在前）
    const sortedTweets = [...tweetsResult.tweets].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeB - timeA;
    });

    // 获取最新的推文 ID（用于更新数据库）
    const latestTweetId = sortedTweets[0].id;

    // 过滤出新的推文（比较 ID）
    // 推文 ID 通常是数字字符串，需要正确比较
    const newTweets = sortedTweets.filter((tweet) => {
      if (!target.last_tweet_id) {
        return true; // 如果没有 last_tweet_id，取所有推文
      }
      // 将 ID 转换为 BigInt 进行比较，支持大数字
      try {
        const tweetId = BigInt(tweet.id);
        const lastId = BigInt(target.last_tweet_id);
        return tweetId > lastId;
      } catch {
        // 如果转换失败，使用字符串比较
        return String(tweet.id) > String(target.last_tweet_id);
      }
    });

    // 如果是首次监控，处理所有新推文（不限制数量，可以多处理一些）
    // 非首次监控，也处理所有新推文
    const tweetsToCheck = newTweets;

    // 过滤掉回复和转发类型的推文（不推送回复和转发）
    // 严格检查：in_reply_to_status_id 必须为 null 或 undefined
    // 空字符串 "" 表示是回复（当有 in_reply_to_user_id_str 但没有 status_id 时）
    // "RT" 表示是转发
    const nonReplyTweets = tweetsToCheck.filter(
      (tweet) => {
        const replyId = tweet.in_reply_to_status_id;
        // 如果 replyId 为 null 或 undefined，说明不是回复也不是转发
        // 如果 replyId 存在（包括空字符串 "" 或 "RT"），说明是回复或转发，需要过滤掉
        return replyId === null || replyId === undefined;
      }
    );

    // 使用 DeepSeek AI 判断每条推文是否与空投相关
    // 并发检查所有推文，提高效率
    const airdropCheckResults = await Promise.allSettled(
      nonReplyTweets.map(async (tweet) => ({
        tweet,
        isAirdrop: await isAirdropRelated(tweet),
      }))
    );

    // 过滤出空投相关的推文
    const airdropTweets: typeof nonReplyTweets = [];
    for (const result of airdropCheckResults) {
      if (result.status === "fulfilled" && result.value.isAirdrop) {
        airdropTweets.push(result.value.tweet);
      } else if (result.status === "rejected") {
        console.error("Failed to check airdrop for tweet:", result.reason);
      }
    }

    // 无论是否首次监控，都更新 last_tweet_id 为最新的推文 ID
    // 这样下次检查时可以从最新位置开始，避免重复检查
    if (sortedTweets.length > 0) {
      await supabaseAdmin
        .from("monitor_targets")
        .update({ last_tweet_id: latestTweetId })
        .eq("id", target.id);
    }

    // 如果没有空投相关的推文，直接返回
    if (airdropTweets.length === 0) {
      return {
        success: true,
        tweetsSent: 0,
      };
    }

    // 获取用户信息
    const user = tweetsResult.users?.[0] || {
      id: target.rest_id,
      username: target.x_handle,
      name: target.name,
    };

    // 并发发送所有空投相关推文的通知
    const notificationResults = await Promise.allSettled(
      airdropTweets.map((tweet) => {
        const message = formatTweetForTelegram(tweet, user);
        return sendNotification(notificationConfig, message).then((result) => ({
          tweetId: tweet.id,
          result,
        }));
      })
    );

    // 统计成功发送的数量
    let tweetsSent = 0;
    for (const settledResult of notificationResults) {
      if (settledResult.status === "fulfilled") {
        const { tweetId, result } = settledResult.value;
        if (result.success) {
          tweetsSent++;
        } else {
          console.error(
            `Failed to send notification for tweet ${tweetId}:`,
            result.error
          );
        }
      } else {
        // Promise 被拒绝的情况
        console.error(
          `Failed to send notification:`,
          settledResult.reason
        );
      }
    }

    return {
      success: true,
      tweetsSent,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

