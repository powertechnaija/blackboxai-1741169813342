import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotalItems } from '../../store/slices/cartSlice';
import { toggleSidebar, toggleSearch, openModal } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemsCount = useSelector(selectCartTotalItems);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            <i className="fas fa-bars text-xl"></i>
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Fashion Bags"
              />
              <span className="ml-2 text-xl font-serif font-bold text-gray-900">
                Fashion Bags
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
                location.pathname === '/' ? 'text-primary-600' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
                location.pathname === '/shop' ? 'text-primary-600' : ''
              }`}
            >
              Shop
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => dispatch(toggleSearch())}
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <span className="sr-only">Search</span>
              <i className="fas fa-search text-xl"></i>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-gray-900 relative"
            >
              <span className="sr-only">Cart</span>
              <i className="fas fa-shopping-bag text-xl"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => dispatch(openModal({ modalType: 'userMenu' }))}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <img
                    src={user.profileImage || '/default-avatar.png'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="hidden md:block text-sm font-medium">
                    {user.name}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => dispatch(openModal({ modalType: 'login' }))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
