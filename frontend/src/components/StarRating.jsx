import React, { useState } from 'react';

const StarRating = ({ rating, onRate, size = 'md', interactive = true, showValue = true }) => {
  const [hover, setHover] = useState(0);

  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`${sizes[size]} transition-all duration-150 ${
            interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          } ${(hover || rating) >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 dark:text-gray-600'}`}
        >
          ★
        </button>
      ))}
      {showValue && rating > 0 && (
        <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;