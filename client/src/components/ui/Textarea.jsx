import React, { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  className = '',
  containerClassName = '',
  labelClassName = '',
  helpText,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={props.id} 
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        className={`
          block w-full rounded-lg
          px-4 py-2
          border
          resize-y
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />

      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
