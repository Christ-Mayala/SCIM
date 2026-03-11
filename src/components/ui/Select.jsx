import React from 'react';
import { cn } from '../../lib/utils';

const Select = ({
  className,
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <div className={cn('w-full')}>
      {label ? <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</div> : null}
      <div className="relative">
        {leftIcon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            {leftIcon}
          </div>
        ) : null}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-12 w-full rounded-2xl border px-4 text-sm outline-none transition-colors appearance-none',
            'bg-white/5 border-white/10 text-white',
            'focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/30',
            '[&>option]:bg-zinc-900 [&>option]:text-white',
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
            error ? 'border-red-500/60 focus:border-red-500' : '',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className
          )}
          {...props}
        >
          {placeholder ? <option value="" className="text-zinc-500">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-zinc-900 text-white">
              {o.label}
            </option>
          ))}
        </select>
        {/* Arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
          {rightIcon ? rightIcon : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </div>
      </div>
      {error ? <div className="mt-1 text-xs text-red-400">{error}</div> : null}
    </div>
  );
};

export { Select };
