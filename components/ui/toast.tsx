"use client";

import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const iconStyles = {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  const Icon = icons[toast.type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-black/10 bg-white/95 backdrop-blur-xl p-3.5 shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-gray-950/95"
      )}
      style={{
        animation: "toastSlideIn 0.3s ease-out forwards",
      }}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          toast.type === "success" && "bg-green-50 dark:bg-green-950/30",
          toast.type === "error" && "bg-red-50 dark:bg-red-950/30",
          toast.type === "info" && "bg-blue-50 dark:bg-blue-950/30"
        )}
      >
        <Icon className={cn("h-4 w-4", iconStyles[toast.type])} />
      </div>
      <p className="flex-1 text-sm font-semibold text-black dark:text-white">
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-black/5 hover:text-black dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
        aria-label="关闭提示"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto"
        >
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

