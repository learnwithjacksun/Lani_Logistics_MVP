import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Loading from '../../screens/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'customer' | 'rider';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && userData.role !== allowedRole) {
    // Redirect riders to rider dashboard and customers to main dashboard
    const redirectPath = userData.role === 'rider' ? '/rider-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 