import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAuthStatus, selectUserRole } from '../features/auth/authSlice';
import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children, authentication = true, roles = [] }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  const authStatus = useSelector(selectAuthStatus);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate('/login');
    } else if (!authentication && authStatus) {
      navigate('/admin');
    } else if (
      authentication &&
      roles.length > 0 &&
      !roles.includes(userRole)
    ) {
      navigate('/unauthorized');
    }

    setLoader(false);
  }, [authStatus, userRole, navigate, authentication, roles]);

  return loader ? (
    <h1>Loading Route...</h1>
  ) : (
    <>{children ? children : <Outlet />}</>
  );
};

export default AuthLayout;
