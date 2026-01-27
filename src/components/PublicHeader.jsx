import Logo from './Logo';

const PublicHeader = () => {
  return (
    <header className="bg-(--card) border-b border-(--border) p-4 flex justify-between items-center">
      <Logo />
    </header>
  );
};

export default PublicHeader;
