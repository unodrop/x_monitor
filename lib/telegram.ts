/**
 * Telegram Bot API 工具函数
 */

interface TelegramConfig {
  botToken: string;
  chatId: string;
  topicId?: number;
}

interface SendMessageOptions {
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
}

/**
 * 发送 Telegram 消息
 * @param config Telegram 配置（botToken, chatId, topicId）
 * @param message 要发送的消息内容
 * @param options 可选参数（parseMode, disableWebPagePreview, disableNotification）
 * @returns 成功返回消息对象，失败抛出错误
 */
export async function sendTelegramMessage(
  config: TelegramConfig,
  message: string,
  options: SendMessageOptions = {}
): Promise<{
  success: boolean;
  messageId?: number;
  error?: string;
}> {
  const { botToken, chatId, topicId } = config;
  const {
    parseMode = "HTML",
    disableWebPagePreview = false,
    disableNotification = false,
  } = options;

  if (!botToken || !chatId) {
    return {
      success: false,
      error: "Bot Token and Chat ID are required",
    };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text: message,
      parse_mode: parseMode,
      disable_web_page_preview: disableWebPagePreview,
      disable_notification: disableNotification,
    };

    // 如果提供了 topicId，添加到 payload 中（用于论坛话题）
    if (topicId) {
      payload.message_thread_id = topicId;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return {
        success: false,
        error: data.description || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * 发送带格式的 Telegram 消息（HTML 格式）
 */
export async function sendTelegramHTMLMessage(
  config: TelegramConfig,
  message: string,
  options?: Omit<SendMessageOptions, "parseMode">
): Promise<{
  success: boolean;
  messageId?: number;
  error?: string;
}> {
  return sendTelegramMessage(config, message, {
    ...options,
    parseMode: "HTML",
  });
}

/**
 * 发送 Markdown 格式的 Telegram 消息
 */
export async function sendTelegramMarkdownMessage(
  config: TelegramConfig,
  message: string,
  options?: Omit<SendMessageOptions, "parseMode">
): Promise<{
  success: boolean;
  messageId?: number;
  error?: string;
}> {
  return sendTelegramMessage(config, message, {
    ...options,
    parseMode: "Markdown",
  });
}

