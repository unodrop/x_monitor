"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "bg-black text-white shadow-lg dark:bg-white dark:text-black"
          : "text-black hover:bg-black/5 hover:shadow-sm dark:text-white dark:hover:bg-white/5"
      } ${isPending ? "opacity-50" : ""} cursor-pointer`}
    >
      <span>{children}</span>
    </Link>
  );
}

