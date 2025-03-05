import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = ({ items, className = '', separator = '/' }) => {
  const location = useLocation();

  // If no items are provided, generate from current path
  if (!items) {
    const paths = location.pathname.split('/').filter(Boolean);
    items = paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        url
      };
    });

    // Add home as first item
    items.unshift({ label: 'Home', url: '/' });
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.url} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {typeof separator === 'string' ? (
                  separator
                ) : (
                  <i className="fas fa-chevron-right text-xs"></i>
                )}
              </span>
            )}
            {index === items.length - 1 ? (
              <span className="text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.url}
                className="text-primary-600 hover:text-primary-700"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Example usage:
// <Breadcrumbs
//   items={[
//     { label: 'Home', url: '/' },
//     { label: 'Shop', url: '/shop' },
//     { label: 'Category', url: '/shop/category' },
//     { label: 'Product Name' }
//   ]}
// />
//
// Or let it generate automatically from the current path:
// <Breadcrumbs />

export default Breadcrumbs;
