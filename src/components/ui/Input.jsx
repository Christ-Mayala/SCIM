import * as React from "react";

import { cn } from "../../lib/utils";

function Input({ className, type, error, errorClassName, label, labelClassName, leftIcon, rightIcon, ...props }) {
  return (
    <div className="w-full">
      {label ? <div className={cn("mb-2 text-sm font-medium text-gray-700", labelClassName)}>{label}</div> : null}
      <div className={cn("relative")}>
        {leftIcon ? <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div> : null}
        <input
          type={type}
          data-slot="input"
          aria-invalid={error ? true : undefined}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-xl border bg-transparent px-4 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
        {rightIcon ? <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div> : null}
      </div>
      {error ? <div className={cn("mt-1 text-xs text-red-600", errorClassName)}>{error}</div> : null}
    </div>
  );
}

export { Input };
