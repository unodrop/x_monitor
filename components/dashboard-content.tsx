"use client";

import { useRef, useEffect } from "react";
import { MonitorTargetsTable } from "@/components/monitor-targets-table";
import { AddTargetButton } from "@/components/add-target-button";

interface MonitorTarget {
  id: string;
  x_handle: string;
  name: string;
  status: "active" | "paused";
  notification_config_id: string | null;
  notification_configs: {
    id: string;
    name: string;
    channel_type: string;
  } | null;
  created_at: string;
}

interface DashboardContentProps {
  initialTargets: MonitorTarget[];
}

export function DashboardContent({ initialTargets }: DashboardContentProps) {
  const refreshRef = useRef<(() => void) | undefined>(undefined);

  // 监听自定义事件，当添加成功时触发刷新
  useEffect(() => {
    const handleRefresh = () => {
      if (refreshRef.current) {
        refreshRef.current();
      }
    };

    window.addEventListener('refresh-targets', handleRefresh);
    return () => {
      window.removeEventListener('refresh-targets', handleRefresh);
    };
  }, []);

  return (
    <MonitorTargetsTable 
      initialTargets={initialTargets} 
      onRefresh={refreshRef}
    />
  );
}

// 导出用于 header 的 AddTargetButton wrapper
export function AddTargetButtonWrapper() {
  const handleSuccess = () => {
    // 触发自定义事件，通知表格刷新
    window.dispatchEvent(new Event('refresh-targets'));
  };

  return <AddTargetButton onSuccess={handleSuccess} />;
}

