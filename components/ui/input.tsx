import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black shadow-sm transition-all placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

