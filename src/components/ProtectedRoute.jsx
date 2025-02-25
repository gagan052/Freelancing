import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
