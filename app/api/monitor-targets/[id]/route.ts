import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { supabaseAdmin } from "@/db";

/**
 * DELETE /api/monitor-targets/[id]
 * 删除监控目标
 */
export const DELETE = withAuth(
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

  const { error } = await supabaseAdmin
    .from("monitor_targets")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete monitor target" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
  }
);

