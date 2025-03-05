import { useSelector, useDispatch } from 'react-redux';
import { closeFilterDrawer } from '../../store/slices/uiSlice';
import { selectBagFilters, setFilters, clearFilters } from '../../store/slices/bagSlice';

const FilterDrawer = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectBagFilters);
  const { filterDrawerOpen } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(closeFilterDrawer());
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Filter options
  const categories = [
    'Handbag',
    'Shoulder Bag',
    'Tote',
    'Clutch',
    'Backpack',
    'Crossbody'
  ];

  const colors = [
    'Black',
    'Brown',
    'Beige',
    'White',
    'Red',
    'Blue',
    'Green',
    'Pink'
  ];

  const sizes = [
    'Small',
    'Medium',
    'Large',
    'Extra Large'
  ];

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: '' }
  ];

  if (!filterDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Filter drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 bg-gray-50 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClearFilters}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Clear all
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close filters</span>
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Filter sections */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              {/* Categories */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price ranges */}
              <div className="py-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Price</h3>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                        onChange={() => handleFilterChange('price', {
                          minPrice: range.min,
                          maxPrice: range.max
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="py-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                <div className="grid grid-cols-2 gap-4">
                  {colors.map((color) => (
                    <label key={color} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.color === color}
                        onChange={(e) => handleFilterChange('color', e.target.checked ? color : '')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="py-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Size</h3>
                <div className="grid grid-cols-2 gap-4">
                  {sizes.map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.size === size}
                        onChange={(e) => handleFilterChange('size', e.target.checked ? size : '')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply filters button */}
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <button
                onClick={handleClose}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
