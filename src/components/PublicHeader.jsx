import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const PublicHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-(--card) border-b border-(--border) p-4 flex justify-between items-center">
      <Logo />
      <button onClick={() => { navigate("login") }}>Login</button>
    </header>
  );
};

export default PublicHeader;
