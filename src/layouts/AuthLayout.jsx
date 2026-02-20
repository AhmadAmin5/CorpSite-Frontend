import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { selectAuthStatus, selectUserRole } from '../features/auth/authSlice';
import { SplashScreen } from '../components';

const AuthLayout = ({ children, authentication = true, roles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);

  const authStatus = useSelector(selectAuthStatus);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
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
