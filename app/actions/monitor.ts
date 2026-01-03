"use server";

import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const xHandleSchema = z
  .string()
  .min(1, "X handle is required")
  .regex(/^[a-zA-Z0-9_]+$/, "Invalid X handle format");

const nameSchema = z.string().min(1, "Name is required");

/**
 * Get all monitor targets for the current user with notification configs
 */
export async function getMonitorTargets() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabaseAdmin
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
    .eq("user_id", user.userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching monitor targets:", error);
    return [];
  }

  return data || [];
}

/**
 * Add a new monitor target
 */
export async function addMonitorTarget(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const xHandle = formData.get("x_handle") as string;
    const name = formData.get("name") as string;
    const notificationConfigId = formData.get("notification_config_id") as string;

    // Validate inputs
    const validatedHandle = xHandleSchema.parse(xHandle.trim());
    const validatedName = nameSchema.parse(name.trim());

    // Check if target already exists for this user
    const { data: existing } = await supabaseAdmin
      .from("monitor_targets")
      .select("id")
      .eq("user_id", user.userId)
      .eq("x_handle", validatedHandle)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: "This X handle is already being monitored",
      };
    }

    // If notification_config_id is provided, verify it belongs to the user
    if (notificationConfigId) {
      const { data: config } = await supabaseAdmin
        .from("notification_configs")
        .select("user_id")
        .eq("id", notificationConfigId)
        .single();

      if (!config || config.user_id !== user.userId) {
        return {
          success: false,
          error: "Invalid notification config",
        };
      }
    }

    // Insert new target
    const { data, error } = await supabaseAdmin
      .from("monitor_targets")
      .insert({
        user_id: user.userId,
        x_handle: validatedHandle,
        name: validatedName,
        status: "active",
        notification_config_id: notificationConfigId || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: "Failed to add monitor target",
      };
    }

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
      error: "Failed to add monitor target",
    };
  }
}

/**
 * Update notification config for a monitor target
 */
export async function updateMonitorTargetNotificationConfig(
  id: string,
  notificationConfigId: string | null
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    // Verify ownership
    const { data: target } = await supabaseAdmin
      .from("monitor_targets")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!target || target.user_id !== user.userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // If notification_config_id is provided, verify it belongs to the user
    if (notificationConfigId) {
      const { data: config } = await supabaseAdmin
        .from("notification_configs")
        .select("user_id")
        .eq("id", notificationConfigId)
        .single();

      if (!config || config.user_id !== user.userId) {
        return {
          success: false,
          error: "Invalid notification config",
        };
      }
    }

    // Update notification config
    const { error } = await supabaseAdmin
      .from("monitor_targets")
      .update({
        notification_config_id: notificationConfigId,
      })
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: "Failed to update notification config",
      };
    }

    revalidatePath("/dashboard");
    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to update notification config",
    };
  }
}

/**
 * Delete a monitor target
 */
export async function deleteMonitorTarget(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  // Verify ownership
  const { data: target } = await supabaseAdmin
    .from("monitor_targets")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!target || target.user_id !== user.userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const { error } = await supabaseAdmin
    .from("monitor_targets")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Failed to delete monitor target",
    };
  }

  revalidatePath("/dashboard");
  return {
    success: true,
  };
}

/**
 * Toggle monitor target status
 */
export async function toggleMonitorTargetStatus(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  // Get current status
  const { data: target } = await supabaseAdmin
    .from("monitor_targets")
    .select("status, user_id")
    .eq("id", id)
    .single();

  if (!target || target.user_id !== user.userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const newStatus = target.status === "active" ? "paused" : "active";

  const { error } = await supabaseAdmin
    .from("monitor_targets")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Failed to update status",
    };
  }

  revalidatePath("/dashboard");
  return {
    success: true,
    status: newStatus,
  };
}
