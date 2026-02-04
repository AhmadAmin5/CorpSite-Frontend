import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // 1. Import useLocation
import { selectAuthStatus, selectUserRole } from '../features/auth/authSlice';
import { Spinner } from '../components'; // 2. Assuming you have this from our components export

const AuthLayout = ({ children, authentication = true, roles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 1. Get current location
  const [loader, setLoader] = useState(true);

  const authStatus = useSelector(selectAuthStatus);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (authentication && !authStatus) {
      // Redirect to login, but REMEMBER where they were coming from
      navigate('/login', {
        state: { from: location }, 
        replace: true,
      });
    }
    else if (!authentication && authStatus) {
      navigate('/admin/dashboard', { replace: true });
    }
    else if (authentication && roles.length > 0 && !roles.includes(userRole)) {
      navigate('/unauthorized', { replace: true });
    }
    else {
      setLoader(false);
    }
  }, [authStatus, userRole, navigate, authentication, roles, location]);

  return loader ? (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-(--background) gap-3">
      <Spinner size="lg" />
      <p className="text-(--secondary) text-sm font-medium animate-pulse">
        Verifying access...
      </p>
    </div>
  ) : (
    <>{children ? children : <Outlet />}</>
  );
};

export default AuthLayout;
