import React from 'react';
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
  const rating = typeof value === 'number' && !isNaN(value) ? Math.max(0, Math.min(5, value)) : 0;
  const filled = Math.round(rating);

  const handleStarClick = (starValue) => {
    if (interactive && !disabled && onRate) {
      onRate(starValue);
    }
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[1,2,3,4,5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={disabled || !interactive}
          onClick={() => handleStarClick(i)}
          className={cn(
            'p-0.5 rounded transition-colors',
            interactive && !disabled && 'hover:scale-110 cursor-pointer',
            interactive && disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <Star 
            className={cn(
              'w-5 h-5 transition-colors',
              i <= filled ? 'text-gold-primary fill-current' : 'text-gray-300',
              interactive && !disabled && i <= filled ? 'hover:text-yellow-500' : 'hover:text-yellow-400'
            )} 
          />
        </button>
      ))}
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
