import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import PublicFooter from '../components/layout/PublicFooter';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-(--background) text-(--foreground) transition-colors duration-300">
      <PublicHeader />
      <main className="grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
