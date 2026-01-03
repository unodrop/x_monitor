"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Trash2, Play, Pause, ExternalLink } from "lucide-react";
import { getNotificationConfigs } from "@/app/actions/notification-configs";
import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationConfig {
  id: string;
  name: string;
  channel_type: string;
}

interface MonitorTarget {
  id: string;
  x_handle: string;
  name: string;
  status: "active" | "paused";
  notification_config_id: string | null;
  notification_configs: NotificationConfig | null;
  created_at: string;
}

interface MonitorTargetsTableProps {
  initialTargets: MonitorTarget[];
  onRefresh?: React.MutableRefObject<(() => void) | undefined>;
  onAddSuccess?: () => void;
}

export const MonitorTargetsTable = memo(function MonitorTargetsTable({
  initialTargets,
  onRefresh,
}: MonitorTargetsTableProps) {
  const [targets, setTargets] = useState(initialTargets);
  const [isPending, setIsPending] = useState(false);
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const { showToast } = useToast();

  // 同步 initialTargets 的变化（当父组件数据更新时）
  useEffect(() => {
    setTargets(initialTargets);
  }, [initialTargets]);

  // 刷新列表数据
  const refreshTargets = useCallback(async () => {
    try {
      const response = await fetch("/api/monitor-targets");
      if (response.ok) {
        const data = await response.json();
        setTargets(data);
      }
    } catch (error) {
      console.error("Failed to refresh targets:", error);
    }
  }, []);

  // 暴露刷新函数给父组件
  useEffect(() => {
    if (onRefresh) {
      // 将刷新函数传递给父组件的 ref
      onRefresh.current = refreshTargets;
    }
  }, [onRefresh, refreshTargets]);

  // 缓存通知配置，只在组件挂载时获取一次
  useEffect(() => {
    getNotificationConfigs().then(setConfigs);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    // 保存要删除的目标，以便失败时恢复
    const targetToDelete = targets.find((t) => t.id === id);
    
    // 乐观更新：立即从 UI 中移除
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setIsPending(true);
    
    try {
      const response = await fetch(`/api/monitor-targets/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // 如果失败，恢复之前的状态
        if (targetToDelete) {
          setTargets((prev) => [...prev, targetToDelete]);
        }
        showToast(data.error || "删除失败", "error");
      } else {
        // 成功删除后，刷新列表确保数据同步
        await refreshTargets();
        showToast("KOL 已删除", "success");
      }
    } catch {
      // 如果失败，恢复之前的状态
      if (targetToDelete) {
        setTargets((prev) => [...prev, targetToDelete]);
      }
      showToast("删除失败，请重试", "error");
    } finally {
      setIsPending(false);
    }
  }, [targets, refreshTargets, showToast]);

  const handleToggleStatus = useCallback(async (id: string) => {
    // 乐观更新：立即更新 UI
    setTargets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "active" ? "paused" : "active" }
          : t
      )
    );
    setIsPending(true);
    
    try {
      const response = await fetch(`/api/monitor-targets/${id}/status`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // 如果失败，恢复之前的状态
        setTargets((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, status: t.status === "active" ? "paused" : "active" }
              : t
          )
        );
        showToast(data.error || "更新状态失败", "error");
      } else {
        showToast(`已${data.status === "active" ? "启动" : "暂停"}监控`, "success");
      }
    } catch {
      // 如果失败，恢复之前的状态
      setTargets((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: t.status === "active" ? "paused" : "active" }
            : t
        )
      );
      showToast("更新状态失败，请重试", "error");
    } finally {
      setIsPending(false);
    }
  }, [showToast]);

  if (targets.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white/80 backdrop-blur-xl p-16 text-center shadow-xl dark:border-white/5 dark:bg-gray-950/80">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <svg
            className="h-8 w-8 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
          还没有监控目标
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          点击上方按钮添加一个 KOL 监控目标
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-gray-950/90 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="border-b border-black/10 bg-gradient-to-r from-gray-50/80 to-transparent dark:border-white/10 dark:from-gray-900/80">
            <tr>
              <th className="w-[180px] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                X Handle
              </th>
              <th className="min-w-[200px] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                名称
              </th>
              <th className="w-[120px] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                状态
              </th>
              <th className="min-w-[180px] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                通知分组
              </th>
              <th className="w-[140px] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                创建时间
              </th>
              <th className="w-[140px] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10 bg-white dark:bg-gray-950">
            {targets.map((target) => (
              <tr
                key={target.id}
                onClick={() => {
                  window.open(`https://x.com/${target.x_handle}`, "_blank", "noopener,noreferrer");
                }}
                className="transition-all duration-200 hover:bg-gray-50/80 hover:shadow-sm dark:hover:bg-gray-900/50 cursor-pointer group"
              >
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-mono font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 truncate">
                    @{target.x_handle}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate block">
                  {target.name}
                </span>
              </td>
              <td className="px-4 py-4">
                <Badge className="whitespace-nowrap" variant={target.status === "active" ? "default" : "secondary"}>
                  {target.status === "active" ? "运行中" : "已暂停"}
                </Badge>
              </td>
              <td className="px-4 py-4 min-w-0" onClick={(e) => e.stopPropagation()}>
                {editingTarget === target.id ? (
                  <Select
                    value={target.notification_config_id || "__none__"}
                    onValueChange={async (configId) => {
                      const finalConfigId = configId === "__none__" ? null : configId;
                      setIsPending(true);
                      try {
                        const response = await fetch(
                          `/api/monitor-targets/${target.id}/notification-config`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              notification_config_id: finalConfigId,
                            }),
                          }
                        );

                        const data = await response.json();

                        if (response.ok && data.success) {
                          // 乐观更新：立即更新 UI
                          setTargets((prev) =>
                            prev.map((t) =>
                              t.id === target.id
                                ? {
                                    ...t,
                                    notification_config_id: finalConfigId,
                                    notification_configs: finalConfigId
                                      ? configs.find((c) => c.id === finalConfigId) || null
                                      : null,
                                  }
                                : t
                            )
                          );
                          setEditingTarget(null);
                          // 刷新列表确保数据同步
                          await refreshTargets();
                          showToast("通知配置已更新", "success");
                        } else {
                          showToast(data.error || "更新失败", "error");
                        }
                      } catch {
                        showToast("更新失败，请重试", "error");
                      } finally {
                        setIsPending(false);
                      }
                    }}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingTarget(null);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full max-w-[240px]">
                      <SelectValue placeholder="不配置通知" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">不配置通知</SelectItem>
                      {configs.map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name} ({config.channel_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTarget(target.id);
                    }}
                    className="text-sm font-medium text-black transition-colors duration-200 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 cursor-pointer truncate block w-full text-left"
                  >
                    {target.notification_configs ? (
                      <span className="truncate block">
                        {target.notification_configs.name}{" "}
                        <span className="text-gray-400 dark:text-gray-500">
                          ({target.notification_configs.channel_type})
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        未配置
                      </span>
                    )}
                  </button>
                )}
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {new Date(target.created_at).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(target.id);
                    }}
                    disabled={isPending}
                    variant="outline"
                    size="icon"
                    title={target.status === "active" ? "暂停" : "启动"}
                    className="cursor-pointer"
                  >
                    {target.status === "active" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(target.id);
                    }}
                    disabled={isPending}
                    variant="destructive"
                    size="icon"
                    title="删除"
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
});

