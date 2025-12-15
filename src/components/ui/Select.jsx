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
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label ? <div className="mb-2 text-sm font-medium text-gray-700">{label}</div> : null}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        className={cn(
          'h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-gold-primary',
          disabled ? 'opacity-60 cursor-not-allowed' : '',
          error ? 'border-red-300 focus:border-red-500' : '',
        )}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </div>
  );
};

export { Select };
