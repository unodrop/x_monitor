// Database types for Supabase tables

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface MonitorTarget {
  id: string;
  user_id: string;
  x_handle: string;
  name: string;
  status: "active" | "paused";
  notification_config_id: string | null;
  last_tweet_id: string | null;
  rest_id: string | null;
  created_at: string;
}

export interface NotificationConfig {
  id: string;
  user_id: string;
  name: string;
  channel_type: "telegram" | "discord" | "dingtalk" | "feishu" | "webhook";
  webhook_url: string | null;
  config_json: Record<string, unknown> | null;
  created_at: string;
}

// Insert types (without auto-generated fields)
export type InsertUser = Omit<User, "id" | "created_at">;
export type InsertMonitorTarget = Omit<MonitorTarget, "id" | "created_at">;
export type InsertNotificationConfig = Omit<NotificationConfig, "id" | "created_at">;

// Update types (all fields optional except id)
export type UpdateMonitorTarget = Partial<Omit<MonitorTarget, "id" | "user_id" | "created_at">> & {
  id: string;
};

