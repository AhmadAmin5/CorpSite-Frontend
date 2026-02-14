import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import Button from "../ui/Button"
import { LogIn as LoginIcon } from 'lucide-react';

const PublicHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-(--card) border-b border-(--border) p-4 flex justify-between items-center">
      <Logo />
      <Button variant="ghost" text="Log In" icon={<LoginIcon/>} onClick={() => {navigate('login')}} />
    </header>
  );
};

export default PublicHeader;
