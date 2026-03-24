import * as React from 'react';

import { cn } from '../../lib/utils';

function Textarea({ className, label, labelClassName, error, errorClassName, ...props }) {
  return (
    <div className="w-full">
      {label ? <div className={cn("mb-2 text-sm font-medium text-gray-700", labelClassName)}>{label}</div> : null}
      <textarea
        data-slot="textarea"
        aria-invalid={error ? true : undefined}
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-24 w-full rounded-xl border bg-transparent px-4 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', "bg-white/5 border-white/10 text-white placeholder:text-zinc-600",  
          className
        )}
        {...props}
      />
      {error ? <div className={cn("mt-1 text-xs text-red-600", errorClassName)}>{error}</div> : null}
    </div>
  );
}

export { Textarea };
