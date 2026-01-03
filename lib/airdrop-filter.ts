/**
 * 空投项目推文过滤工具
 * 使用 DeepSeek AI 判断推文是否与空投项目相关
 */

import OpenAI from "openai";

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
 * 初始化 DeepSeek 客户端
 */
function getDeepSeekClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error("DEEPSEEK_API_KEY is not configured");
    return null;
  }

  // DeepSeek API 兼容 OpenAI API 格式
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });
}

/**
 * 使用 DeepSeek AI 判断推文是否与空投项目相关
 * @param tweet - 推文对象
 * @returns Promise<boolean> true 如果推文与空投相关，否则返回 false
 */
export async function isAirdropRelated(tweet: TwitterTweet): Promise<boolean> {
  const client = getDeepSeekClient();

  if (!client) {
    // 如果 DeepSeek API Key 未配置，默认返回 false，不发送通知
    console.warn("DeepSeek API Key not configured, skipping airdrop check");
    return false;
  }

  try {
    // 构建推文内容（包含文本和 URL）
    let tweetContent = tweet.text;
    if (tweet.entities?.urls && tweet.entities.urls.length > 0) {
      const urls = tweet.entities.urls
        .map((url) => url.expanded_url || url.display_url || url.url)
        .filter(Boolean)
        .join(", ");
      if (urls) {
        tweetContent += `\n\n相关链接: ${urls}`;
      }
    }

    // 构建提示词
    const prompt = `请判断以下推文是否与加密货币空投项目相关。

**应该识别为空投项目的情况（返回 true）：**
- 官方宣布的空投活动或空投计划
- 项目方直接发布的空投分发信息
- 正式的空投活动启动、开始领取
- 官方发布的代币空投、NFT 空投
- 项目方宣布的快照时间、空投资格
- 官方空投奖励计划、推荐奖励计划
- 项目方正式发布的代币上线、新代币分发
- **空投相关的教程、攻略、刷分指南**（如：如何参与空投、刷分姿势、操作教程、策略分享等）
- **空投相关的讨论和分析**（如：空投项目分析、参与策略、积分获取方法等）
- **第三方分享的空投信息**（如：KOL 分享的空投项目、刷分教程、参与指南等）
- 提到 TGE（代币生成事件）、空投时间、积分系统、刷分、持仓拿分、交易刷量等空投相关内容

**不应该识别为空投项目的情况（返回 false）：**
- 完全无关的加密货币讨论（不涉及空投）
- 纯市场分析、价格预测（非空投相关）
- 普通项目介绍（没有提到空投、积分、TGE 等）
- 技术讨论（不涉及空投或积分）
- 新闻资讯（非空投相关）

**关键判断标准：**
1. 只要推文内容涉及空投、积分、TGE、刷分、持仓拿分、空投教程、空投策略等，都应该返回 true
2. 教程类内容（如刷分教程、参与指南）应该返回 true
3. 讨论类内容如果涉及空投项目，也应该返回 true
4. 只有完全与空投无关的加密货币内容才返回 false

推文内容：
${tweetContent}

请仔细分析，只要推文涉及空投相关内容（包括教程、讨论、策略等），就返回 true。只返回 true 或 false，不要返回其他内容。`;

    // 调用 DeepSeek API
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一个专业的加密货币空投项目识别助手。你需要识别所有与空投相关的内容，包括官方公告、教程、攻略、刷分指南、讨论分析等。只要推文涉及空投、积分、TGE、刷分、持仓拿分等空投相关内容，就返回 true。只有完全与空投无关的加密货币内容才返回 false。只返回 true 或 false。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // 降低温度以获得更一致的判断
      max_tokens: 10, // 只需要返回 true/false，不需要太多 tokens
    });

    const result = response.choices[0]?.message?.content?.trim().toLowerCase() || "";

    // 解析返回结果
    if (result === "true" || result === "yes" || result.includes("true")) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking airdrop with DeepSeek:", error);
    // 如果 AI 判断失败，默认返回 false，不发送通知
    return false;
  }
}
