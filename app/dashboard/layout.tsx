import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Home } from "lucide-react";
import { logout } from "@/app/actions/logout";
import { NavLink } from "@/components/nav-link";
import { ToastProvider } from "@/components/toast-provider";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black via-gray-950 to-black">
      {/* Sidebar */}
      <aside className="w-60 border-r border-black/10 bg-white/90 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-gray-950/90">
        <div className="flex h-full flex-col">
          <div className="p-6 pb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-black to-gray-900 shadow-lg transition-transform duration-200 hover:scale-105 dark:from-white dark:to-gray-100">
                <span className="text-lg font-bold text-white dark:text-black">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-black dark:text-white">
                  X Monitor
                </h1>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  KOL 监控平台
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-black/5 hover:shadow-sm dark:text-white dark:hover:bg-white/5 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>首页</span>
            </Link>
            <NavLink href="/dashboard">KOL 管理</NavLink>
            <NavLink href="/dashboard/notifications">通知分组</NavLink>
          </nav>

          <div className="border-t border-black/10 dark:border-white/10 p-4">
            <div className="mb-3 rounded-lg border border-black/5 bg-white/60 backdrop-blur-sm px-3 py-2.5 transition-all duration-200 hover:bg-white/80 hover:border-black/10 dark:border-white/5 dark:bg-gray-900/40 dark:hover:bg-gray-900/60">
              <p className="truncate text-xs font-semibold text-black dark:text-white">
                {user.email}
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 bg-white/80 px-3 py-2.5 text-xs font-semibold text-black shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-black/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-1 dark:border-white/10 dark:bg-gray-900/50 dark:text-white dark:hover:bg-gray-800 dark:hover:border-white/20 dark:focus:ring-white/10 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>退出登录</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ToastProvider>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </ToastProvider>
      </main>
    </div>
  );
}

