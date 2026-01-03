/**
 * 统一的通知发送函数，支持所有渠道
 */

import { sendTelegramHTMLMessage } from "./telegram";
import { NotificationConfig } from "@/db/types";

interface SendNotificationResult {
  success: boolean;
  error?: string;
}

/**
 * 发送通知到指定渠道
 */
export async function sendNotification(
  config: NotificationConfig,
  message: string
): Promise<SendNotificationResult> {
  const { channel_type, config_json } = config;

  try {
    switch (channel_type) {
      case "telegram": {
        const telegramConfig = config_json as {
          botToken?: string;
          chatId?: string;
          topicId?: string | number;
        };

        if (!telegramConfig?.botToken || !telegramConfig?.chatId) {
          return {
            success: false,
            error: "Telegram bot token and chat ID are required",
          };
        }

        const result = await sendTelegramHTMLMessage(
          {
            botToken: telegramConfig.botToken,
            chatId: telegramConfig.chatId,
            topicId: telegramConfig.topicId
              ? typeof telegramConfig.topicId === "string"
                ? parseInt(telegramConfig.topicId, 10)
                : telegramConfig.topicId
              : undefined,
          },
          message
        );

        return {
          success: result.success,
          error: result.error,
        };
      }

      case "discord": {
        const discordConfig = config_json as { webhookUrl?: string };
        const webhookUrl = discordConfig?.webhookUrl || config.webhook_url;

        if (!webhookUrl) {
          return {
            success: false,
            error: "Discord webhook URL is required",
          };
        }

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: message.replace(/<[^>]*>/g, ""), // 移除 HTML 标签
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          return {
            success: false,
            error: `Discord webhook failed: ${response.status} ${errorText}`,
          };
        }

        return { success: true };
      }

      case "dingtalk": {
        const dingtalkConfig = config_json as {
          webhookUrl?: string;
          secret?: string;
        };
        const webhookUrl = dingtalkConfig?.webhookUrl || config.webhook_url;

        if (!webhookUrl) {
          return {
            success: false,
            error: "DingTalk webhook URL is required",
          };
        }

        // 如果有 secret，需要计算签名
        let finalUrl = webhookUrl;
        if (dingtalkConfig?.secret) {
          const timestamp = Date.now();
          const crypto = await import("crypto");
          const sign = crypto
            .createHmac("sha256", dingtalkConfig.secret)
            .update(`${timestamp}\n${dingtalkConfig.secret}`)
            .digest("base64");

          const urlObj = new URL(webhookUrl);
          urlObj.searchParams.set("timestamp", timestamp.toString());
          urlObj.searchParams.set("sign", sign);
          finalUrl = urlObj.toString();
        }

        const response = await fetch(finalUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            msgtype: "text",
            text: {
              content: message.replace(/<[^>]*>/g, ""), // 移除 HTML 标签
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          return {
            success: false,
            error: `DingTalk webhook failed: ${response.status} ${errorText}`,
          };
        }

        return { success: true };
      }

      case "feishu": {
        const feishuConfig = config_json as { webhookUrl?: string };
        const webhookUrl = feishuConfig?.webhookUrl || config.webhook_url;

        if (!webhookUrl) {
          return {
            success: false,
            error: "Feishu webhook URL is required",
          };
        }

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            msg_type: "text",
            content: {
              text: message.replace(/<[^>]*>/g, ""), // 移除 HTML 标签
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          return {
            success: false,
            error: `Feishu webhook failed: ${response.status} ${errorText}`,
          };
        }

        return { success: true };
      }

      case "webhook": {
        const webhookConfig = config_json as { webhookUrl?: string };
        const webhookUrl = webhookConfig?.webhookUrl || config.webhook_url;

        if (!webhookUrl) {
          return {
            success: false,
            error: "Webhook URL is required",
          };
        }

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.replace(/<[^>]*>/g, ""), // 移除 HTML 标签
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          return {
            success: false,
            error: `Webhook failed: ${response.status} ${errorText}`,
          };
        }

        return { success: true };
      }

      default:
        return {
          success: false,
          error: `Unsupported channel type: ${channel_type}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

