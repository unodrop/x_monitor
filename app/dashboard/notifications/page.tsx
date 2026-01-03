import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getNotificationConfigs } from "@/app/actions/notification-configs";
import { NotificationConfigsList } from "@/components/notification-configs-list";
import { AddConfigButton } from "@/components/add-config-button";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const configs = await getNotificationConfigs();

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-gray-950/50 px-10 py-8 shadow-sm">
        <div className="flex items-center justify-end">
          <AddConfigButton />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <NotificationConfigsList initialConfigs={configs} />
      </div>
    </div>
  );
}
