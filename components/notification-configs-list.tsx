"use client";

import { useState, useTransition, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteNotificationConfig } from "@/app/actions/notification-configs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";

interface NotificationConfig {
  id: string;
  name: string;
  channel_type: "telegram" | "discord" | "dingtalk" | "feishu" | "webhook";
  webhook_url: string | null;
  config_json: Record<string, unknown> | null;
  created_at: string;
}

interface NotificationConfigsListProps {
  initialConfigs: NotificationConfig[];
}

const channelTypeLabels: Record<string, string> = {
  telegram: "Telegram",
  discord: "Discord",
  dingtalk: "钉钉",
  feishu: "飞书",
  webhook: "自定义Webhook",
};

const channelTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  telegram: {
    bg: "bg-blue-100 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/50",
  },
  discord: {
    bg: "bg-indigo-100 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800/50",
  },
  dingtalk: {
    bg: "bg-blue-100 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/50",
  },
  feishu: {
    bg: "bg-green-100 dark:bg-green-950/40",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800/50",
  },
  webhook: {
    bg: "bg-amber-100 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/50",
  },
};

export function NotificationConfigsList({
  initialConfigs,
}: NotificationConfigsListProps) {
  const router = useRouter();
  const [configs, setConfigs] = useState(initialConfigs);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  // 同步 initialConfigs 的变化（当 router.refresh() 后服务器数据更新时）
  useEffect(() => {
    setConfigs(initialConfigs);
  }, [initialConfigs]);

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteNotificationConfig(id);
      if (result.success) {
        setConfigs(configs.filter((c) => c.id !== id));
        router.refresh();
        showToast("通知分组已删除", "success");
      } else {
        // Show detailed error message if there are bound targets
        const errorMessage = result.error || "删除失败";
        showToast(errorMessage, "error");
      }
    });
  };

  if (configs.length === 0) {
    return (
      <div className="rounded-xl border border-black/5 bg-white/80 backdrop-blur-xl p-8 text-center shadow-sm dark:border-white/5 dark:bg-gray-950/80">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <span className="text-lg">🔔</span>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          还没有通知分组，点击上方按钮创建一个
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {configs.map((config) => (
        <div
          key={config.id}
          className="group relative rounded-xl border border-black/5 bg-white/80 backdrop-blur-xl p-4 shadow-sm transition-all hover:shadow-md hover:border-black/10 dark:border-white/5 dark:bg-gray-950/80 dark:hover:border-white/10 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-sm font-bold text-black dark:text-white truncate">
                  {config.name}
                </h3>
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                    channelTypeColors[config.channel_type]?.bg || "bg-gray-100 dark:bg-gray-800"
                  } ${
                    channelTypeColors[config.channel_type]?.text || "text-gray-700 dark:text-gray-300"
                  } ${
                    channelTypeColors[config.channel_type]?.border || "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {channelTypeLabels[config.channel_type] || config.channel_type}
                </span>
              </div>
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                {new Date(config.created_at).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(config.id);
              }}
              disabled={isPending}
              className="rounded-lg border border-red-200 bg-white p-1.5 text-red-600 shadow-sm transition-all hover:bg-red-50 hover:shadow-sm disabled:opacity-50 dark:border-red-900/50 dark:bg-gray-900/50 dark:text-red-400 dark:hover:bg-red-950/50 shrink-0 cursor-pointer"
              title="删除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2 rounded-lg bg-gray-50/50 p-3 text-xs dark:bg-gray-900/50">
            {config.webhook_url && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  URL
                </span>
                <p className="mt-0.5 font-mono text-[11px] text-black dark:text-white truncate">
                  {config.webhook_url}
                </p>
              </div>
            )}

            {config.config_json && (
              <div className="space-y-2">
                {config.channel_type === "telegram" && (
                  <>
                    {config.config_json.botToken && (
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          Token
                        </span>
                        <p className="mt-0.5 font-mono text-[11px] text-black dark:text-white truncate">
                          {(config.config_json.botToken as string).substring(0, 25)}...
                        </p>
                      </div>
                    )}
                    {config.config_json.chatId && (
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          Chat
                        </span>
                        <p className="mt-0.5 font-mono text-[11px] text-black dark:text-white">
                          {config.config_json.chatId as string}
                        </p>
                      </div>
                    )}
                    {config.config_json.topicId && (
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          Topic
                        </span>
                        <p className="mt-0.5 font-mono text-[11px] text-black dark:text-white">
                          {config.config_json.topicId as string}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {config.channel_type === "dingtalk" &&
                  config.config_json?.secret ? (
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        Secret
                      </span>
                      <p className="mt-0.5 font-mono text-[11px] text-black dark:text-white truncate">
                        {String(config.config_json.secret).substring(0, 25)}...
                      </p>
                    </div>
                  ) : null}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

