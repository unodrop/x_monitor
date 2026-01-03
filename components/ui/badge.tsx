import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white shadow-lg dark:bg-white dark:text-black",
        secondary:
          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        outline:
          "border border-black/10 text-black dark:border-white/10 dark:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

