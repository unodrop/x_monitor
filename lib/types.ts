import { z } from "zod";

// Channel types
export const channelTypeSchema = z.enum(["telegram", "discord", "dingtalk", "feishu"]);
export type ChannelType = z.infer<typeof channelTypeSchema>;

// Monitor target status
export const monitorStatusSchema = z.enum(["active", "paused"]);
export type MonitorStatus = z.infer<typeof monitorStatusSchema>;

// Notification config types
export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface DiscordConfig {
  webhookUrl: string;
}

export interface DingTalkConfig {
  webhookUrl: string;
  secret: string;
}

export interface FeishuConfig {
  webhookUrl: string;
}

