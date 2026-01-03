import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { supabaseAdmin } from "@/db";
import { verifyUserExists } from "@/lib/twitter";
import { checkAndSendTweetsForTarget } from "@/lib/monitor-utils";
import { z } from "zod";

const xHandleSchema = z
  .string()
  .min(1, "X handle is required")
  .regex(/^[a-zA-Z0-9_]+$/, "Invalid X handle format");

/**
 * GET /api/monitor-targets
 * 获取当前用户的所有监控目标
 */
export const GET = withAuth(async (request: NextRequest, user) => {
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
    return NextResponse.json(
      { error: "Failed to fetch monitor targets" },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
});

/**
 * POST /api/monitor-targets
 * 添加新的监控目标
 */
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { x_handle, notification_config_id } = body;

    // Validate inputs
    const validatedHandle = xHandleSchema.parse(x_handle?.trim());

    // Verify user exists on Twitter/X and get user info
    const userVerification = await verifyUserExists(validatedHandle);
    if (!userVerification.success || !userVerification.user) {
      return NextResponse.json(
        { error: userVerification.error || "User not found on X (Twitter)" },
        { status: 400 }
      );
    }

    // Use name from API response
    const finalName = userVerification.user.name || validatedHandle;
    const restId = userVerification.user.rest_id;

    // Check if target already exists for this user
    const { data: existing } = await supabaseAdmin
      .from("monitor_targets")
      .select("id")
      .eq("user_id", user.userId)
      .eq("x_handle", validatedHandle)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "This X handle is already being monitored" },
        { status: 400 }
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

    // Insert new target
    const { data, error } = await supabaseAdmin
      .from("monitor_targets")
      .insert({
        user_id: user.userId,
        x_handle: validatedHandle,
        name: finalName,
        status: "active",
        notification_config_id: notification_config_id || null,
        rest_id: restId,
      })
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
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to add monitor target" },
        { status: 500 }
      );
    }

    // 如果配置了通知渠道，立即获取并发送最新推文
    if (data.notification_config_id && data.notification_configs) {
      // 确保 notification_configs 不是数组
      const notificationConfig = Array.isArray(data.notification_configs)
        ? data.notification_configs[0]
        : data.notification_configs;

      if (notificationConfig) {
        try {
          // 异步执行，不阻塞响应
          checkAndSendTweetsForTarget({
            ...data,
            notification_configs: notificationConfig,
          }).catch((err) => {
            // 静默处理错误，不影响添加操作
            console.error("Failed to send initial tweets:", err);
          });
        } catch (err) {
          // 静默处理错误
          console.error("Error initiating tweet check:", err);
        }
      }
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add monitor target" },
      { status: 500 }
    );
  }
});

