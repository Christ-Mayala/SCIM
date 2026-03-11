import * as React from "react";
import { cn } from "../../lib/utils";

function Input({ className, type, error, errorClassName, label, labelClassName, leftIcon, rightIcon, icon: Icon, ...props }) {
  return (
    <div className="w-full">
      {label ? (
        <div className={cn("mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500", labelClassName)}>
          {label}
        </div>
      ) : null}
      <div className={cn("relative group")}>
        {(leftIcon || Icon) ? (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none transition-colors group-focus-within:text-gold-primary">
            {leftIcon || (Icon ? <Icon className="w-4 h-4" /> : null)}
          </div>
        ) : null}
        <input
          type={type}
          data-slot="input"
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-12 w-full rounded-2xl border px-4 text-sm outline-none transition-all",
            "bg-white/5 border-white/10 text-white placeholder:text-zinc-600",
            "focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/30",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "file:text-white file:bg-transparent file:border-0 file:text-sm",
            (leftIcon || Icon) ? "pl-11" : "",
            rightIcon ? "pr-11" : "",
            error ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "",
            className
          )}
          {...props}
        />
        {rightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 pointer-events-none">
            {rightIcon}
          </div>
        ) : null}
      </div>
      {error ? (
        <div className={cn("mt-1 text-xs text-red-400", errorClassName)}>{error}</div>
      ) : null}
    </div>
  );
}

export { Input };
