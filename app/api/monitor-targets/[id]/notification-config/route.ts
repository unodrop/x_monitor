import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { supabaseAdmin } from "@/db";

/**
 * PATCH /api/monitor-targets/[id]/notification-config
 * 更新监控目标的通知配置
 */
export const PATCH = withAuth(
  async (
    request: NextRequest,
    user,
    context?: { params: Promise<{ id: string }> }
  ) => {
  if (!context) {
    return NextResponse.json(
      { error: "Missing context" },
      { status: 500 }
    );
  }

  const { id } = await context.params;
  const body = await request.json();
  const { notification_config_id } = body;

  // Verify ownership
  const { data: target } = await supabaseAdmin
    .from("monitor_targets")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!target || target.user_id !== user.userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  // If notification_config_id is provided, verify it belongs to the user
  if (notification_config_id) {
    const { data: config } = await supabaseAdmin
      .from("notification_configs")
      .select("user_id")
      .eq("id", notification_config_id)
      .single();

    if (!config || config.user_id !== user.userId) {
      return NextResponse.json(
        { error: "Invalid notification config" },
        { status: 400 }
      );
    }
  }

  // Update notification config
  const { error } = await supabaseAdmin
    .from("monitor_targets")
    .update({
      notification_config_id: notification_config_id || null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update notification config" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
  }
);

