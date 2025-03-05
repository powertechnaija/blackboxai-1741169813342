import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectGlobalLoading } from '../../store/slices/uiSlice';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import SearchOverlay from './SearchOverlay';
import CartDrawer from './CartDrawer';
import FilterDrawer from './FilterDrawer';
import LoadingOverlay from '../ui/LoadingOverlay';
import NotificationStack from '../ui/NotificationStack';
import ScrollToTop from '../ui/ScrollToTop';

const Layout = () => {
  const isLoading = useSelector(selectGlobalLoading);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global loading overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Navigation */}
      <Navbar />

      {/* Sidebar for mobile navigation */}
      <Sidebar />

      {/* Search overlay */}
      <SearchOverlay />

      {/* Shopping cart drawer */}
      <CartDrawer />

      {/* Filter drawer for mobile */}
      <FilterDrawer />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Notifications */}
      <NotificationStack />

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
