import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

const StarRating = ({ 
  value = 0, 
  showNumber = true, 
  className, 
  interactive = false, 
  onRate,
  disabled = false 
}) => {
  const [hovered, setHovered] = useState(0);
  const rating = typeof value === 'number' && !isNaN(value) ? Math.max(0, Math.min(5, value)) : 0;
  const filled = Math.round(rating);
  const display = hovered > 0 ? hovered : filled;

  const handleStarClick = (starValue) => {
    if (interactive && !disabled && onRate) {
      onRate(starValue);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1,2,3,4,5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={disabled || !interactive}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => interactive && !disabled && setHovered(i)}
          onMouseLeave={() => interactive && !disabled && setHovered(0)}
          className={cn(
            'p-0.5 rounded transition-all duration-150',
            interactive && !disabled && 'hover:scale-125 cursor-pointer',
            interactive && disabled && 'cursor-not-allowed opacity-50',
            !interactive && 'cursor-default'
          )}
        >
          <Star 
            className={cn(
              'w-6 h-6 transition-colors duration-150',
              i <= display 
                ? 'text-gold-primary fill-current drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]' 
                : 'text-zinc-600 hover:text-zinc-400'
            )} 
          />
        </button>
      ))}
      {showNumber && (
        <span className="text-sm text-zinc-400 ml-1 font-bold">{rating > 0 ? rating.toFixed(1) : '—'}</span>
      )}
    </div>
  );
};

export default StarRating;
