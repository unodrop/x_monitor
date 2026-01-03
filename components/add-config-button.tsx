"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, MessageSquare, Send, Hash, FileText, Webhook } from "lucide-react";
import { addNotificationConfig } from "@/app/actions/notification-configs";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/toast-provider";

const channelTypes = [
  { 
    value: "telegram", 
    label: "Telegram",
    icon: Send,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  { 
    value: "discord", 
    label: "Discord",
    icon: MessageSquare,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800"
  },
  { 
    value: "dingtalk", 
    label: "钉钉",
    icon: Hash,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  { 
    value: "feishu", 
    label: "飞书",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800"
  },
  { 
    value: "webhook", 
    label: "自定义Webhook",
    icon: Webhook,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
] as const;

export function AddConfigButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [channelType, setChannelType] = useState<string>("telegram");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("channel_type", channelType);

    startTransition(async () => {
      const result = await addNotificationConfig(formData);

      if (result.success) {
        setIsOpen(false);
        setChannelType("telegram");
        router.refresh();
        showToast("通知分组添加成功", "success");
      } else {
        const errorMessage = result.error || "添加失败";
        setError(errorMessage);
        showToast(errorMessage, "error");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        <span>添加通知分组</span>
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setError("");
            setChannelType("telegram");
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader>
            <DialogTitle>创建通知分组</DialogTitle>
            <DialogDescription>
              配置推送渠道，用于接收 KOL 推文通知
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <form onSubmit={handleSubmit} className="space-y-6 py-4" id="config-form">
              {error && (
                <div className="rounded-xl border border-red-300 bg-red-50/90 p-4 text-sm font-medium text-red-900 shadow-sm dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-black dark:text-white">
                  分组名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="例如：Telegram 群组1"
                  className="transition-all duration-200"
                />
              </div>

              {/* Channel Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-black dark:text-white">
                  选择推送渠道
                </Label>
                <div className="grid grid-cols-5 gap-3">
                  {channelTypes.map((type) => {
                    const isSelected = channelType === type.value;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setChannelType(type.value)}
                        className={`group flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? `${type.bgColor} ${type.borderColor} border-2 shadow-md`
                            : "bg-white/80 border-black/10 hover:border-black/20 hover:shadow-sm dark:bg-gray-900/80 dark:border-white/10 dark:hover:border-white/20"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 transition-colors duration-200 ${
                            isSelected
                              ? type.color
                              : "text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold transition-colors duration-200 ${
                            isSelected
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100"
                          }`}
                        >
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Telegram Configuration */}
              {channelType === "telegram" && (
                <div className="rounded-xl border border-black/10 bg-gradient-to-br from-blue-50/50 to-transparent dark:border-white/10 dark:from-blue-950/20 dark:to-transparent p-6 shadow-sm">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="bot_token" className="text-sm font-semibold text-black dark:text-white">
                        Bot Token <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bot_token"
                        name="bot_token"
                        type="text"
                        required
                        placeholder="123456:ABC-DEF1234ghlkl-zyx57W2v1u123ew11"
                        className="transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chat_id" className="text-sm font-semibold text-black dark:text-white">
                        Chat ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="chat_id"
                        name="chat_id"
                        type="text"
                        required
                        placeholder="-1001234567890"
                        className="transition-all duration-200"
                      />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        可以是个人 Chat ID 或群组 Chat ID
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic_id" className="text-sm font-semibold text-black dark:text-white">
                        Topic ID <span className="text-gray-400 dark:text-gray-500 font-normal">(可选)</span>
                      </Label>
                      <Input
                        id="topic_id"
                        name="topic_id"
                        type="text"
                        placeholder="123"
                        className="transition-all duration-200"
                      />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        论坛（Forum）的话题 ID，普通群组不需要填写
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Discord Configuration */}
              {channelType === "discord" && (
                <div className="rounded-xl border border-black/10 bg-gradient-to-br from-indigo-50/50 to-transparent dark:border-white/10 dark:from-indigo-950/20 dark:to-transparent p-6 shadow-sm">
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url" className="text-sm font-semibold text-black dark:text-white">
                      Webhook URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="webhook_url"
                      name="webhook_url"
                      type="url"
                      required
                      placeholder="https://discord.com/api/webhooks/..."
                      className="transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* DingTalk Configuration */}
              {channelType === "dingtalk" && (
                <div className="rounded-xl border border-black/10 bg-gradient-to-br from-blue-50/50 to-transparent dark:border-white/10 dark:from-blue-950/20 dark:to-transparent p-6 shadow-sm">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="webhook_url" className="text-sm font-semibold text-black dark:text-white">
                        Webhook URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="webhook_url"
                        name="webhook_url"
                        type="url"
                        required
                        placeholder="https://oapi.dingtalk.com/robot/send?..."
                        className="transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secret" className="text-sm font-semibold text-black dark:text-white">
                        Secret <span className="text-gray-400 dark:text-gray-500 font-normal">(可选)</span>
                      </Label>
                      <Input
                        id="secret"
                        name="secret"
                        type="text"
                        placeholder="SEC123..."
                        className="transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Feishu Configuration */}
              {channelType === "feishu" && (
                <div className="rounded-xl border border-black/10 bg-gradient-to-br from-green-50/50 to-transparent dark:border-white/10 dark:from-green-950/20 dark:to-transparent p-6 shadow-sm">
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url" className="text-sm font-semibold text-black dark:text-white">
                      Webhook URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="webhook_url"
                      name="webhook_url"
                      type="url"
                      required
                      placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..."
                      className="transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Custom Webhook Configuration */}
              {channelType === "webhook" && (
                <div className="rounded-xl border border-black/10 bg-gradient-to-br from-amber-50/50 to-transparent dark:border-white/10 dark:from-amber-950/20 dark:to-transparent p-6 shadow-sm">
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url" className="text-sm font-semibold text-black dark:text-white">
                      Webhook URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="webhook_url"
                      name="webhook_url"
                      type="url"
                      required
                      placeholder="https://..."
                      className="transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </form>
          </div>

          <DialogFooter className="px-6 py-4 border-black/10 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setError("");
                setChannelType("telegram");
              }}
              disabled={isPending}
              className="transition-all duration-200 cursor-pointer"
            >
              取消
            </Button>
            <Button
              type="submit"
              form="config-form"
              disabled={isPending}
              className="transition-all duration-200 cursor-pointer w-[110px]"
            >
              {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <span>保存</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

