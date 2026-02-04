import { AdminHeader } from '../../components';
import LoginForm from '../../features/auth/components/LoginForm';

const Login = () => {
  return (
    <>
      <AdminHeader />
      <div className="grow flex items-start md:items-center justify-center w-full p-4 pt-24 md:pt-4">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
