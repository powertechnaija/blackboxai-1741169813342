import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  clickable = false,
  onClick,
  padding = true,
  shadow = true,
  border = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg
        ${padding ? 'p-6' : ''}
        ${shadow ? 'shadow-md' : ''}
        ${border ? 'border border-gray-200' : ''}
        ${hover ? 'transition-transform duration-200 hover:-translate-y-1' : ''}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

export const CardSubtitle = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
};

// Product Card specific variant
export const ProductCard = ({
  image,
  name,
  brand,
  price,
  rating,
  discount,
  onAddToCart,
  onAddToWishlist,
  onClick,
  className = ''
}) => {
  return (
    <Card
      hover
      clickable
      padding={false}
      onClick={onClick}
      className={`overflow-hidden ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            {discount}% OFF
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist?.();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <i className="far fa-heart"></i>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{brand}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {discount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${(price / (1 - discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          
          {rating && (
            <div className="flex items-center">
              <i className="fas fa-star text-yellow-400 text-sm"></i>
              <span className="ml-1 text-sm text-gray-600">{rating}</span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
          className="mt-4 w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </Card>
  );
};

export default Card;
