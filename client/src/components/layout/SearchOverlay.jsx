import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeSearch } from '../../store/slices/uiSlice';
import bagService from '../../services/bagService';

const SearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { searchOpen } = useSelector((state) => state.ui);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        dispatch(closeSearch());
      }
    };

    if (searchOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [searchOpen, dispatch]);

  // Handle search
  useEffect(() => {
    const searchBags = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await bagService.searchBags(query);
        setResults(data);
      } catch (err) {
        setError('Failed to search bags');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchBags, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleClose = () => {
    dispatch(closeSearch());
    setQuery('');
    setResults([]);
  };

  const handleSelect = (bagId) => {
    handleClose();
    navigate(`/bag/${bagId}`);
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Search container */}
      <div className="fixed inset-x-0 top-0 bg-white p-4 shadow-lg transform transition-transform">
        <div className="max-w-3xl mx-auto">
          {/* Search input */}
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for bags..."
              className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
            <button
              onClick={handleClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Search results */}
          {query.trim() && (
            <div className="mt-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="spinner"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((bag) => (
                    <button
                      key={bag._id}
                      onClick={() => handleSelect(bag._id)}
                      className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <img
                        src={bag.images[0]}
                        alt={bag.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-1 text-left">
                        <h4 className="text-sm font-medium text-gray-900">
                          {bag.name}
                        </h4>
                        <p className="text-sm text-gray-500">{bag.brand}</p>
                        <p className="text-sm font-medium text-primary-600">
                          ${bag.variants[0].price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick links */}
          {!query.trim() && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Handbags', 'Tote Bags', 'Crossbody', 'Clutches'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
