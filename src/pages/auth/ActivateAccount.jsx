import { AdminHeader } from '../../components';
import ActivateAccountForm from '../../features/auth/components/ActivateAccountForm';

const ActivateAccount = () => {
  return (
    <>
      <AdminHeader />
      <div className="grow flex items-start md:items-center justify-center w-full p-4 pt-24 md:pt-4 bg-(--background) min-h-[calc(100vh-64px)]">
        <ActivateAccountForm />
      </div>
    </>
  );
};

export default ActivateAccount;
