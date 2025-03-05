import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Dropdown = ({
  trigger,
  items,
  align = 'left',
  width = 'w-48',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown when pressing escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!triggerRef.current) return {};

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    return {
      top: rect.bottom + scrollY,
      left: align === 'right' 
        ? rect.right - dropdownRef.current?.offsetWidth + scrollX
        : rect.left + scrollX
    };
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className={`
            absolute z-50 mt-2 ${width}
            rounded-md shadow-lg
            bg-white ring-1 ring-black ring-opacity-5
          `}
          style={getDropdownPosition()}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-menu"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => {
              // Divider
              if (item.divider) {
                return <hr key={index} className="my-1 border-gray-200" />;
              }

              // Header
              if (item.header) {
                return (
                  <div
                    key={index}
                    className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {item.header}
                  </div>
                );
              }

              // Regular item
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`
                    ${item.className || ''}
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    w-full text-left px-4 py-2 text-sm
                    flex items-center space-x-2
                    hover:bg-gray-100 focus:bg-gray-100
                    focus:outline-none
                    ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
                  `}
                  disabled={item.disabled}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className={item.danger ? 'text-red-500' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// Example usage:
// const items = [
//   {
//     label: 'Profile',
//     icon: <i className="fas fa-user"></i>,
//     onClick: () => console.log('Profile clicked')
//   },
//   {
//     label: 'Settings',
//     icon: <i className="fas fa-cog"></i>,
//     onClick: () => console.log('Settings clicked')
//   },
//   { divider: true },
//   {
//     label: 'Logout',
//     icon: <i className="fas fa-sign-out-alt"></i>,
//     danger: true,
//     onClick: () => console.log('Logout clicked')
//   }
// ];
//
// <Dropdown
//   trigger={
//     <Button>
//       Options <i className="fas fa-chevron-down ml-2"></i>
//     </Button>
//   }
//   items={items}
//   align="right"
// />

export default Dropdown;
