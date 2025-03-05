import React from 'react';

const variants = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-800'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base'
};

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = true,
  icon,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <span className={`mr-1 ${size === 'sm' ? 'text-xs' : ''}`}>
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            ml-1 -mr-1 hover:bg-opacity-20 hover:bg-black rounded-full
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${variant}-100 focus:ring-${variant}-500
          `}
        >
          <span className="sr-only">Remove</span>
          <i className={`fas fa-times ${size === 'sm' ? 'text-xs' : ''}`}></i>
        </button>
      )}
    </span>
  );
};

// Predefined badge variants
export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: {
      variant: 'success',
      icon: <i className="fas fa-check-circle"></i>,
      label: 'Active'
    },
    inactive: {
      variant: 'gray',
      icon: <i className="fas fa-times-circle"></i>,
      label: 'Inactive'
    },
    pending: {
      variant: 'warning',
      icon: <i className="fas fa-clock"></i>,
      label: 'Pending'
    },
    error: {
      variant: 'danger',
      icon: <i className="fas fa-exclamation-circle"></i>,
      label: 'Error'
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

export const OrderStatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    pending: {
      variant: 'warning',
      icon: <i className="fas fa-clock"></i>,
      label: 'Pending'
    },
    processing: {
      variant: 'info',
      icon: <i className="fas fa-cog"></i>,
      label: 'Processing'
    },
    shipped: {
      variant: 'primary',
      icon: <i className="fas fa-shipping-fast"></i>,
      label: 'Shipped'
    },
    delivered: {
      variant: 'success',
      icon: <i className="fas fa-check-circle"></i>,
      label: 'Delivered'
    },
    cancelled: {
      variant: 'danger',
      icon: <i className="fas fa-times-circle"></i>,
      label: 'Cancelled'
    },
    refunded: {
      variant: 'secondary',
      icon: <i className="fas fa-undo"></i>,
      label: 'Refunded'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

export default Badge;
