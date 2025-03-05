import React from 'react';

const variants = {
  info: {
    bg: 'bg-blue-50',
    icon: 'fas fa-info-circle text-blue-400',
    title: 'text-blue-800',
    text: 'text-blue-700',
    close: 'text-blue-500 hover:bg-blue-100'
  },
  success: {
    bg: 'bg-green-50',
    icon: 'fas fa-check-circle text-green-400',
    title: 'text-green-800',
    text: 'text-green-700',
    close: 'text-green-500 hover:bg-green-100'
  },
  warning: {
    bg: 'bg-yellow-50',
    icon: 'fas fa-exclamation-triangle text-yellow-400',
    title: 'text-yellow-800',
    text: 'text-yellow-700',
    close: 'text-yellow-500 hover:bg-yellow-100'
  },
  error: {
    bg: 'bg-red-50',
    icon: 'fas fa-exclamation-circle text-red-400',
    title: 'text-red-800',
    text: 'text-red-700',
    close: 'text-red-500 hover:bg-red-100'
  }
};

const Alert = ({
  variant = 'info',
  title,
  children,
  icon,
  dismissible = true,
  onDismiss,
  className = ''
}) => {
  const style = variants[variant];

  return (
    <div
      className={`
        rounded-lg p-4
        ${style.bg}
        ${className}
      `}
      role="alert"
    >
      <div className="flex">
        {/* Icon */}
        {icon !== false && (
          <div className="flex-shrink-0">
            <i className={`${icon || style.icon} text-lg`}></i>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 ${icon !== false ? 'ml-3' : ''}`}>
          {title && (
            <h3 className={`text-sm font-medium ${style.title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${style.text} ${title ? 'mt-2' : ''}`}>
            {children}
          </div>
        </div>

        {/* Dismiss button */}
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <button
              className={`
                inline-flex rounded-md p-1.5
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${style.close}
              `}
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Predefined alert variants
export const InfoAlert = (props) => <Alert variant="info" {...props} />;
export const SuccessAlert = (props) => <Alert variant="success" {...props} />;
export const WarningAlert = (props) => <Alert variant="warning" {...props} />;
export const ErrorAlert = (props) => <Alert variant="error" {...props} />;

// Example usage:
// <Alert
//   variant="success"
//   title="Order completed"
//   dismissible
//   onDismiss={() => console.log('dismissed')}
// >
//   Your order has been successfully processed.
// </Alert>
//
// Or use predefined variants:
// <SuccessAlert title="Order completed">
//   Your order has been successfully processed.
// </SuccessAlert>

export default Alert;
