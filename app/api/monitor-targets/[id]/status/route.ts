import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { supabaseAdmin } from "@/db";

/**
 * PATCH /api/monitor-targets/[id]/status
 * 切换监控目标状态
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

  // Get current status
  const { data: target } = await supabaseAdmin
    .from("monitor_targets")
    .select("status, user_id")
    .eq("id", id)
    .single();

  if (!target || target.user_id !== user.userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  const newStatus = target.status === "active" ? "paused" : "active";

  const { error } = await supabaseAdmin
    .from("monitor_targets")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, status: newStatus });
  }
);

