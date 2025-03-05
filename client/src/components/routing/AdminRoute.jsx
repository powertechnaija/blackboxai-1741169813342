import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // If auth is loading, return null or loading spinner
  if (loading) {
    return null; // or return <LoadingOverlay />
  }

  // If not authenticated or not an admin, redirect to login or home
  if (!isAuthenticated || user?.role !== 'admin') {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // If authenticated but not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, render child routes
  return <Outlet />;
};

export default AdminRoute;
