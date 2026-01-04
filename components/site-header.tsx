"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Coins, BarChart3 } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "首页",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/daily",
      label: "加密日报",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/airdrops",
      label: "空投",
      icon: <Coins className="h-4 w-4" />,
    },

  ];

  return (
    <header className="border-b border-black/10 dark:border-white/10 sticky top-0 z-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-2 px-1 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-black dark:text-white"
                    : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <span className={isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100 transition-opacity"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

