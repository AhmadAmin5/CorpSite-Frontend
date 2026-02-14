import { ShieldAlert, LogIn, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorLayout from '../../layouts/ErrorLayout';
import { Button } from '../../components';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const actions = (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="border border-(--border)"
        text="Home"
        icon={<Home />}
      />

      <Button
        variant="primary"
        onClick={handleLoginRedirect}
        text="Log In"
        icon={<LogIn />}
      />
    </>
  );

  return (
    <ErrorLayout
      icon={ShieldAlert}
      title="Access Restricted"
      description="You don't have permission to view this page, or your session may have expired."
      customActions={actions}
    />
  );
};

export default Unauthorized;
