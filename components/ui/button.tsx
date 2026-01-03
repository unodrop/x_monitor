import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white shadow-lg hover:bg-gray-900 hover:shadow-xl dark:bg-white dark:text-black dark:hover:bg-gray-100",
        outline:
          "border border-black/10 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md dark:border-white/10 dark:bg-gray-900/50 dark:text-white dark:hover:bg-gray-800",
        ghost:
          "hover:bg-black/5 dark:hover:bg-white/5",
        destructive:
          "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl dark:bg-red-500 dark:hover:bg-red-600",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

