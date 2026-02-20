import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import useTheme from './hooks/useTheme.js';
import { NetworkAlert, TopLoader, SplashScreen } from './components';
import axiosInstance from './api/axios.js'; // Import your axios instance

const App = () => {
  useTheme();
  
  const [serverState, setServerState] = useState('checking');

  useEffect(() => {
    let isMounted = true;

    const wakeUpServer = async () => {
      const sleepTimer = setTimeout(() => {
        if (isMounted) setServerState('waking');
      }, 1500);

      try {
        await axiosInstance.get('/setting'); 
      } catch (error) {
        console.warn('Initial server ping failed, but proceeding...', error);
      } finally {
        clearTimeout(sleepTimer);
        if (isMounted) setServerState('ready');
      }
    };

    wakeUpServer();

    return () => {
      isMounted = false;
    };
  }, []);

  if (serverState === 'checking') {
    return <SplashScreen message="Connecting to workspace..." />;
  }

  if (serverState === 'waking') {
    return (
      <SplashScreen 
        message="Waking up the backend server..." 
        subMessage="The server used for this site's presentation sleeps after inactivity. It usually takes 10-20 seconds to spin up. Thank you for your patience!"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground) transition-colors duration-200">
      <TopLoader />
      <NetworkAlert />
      <Outlet />
    </div>
  );
};

export default App;