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
      {label ? <div className="mb-2 text-sm font-medium text-gray-700">{label}</div> : null}
      <div className="relative">
        {leftIcon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
            'h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-gold-primary transition-colors',
            'appearance-none', // Retirer le style par défaut pour mieux contrôler le rendu
            disabled ? 'opacity-60 cursor-not-allowed' : '',
            error ? 'border-red-300 focus:border-red-500' : '',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className
          )}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {/* Flèche personnalisée ou icône droite */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {rightIcon ? rightIcon : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down opacity-50"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </div>
      </div>
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </div>
  );
};

export { Select };
