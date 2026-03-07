import { useState, useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ServerCrash, RefreshCcw } from 'lucide-react';
import './App.css';
import useTheme from './hooks/useTheme.js';
import { NetworkAlert, TopLoader, SplashScreen, Button } from './components';
import axiosInstance from './api/axios.js';

const App = () => {
  useTheme();

  // States: 'checking', 'waking', 'ready', 'error'
  const [serverState, setServerState] = useState('checking');

  useEffect(() => {
    let isMounted = true;

    const wakeUpServer = async () => {
      const sleepTimer = setTimeout(() => {
        if (isMounted) setServerState('waking');
      }, 5000);

      try {
        await axiosInstance.get('/health', { timeout: 60000 });

        clearTimeout(sleepTimer);
        if (isMounted) setServerState('ready');
      } catch (error) {
        clearTimeout(sleepTimer);
        console.error('Server health check failed:', error);
        if (isMounted) setServerState('error');
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
        subMessage="This site is using free servers for presentation purpose, which sleeps after inactivity. It usually takes 1 minute to spin up. Thank you for your patience!"
      />
    );
  }

  if (serverState === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-(--background) text-(--foreground) p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <ServerCrash className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">
            Server Unreachable
          </h1>
          <p className="text-(--secondary)">
            The server is taking long to respond. Please try again.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
          icon={<RefreshCcw className="w-4 h-4" />}
          text="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground)">
      <TopLoader />
      <NetworkAlert />
      <ScrollRestoration />
      <Outlet />
    </div>
  );
};

export default App;
