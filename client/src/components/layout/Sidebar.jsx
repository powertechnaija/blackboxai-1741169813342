import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { closeSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(closeSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  // Navigation items
  const navigationItems = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/shop', label: 'Shop', icon: 'fas fa-shopping-bag' },
    { path: '/cart', label: 'Cart', icon: 'fas fa-shopping-cart' },
  ];

  // Authenticated user items
  const authItems = [
    { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    { path: '/orders', label: 'Orders', icon: 'fas fa-box' },
    { path: '/wishlist', label: 'Wishlist', icon: 'fas fa-heart' },
  ];

  // Admin items
  const adminItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { path: '/admin/bags', label: 'Manage Bags', icon: 'fas fa-tags' },
    { path: '/admin/orders', label: 'Manage Orders', icon: 'fas fa-clipboard-list' },
    { path: '/admin/users', label: 'Manage Users', icon: 'fas fa-users' },
  ];

  return (
    <>
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center" onClick={handleClose}>
              <img
                src="/logo.svg"
                alt="Fashion Bags"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-serif font-bold text-gray-900">
                Fashion Bags
              </span>
            </Link>
            <button
              onClick={handleClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4">
          {/* Main navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={handleClose}
              >
                <i className={`${item.icon} w-5`}></i>
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Authenticated user navigation */}
          {isAuthenticated && (
            <>
              <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </h3>
                <div className="mt-2 space-y-1">
                  {authItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.path
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={handleClose}
                    >
                      <i className={`${item.icon} w-5`}></i>
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Admin navigation */}
              {user?.role === 'admin' && (
                <div className="mt-8">
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                  <div className="mt-2 space-y-1">
                    {adminItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          location.pathname === item.path
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={handleClose}
                      >
                        <i className={`${item.icon} w-5`}></i>
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <i className="fas fa-sign-out-alt w-5"></i>
              <span className="ml-3">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              onClick={handleClose}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
