import * as React from 'react';

import { cn } from '../../lib/utils';

function Textarea({ className, label, error, ...props }) {
  return (
    <div className={cn('w-full', className)}>
      {label ? <div className="mb-2 text-sm font-medium text-gray-700">{label}</div> : null}
      <textarea
        data-slot="textarea"
        aria-invalid={error ? true : undefined}
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-24 w-full rounded-xl border bg-transparent px-4 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </div>
  );
}

export { Textarea };
