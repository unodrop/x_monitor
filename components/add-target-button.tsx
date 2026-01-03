"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { getNotificationConfigs } from "@/app/actions/notification-configs";
import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface AddTargetButtonProps {
  onSuccess?: () => void;
}

export function AddTargetButton({ onSuccess }: AddTargetButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [isTransitioning, startTransition] = useTransition();
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      getNotificationConfigs().then(setConfigs);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    // 立即设置 loading 状态，确保 UI 更新
    setIsPending(true);
    
    // 使用 startTransition 确保状态更新立即生效
    startTransition(() => {
      // 这个回调会在下一个 tick 执行，但状态已经设置了
    });

    try {
      const formData = new FormData(e.currentTarget);
      const xHandle = formData.get("x_handle") as string;
      const notificationConfigId =
        selectedConfigId && selectedConfigId !== "__none__"
          ? selectedConfigId
          : null;

      const response = await fetch("/api/monitor-targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x_handle: xHandle,
          notification_config_id: notificationConfigId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 先关闭对话框，然后显示 toast，确保 toast 不被遮挡
        setIsOpen(false);
        setSelectedConfigId("");
        const formElement = document.getElementById("add-target-form") as HTMLFormElement;
        if (formElement) {
          formElement.reset();
        }
        setIsPending(false);
        
        // 调用刷新函数，只刷新列表数据
        if (onSuccess) {
          onSuccess();
        }
        
        // 延迟显示 toast，确保对话框已完全关闭
        setTimeout(() => {
          showToast("KOL 添加成功", "success");
        }, 100);
      } else {
        const errorMessage = data.error || "添加失败";
        setError(errorMessage);
        showToast(errorMessage, "error");
        setIsPending(false);
      }
    } catch {
      const errorMessage = "添加失败，请重试";
      setError(errorMessage);
      showToast(errorMessage, "error");
      setIsPending(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        <span>添加监控目标</span>
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setError("");
            setSelectedConfigId("");
            setIsPending(false); // 重置 loading 状态
          }
        }}
      >
        <DialogContent className="max-w-lg sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>添加监控目标</DialogTitle>
            <DialogDescription>
              添加要监控的 X (Twitter) 账号，系统将自动获取账号信息
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            <form
              onSubmit={handleSubmit}
              id="add-target-form"
              className="space-y-6"
            >
              {error && (
                <div className="rounded-xl border border-red-300 bg-red-50/90 p-4 text-sm font-medium text-red-900 shadow-sm dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="x_handle"
                  className="text-sm font-semibold text-black dark:text-white"
                >
                  X Handle
                </Label>
                <Input
                  id="x_handle"
                  name="x_handle"
                  type="text"
                  required
                  placeholder="elonmusk"
                  className="transition-all duration-200"
                />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  不包含 @ 符号，只输入用户名。名称将从 X (Twitter) 自动获取
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="notification_config_id"
                  className="text-sm font-semibold text-black dark:text-white"
                >
                  推送方式
                </Label>
                <Select
                  value={selectedConfigId || "__none__"}
                  onValueChange={(value) => {
                    setSelectedConfigId(value === "__none__" ? "" : value);
                  }}
                >
                  <SelectTrigger className="transition-all duration-200 cursor-pointer">
                    <SelectValue placeholder="选择通知分组（可选）" />
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
                <input
                  type="hidden"
                  name="notification_config_id"
                  value={selectedConfigId || ""}
                />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  从已创建的通知分组中选择，或稍后在分组管理中配置
                </p>
              </div>
            </form>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-black/10 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setError("");
                setSelectedConfigId("");
              }}
              disabled={isPending}
              className="transition-all duration-200 cursor-pointer"
            >
              取消
            </Button>
            <Button
              type="submit"
              form="add-target-form"
              disabled={isPending || isTransitioning}
              className="transition-all duration-200 cursor-pointer min-w-[90px] flex items-center justify-center gap-2"
            >
              {(isPending || isTransitioning) && (
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              )}
              <span className="whitespace-nowrap">保存</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
