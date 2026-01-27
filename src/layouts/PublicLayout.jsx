import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';
import { PublicFooter, PublicHeader } from '../components';

const PublicLayout = () => {
  const user = useSelector(selectUser);
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="grow">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
