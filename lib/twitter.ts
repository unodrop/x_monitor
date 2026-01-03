/**
 * RapidAPI Twitter/X API 客户端
 */

import axios from "axios";
import { rapidapiRequest } from "./request";

interface TwitterUser {
  id: string;
  rest_id?: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  in_reply_to_status_id?: string | null; // 回复的推文 ID，如果存在则说明是回复类型
  public_metrics?: {
    retweet_count?: number;
    like_count?: number;
    reply_count?: number;
    quote_count?: number;
  };
  entities?: {
    urls?: Array<{
      url: string;
      expanded_url: string;
      display_url: string;
    }>;
  };
}


/**
 * 验证用户是否存在
 */
export async function verifyUserExists(
  username: string
): Promise<{
  success: boolean;
  user?: {
    id: string;
    rest_id: string;
    username: string;
    name: string;
  };
  error?: string;
}> {
  try {
    const response = await rapidapiRequest({
      method: "GET",
      url: `/user?username=${encodeURIComponent(username)}`,
    });

    const responseData = response.data;

    // 解析嵌套的 JSON 结构
    // 结构: result.data.user.result
    const userResult = responseData?.result?.data?.user?.result;

    if (!userResult) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // 提取 rest_id 和其他信息
    const restId = userResult.rest_id;
    const core = userResult.core || {};
    const legacy = userResult.legacy || {};

    if (!restId) {
      return {
        success: false,
        error: "User rest_id not found in response",
      };
    }

    // 从 core.name 获取名称（根据提供的 API 格式）
    const userName = core.name || legacy.name || username;

    return {
      success: true,
      user: {
        id: userResult.id || "",
        rest_id: restId,
        username: core.screen_name || username,
        name: userName,
      },
    };
  } catch (error: unknown) {
    // axios 错误处理
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "User not found",
        };
      }
      const errorMessage = error.response?.data?.message || error.message;
      return {
        success: false,
        error: errorMessage || `Failed to verify user: ${error.response?.status || "Unknown error"}`,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * 获取用户的最新推文
 * @param restId - Twitter/X 用户的 rest_id
 * @param options - 可选参数（maxResults）
 */
export async function getUserTweets(
  restId: string,
  options: {
    maxResults?: number;
  } = {}
): Promise<{
  success: boolean;
  tweets?: TwitterTweet[];
  users?: TwitterUser[];
  error?: string;
}> {
  if (!restId) {
    return {
      success: false,
      error: "rest_id is required",
    };
  }

  try {
    // 构建查询参数
    const params = new URLSearchParams({
      user: restId,
    });

    if (options.maxResults) {
      params.append("count", String(options.maxResults));
    }

    // 获取用户推文
    const response = await rapidapiRequest({
      method: "GET",
      url: `/user-tweets?${params.toString()}`,
    });

    const tweetsData = response.data;

    // 解析响应数据
    // 结构: result.timeline.instructions[].entries[].content.itemContent.tweet_results.result
    let tweets: TwitterTweet[] = [];
    const users: TwitterUser[] = [];
    const userMap = new Map<string, TwitterUser>();

    // 解析 timeline.instructions
    const instructions = tweetsData?.result?.timeline?.instructions;
    if (Array.isArray(instructions)) {
      for (const instruction of instructions) {
        // 查找 TimelineAddEntries 类型的指令
        if (instruction.type === "TimelineAddEntries" && Array.isArray(instruction.entries)) {
          for (const entry of instruction.entries) {
            // 检查是否是推文条目
            if (
              entry.content?.entryType === "TimelineTimelineItem" &&
              entry.content.itemContent?.itemType === "TimelineTweet"
            ) {
              const tweetResult = entry.content.itemContent.tweet_results?.result;

              // 跳过非推文类型（如广告等）
              if (tweetResult?.__typename !== "Tweet" || !tweetResult.legacy) {
                continue;
              }

              // 提取用户信息
              const userResult = tweetResult.core?.user_results?.result;
              if (userResult?.__typename === "User") {
                const userId = userResult.rest_id;
                if (userId && !userMap.has(userId)) {
                  userMap.set(userId, {
                    id: userId,
                    username: userResult.core?.screen_name || "",
                    name: userResult.core?.name || userResult.legacy?.name || "",
                    profile_image_url: userResult.avatar?.image_url || userResult.legacy?.profile_image_url_https,
                  });
                }
              }

              // 提取推文信息
              const legacy = tweetResult.legacy;
              const tweetId = tweetResult.rest_id;

              if (!tweetId) {
                continue;
              }

              // 获取推文文本
              // 优先使用 note_tweet 的文本（长推文）
              let tweetText = legacy.full_text || "";
              if (tweetResult.note_tweet?.note_tweet_results?.result?.text) {
                tweetText = tweetResult.note_tweet.note_tweet_results.result.text;
              }

              // 检查是否是转发（RT）
              // 1. 检查推文文本是否以 "RT @" 开头
              // 2. 检查是否存在 retweeted_status_result 字段
              const isRetweet = 
                tweetText.trim().startsWith("RT @") || 
                !!tweetResult.retweeted_status_result ||
                !!legacy.retweeted_status;

              // 提取互动数据
              const publicMetrics = {
                retweet_count: legacy.retweet_count || 0,
                like_count: legacy.favorite_count || 0,
                reply_count: legacy.reply_count || 0,
                quote_count: legacy.quote_count || 0,
              };

              // 提取 URL 实体
              const urls = (legacy.entities?.urls || []).map((url: {
                url: string;
                expanded_url?: string;
                display_url?: string;
              }) => ({
                url: url.url || "",
                expanded_url: url.expanded_url || url.url || "",
                display_url: url.display_url || url.url || "",
              }));

              // 提取回复信息
              // 检查多个可能的回复字段
              // 如果存在 in_reply_to_status_id_str 或 in_reply_to_status_id，说明是回复
              // 如果存在 in_reply_to_user_id_str，也说明是回复（即使没有具体的推文ID）
              const inReplyToStatusId = 
                legacy.in_reply_to_status_id_str || 
                legacy.in_reply_to_status_id || 
                null;
              
              // 如果存在 in_reply_to_user_id_str 但没有 in_reply_to_status_id，也标记为回复
              const isReply = inReplyToStatusId || legacy.in_reply_to_user_id_str;

              // 如果是转发或回复，标记为需要过滤
              // 转发使用特殊标记 "RT"，回复使用实际的 status_id 或空字符串
              const shouldFilter = isRetweet || isReply;
              const filterReason = isRetweet ? "RT" : (isReply ? (inReplyToStatusId || "") : null);

              tweets.push({
                id: tweetId,
                text: tweetText,
                created_at: legacy.created_at || "",
                author_id: userResult?.rest_id || restId,
                // 如果是转发或回复，设置 in_reply_to_status_id 为标记值（转发用 "RT"，回复用实际的 ID 或 ""）
                in_reply_to_status_id: shouldFilter ? filterReason : null,
                public_metrics: publicMetrics,
                entities: {
                  urls: urls,
                },
              });
            }
          }
        }
      }
    }

    // 将用户信息转换为数组
    users.push(...Array.from(userMap.values()));

    // 过滤掉没有 ID 的推文
    tweets = tweets.filter((tweet) => tweet.id);

    return {
      success: true,
      tweets,
      users,
    };
  } catch (error: unknown) {
    // axios 错误处理
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      return {
        success: false,
        error: errorMessage || `Failed to get tweets: ${error.response?.status || "Unknown error"}`,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * 格式化推文为 Telegram 消息
 */
export function formatTweetForTelegram(
  tweet: TwitterTweet,
  user?: TwitterUser
): string {
  const username = user?.username || "Unknown";
  const name = user?.name || username;
  const tweetUrl = `https://twitter.com/${username}/status/${tweet.id}`;
  
  // 格式化时间，精确到秒，使用更友好的格式
  let timeString = "";
  let relativeTime = "";
  if (tweet.created_at) {
    try {
      const date = new Date(tweet.created_at);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      // 相对时间显示
      if (diffMins < 1) {
        relativeTime = "刚刚";
      } else if (diffMins < 60) {
        relativeTime = `${diffMins} 分钟前`;
      } else if (diffHours < 24) {
        relativeTime = `${diffHours} 小时前`;
      } else if (diffDays < 7) {
        relativeTime = `${diffDays} 天前`;
      }
      
      // 完整时间格式：YYYY-MM-DD HH:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      // 如果解析失败，使用原始字符串
      timeString = tweet.created_at;
    }
  }
  
  // 构建美观的消息格式
  // 使用清晰的视觉层次和适当的间距，参考 Minimal & Direct 风格
  let message = "";
  
  // 头部：用户名和 handle（粗体突出用户名）
  message += `<b>${name}</b> <i>@${username}</i>\n`;
  message += `\n`;
  
  // 推文内容（清晰易读，保持原有换行）
  message += `${tweet.text}\n`;
  message += `\n`;
  
  // 时间信息（使用相对时间 + 完整时间，使用代码样式显示精确时间）
  if (timeString) {
    if (relativeTime) {
      message += `🕐 <i>${relativeTime}</i> • <code>${timeString}</code>\n`;
    } else {
      message += `🕐 <code>${timeString}</code>\n`;
    }
    message += `\n`;
  }
  
  // 底部：查看推文链接（简洁的链接样式，使用箭头增强可点击性）
  message += `<a href="${tweetUrl}">🔗 查看推文</a>`;

  return message;
}

