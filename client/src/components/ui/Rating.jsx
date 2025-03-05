import React, { useState } from 'react';

const Rating = ({
  value = 0,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  className = ''
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  // Size classes for stars
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Generate stars array
  const stars = Array.from({ length: max }, (_, index) => {
    const starNumber = index + 1;
    const filled = interactive
      ? starNumber <= (hoverValue || value)
      : starNumber <= value;

    return {
      filled,
      starNumber
    };
  });

  // Handle mouse events for interactive mode
  const handleMouseEnter = (starNumber) => {
    if (interactive) {
      setHoverValue(starNumber);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverValue(0);
    }
  };

  const handleClick = (starNumber) => {
    if (interactive && onChange) {
      onChange(starNumber);
    }
  };

  return (
    <div
      className={`flex items-center ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {stars.map(({ filled, starNumber }) => (
        <button
          key={starNumber}
          type={interactive ? 'button' : undefined}
          onClick={() => handleClick(starNumber)}
          onMouseEnter={() => handleMouseEnter(starNumber)}
          className={`
            ${interactive ? 'cursor-pointer focus:outline-none' : 'cursor-default'}
            ${sizeClasses[size]}
            p-0.5
          `}
          aria-label={`${starNumber} star${starNumber === 1 ? '' : 's'}`}
          disabled={!interactive}
        >
          <i
            className={`
              ${filled ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'}
              transition-colors duration-150
            `}
          ></i>
        </button>
      ))}
    </div>
  );
};

// Rating with label and optional review count
export const RatingWithLabel = ({
  value,
  reviewCount,
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Rating value={value} size={size} />
      <span className="ml-2 text-gray-600">
        {value.toFixed(1)}
        {reviewCount !== undefined && (
          <span className="text-gray-500 ml-1">
            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </span>
    </div>
  );
};

// Interactive rating input with label
export const RatingInput = ({
  label,
  value,
  onChange,
  error,
  size = 'lg',
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Rating
        value={value}
        onChange={onChange}
        interactive
        size={size}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Rating;
