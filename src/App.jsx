import { Outlet } from 'react-router-dom';
import './App.css';
import useTheme from './hooks/useTheme.js';
import { TopLoader } from './components';

const App = () => {
  useTheme();
  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground) transition-colors duration-200">
      <TopLoader />
      <Outlet />
    </div>
  );
};

export default App;
