import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  DashboardContent,
  AddTargetButtonWrapper,
} from "@/components/dashboard-content";
import { supabaseAdmin } from "@/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch targets directly from database (no need for API call in Server Component)
  let targets = [];
  try {
    const { data, error } = await supabaseAdmin
      .from("monitor_targets")
      .select(
        `
        *,
        notification_configs (
          id,
          name,
          channel_type,
          webhook_url,
          config_json
        )
      `
      )
      .eq("user_id", user.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch monitor targets:", error);
    } else {
      targets = data || [];
    }
  } catch (error) {
    console.error("Failed to fetch monitor targets:", error);
  }

  const activeCount = targets.filter((t) => t.status === "active").length;
  const pausedCount = targets.filter((t) => t.status === "paused").length;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-black/10 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/90 px-10 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            管理您要监控的 X (Twitter) 账号
          </p>
          <AddTargetButtonWrapper />
        </div>

        {/* Stats in Header */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              总监控数:
            </span>
            <span className="text-lg font-bold text-black dark:text-white">
              {targets.length}
            </span>
          </div>
          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              运行中:
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {activeCount}
            </span>
          </div>
          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              已暂停:
            </span>
            <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
              {pausedCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <DashboardContent initialTargets={targets} />
      </div>
    </div>
  );
}
