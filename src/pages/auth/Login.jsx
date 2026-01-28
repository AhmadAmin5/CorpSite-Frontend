import { AdminHeader } from '../../components';
import LoginForm from '../../features/auth/components/LoginForm'

const Login = () => {
  return (
    <>
      <AdminHeader />
      
      <div className="grow flex items-center justify-center w-full p-4">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;