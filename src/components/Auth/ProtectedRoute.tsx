import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'customer' | 'rider';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, userData } = useAuth();
  const location = useLocation();

  

  if (!user || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && userData.role !== allowedRole) {
    const redirectPath = userData.role === 'rider' ? '/rider-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 