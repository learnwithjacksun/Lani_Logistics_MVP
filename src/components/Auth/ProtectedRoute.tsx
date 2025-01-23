import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks';

const ProtectedRoute = () => {
  const { user } = useAuth();
  // const location = useLocation();
  // const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  // const redirectPath = userData?.role === 'rider' ? '/rider-dashboard' : '/dashboard';

  console.log(user);

 return user? <Outlet/> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 