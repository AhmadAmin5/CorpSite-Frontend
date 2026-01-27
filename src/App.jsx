import { Outlet } from 'react-router-dom';
import './App.css';
import useTheme from './hooks/useTheme.js';

const App = () => {
  useTheme();
  return (
    <div className="bg-(--background) text-(--foreground) transition-colors duration-200">
      <Outlet />
    </div>
  );
};

export default App;
