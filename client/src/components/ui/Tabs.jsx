import React, { useState } from 'react';

const Tabs = ({
  tabs,
  defaultTab,
  variant = 'default',
  fullWidth = false,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  // Variant styles
  const variants = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent hover:border-gray-300',
      activeTab: 'border-primary-500 text-primary-600',
      inactiveTab: 'text-gray-500 hover:text-gray-700'
    },
    pills: {
      container: 'space-x-2',
      tab: 'rounded-full',
      activeTab: 'bg-primary-100 text-primary-700',
      inactiveTab: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
    },
    bordered: {
      container: 'border border-gray-200 rounded-lg p-1 bg-gray-50',
      tab: 'rounded-md',
      activeTab: 'bg-white text-primary-600 shadow',
      inactiveTab: 'text-gray-500 hover:text-gray-700'
    }
  };

  const variantStyle = variants[variant];

  return (
    <div className={className}>
      {/* Tab headers */}
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyle.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center px-4 py-2 font-medium text-sm
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${fullWidth ? 'flex-1 justify-center' : ''}
              ${variantStyle.tab}
              ${activeTab === tab.id
                ? variantStyle.activeTab
                : variantStyle.inactiveTab
              }
            `}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && (
              <span className={`mr-2 ${activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'}`}>
                {tab.icon}
              </span>
            )}
            {tab.label}
            {tab.badge && (
              <span className={`
                ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                ${activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            className={activeTab === tab.id ? '' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage:
// const tabs = [
//   {
//     id: 'details',
//     label: 'Details',
//     icon: <i className="fas fa-info-circle" />,
//     content: <div>Details content</div>
//   },
//   {
//     id: 'reviews',
//     label: 'Reviews',
//     icon: <i className="fas fa-star" />,
//     badge: '12',
//     content: <div>Reviews content</div>
//   }
// ];
//
// <Tabs
//   tabs={tabs}
//   defaultTab="details"
//   variant="pills"
//   fullWidth={false}
// />

export default Tabs;
