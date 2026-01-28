import { Login as LoginComponent, AdminHeader } from '../components';

const Login = () => {
  return (
    <>
      <AdminHeader />
      
      <div className="grow flex items-center justify-center w-full p-4">
        <LoginComponent />
      </div>
    </>
  );
};

export default Login;