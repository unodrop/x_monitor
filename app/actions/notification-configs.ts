"use server";

import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const channelTypeSchema = z.enum(["telegram", "discord", "dingtalk", "feishu", "webhook"]);
const nameSchema = z.string().min(1, "Name is required");

/**
 * Get all notification configs for the current user
 */
export async function getNotificationConfigs() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("notification_configs")
    .select("*")
    .eq("user_id", user.userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notification configs:", error);
    return [];
  }

  return data || [];
}

/**
 * Add a new notification config group
 */
export async function addNotificationConfig(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const name = formData.get("name") as string;
    const channelType = formData.get("channel_type") as string;

    // Validate inputs
    const validatedName = nameSchema.parse(name.trim());
    const validatedChannelType = channelTypeSchema.parse(channelType);

    // Build config_json based on channel type
    let configJson: Record<string, unknown> = {};

    if (validatedChannelType === "telegram") {
      const botToken = formData.get("bot_token") as string;
      const chatId = formData.get("chat_id") as string;
      const topicId = formData.get("topic_id") as string;

      if (!botToken || !chatId) {
        return {
          success: false,
          error: "Bot Token and Chat ID are required for Telegram",
        };
      }

      configJson = {
        botToken: botToken.trim(),
        chatId: chatId.trim(),
        topicId: topicId?.trim() || null,
      };
    } else if (validatedChannelType === "discord") {
      const webhookUrl = formData.get("webhook_url") as string;
      if (!webhookUrl) {
        return {
          success: false,
          error: "Webhook URL is required for Discord",
        };
      }
      configJson = {
        webhookUrl: webhookUrl.trim(),
      };
    } else if (validatedChannelType === "dingtalk") {
      const webhookUrl = formData.get("webhook_url") as string;
      const secret = formData.get("secret") as string;
      if (!webhookUrl) {
        return {
          success: false,
          error: "Webhook URL is required for DingTalk",
        };
      }
      configJson = {
        webhookUrl: webhookUrl.trim(),
        secret: secret?.trim() || "",
      };
    } else if (validatedChannelType === "feishu") {
      const webhookUrl = formData.get("webhook_url") as string;
      if (!webhookUrl) {
        return {
          success: false,
          error: "Webhook URL is required for Feishu",
        };
      }
      configJson = {
        webhookUrl: webhookUrl.trim(),
      };
    } else if (validatedChannelType === "webhook") {
      const webhookUrl = formData.get("webhook_url") as string;
      if (!webhookUrl) {
        return {
          success: false,
          error: "Webhook URL is required",
        };
      }
      configJson = {
        webhookUrl: webhookUrl.trim(),
      };
    }

    // Insert new config
    const { data, error } = await supabaseAdmin
      .from("notification_configs")
      .insert({
        user_id: user.userId,
        name: validatedName,
        channel_type: validatedChannelType,
        webhook_url: validatedChannelType !== "telegram" ? (configJson.webhookUrl as string) : null,
        config_json: configJson,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: "Failed to add notification config",
      };
    }

    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard");
    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid input",
      };
    }

    return {
      success: false,
      error: "Failed to add notification config",
    };
  }
}

/**
 * Delete a notification config
 */
export async function deleteNotificationConfig(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  // Verify ownership
  const { data: config } = await supabaseAdmin
    .from("notification_configs")
    .select("user_id, name")
    .eq("id", id)
    .single();

  if (!config || config.user_id !== user.userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  // Check if any monitor targets are using this notification config
  const { data: boundTargets, error: checkError } = await supabaseAdmin
    .from("monitor_targets")
    .select("id, x_handle, name")
    .eq("notification_config_id", id)
    .eq("user_id", user.userId);

  if (checkError) {
    console.error("Error checking bound targets:", checkError);
    return {
      success: false,
      error: "Failed to check notification config usage",
    };
  }

  // If there are bound targets, return error with list
  if (boundTargets && boundTargets.length > 0) {
    const targetNames = boundTargets
      .map((t) => `${t.name} (@${t.x_handle})`)
      .join("、");
    
    return {
      success: false,
      error: `无法删除：该通知分组仍被以下 KOL 使用：${targetNames}。请先解除绑定关系后再删除。`,
      boundTargets: boundTargets.map((t) => ({ id: t.id, name: t.name, x_handle: t.x_handle })),
    };
  }

  // No bound targets, safe to delete
  const { error } = await supabaseAdmin
    .from("notification_configs")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Failed to delete notification config",
    };
  }

  revalidatePath("/dashboard");
  return {
    success: true,
  };
}

