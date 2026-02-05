import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { selectAuthStatus, selectUserRole } from '../features/auth/authSlice';
// Import SplashScreen instead of Spinner
import { SplashScreen } from '../components';

const AuthLayout = ({ children, authentication = true, roles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);

  const authStatus = useSelector(selectAuthStatus);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    // Artificial delay check to prevent flashing?
    // Usually not needed if Redux state is instant, but good for UX if async.

    if (authentication && !authStatus) {
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    } else if (!authentication && authStatus) {
      navigate('/admin/dashboard', { replace: true });
    } else if (
      authentication &&
      roles.length > 0 &&
      !roles.includes(userRole)
    ) {
      navigate('/unauthorized', { replace: true });
    } else {
      setLoader(false);
    }
  }, [authStatus, userRole, navigate, authentication, roles, location]);

  return loader ? (
    <SplashScreen message="Verifying access..." />
  ) : (
    <>{children ? children : <Outlet />}</>
  );
};

export default AuthLayout;
