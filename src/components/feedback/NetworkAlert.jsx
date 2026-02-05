import { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const NetworkAlert = () => {
  const isOnline = useOnlineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);
  const prevStatusRef = useRef(isOnline);

  useEffect(() => {
    if (prevStatusRef.current === false && isOnline === true) {
      setShowBackOnline(true);
      const timer = setTimeout(() => setShowBackOnline(false), 4000);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = isOnline;
  }, [isOnline]);

  if (isOnline && !showBackOnline) return null;

  const isOffline = !isOnline;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-10000">
      <div
        className={`
          flex items-center gap-3 p-3 pr-6 
          rounded-xl border shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
          bg-(--card) 
          animate-in slide-in-from-top-4 fade-in duration-300
          ${isOffline ? 'border-error/20' : 'border-success/20'}
        `}
      >
        <div
          className={`
            p-2.5 rounded-lg shrink-0 flex items-center justify-center
            ${
              isOffline
                ? 'bg-error/10 text-error'
                : 'bg-success/10 text-success'
            }
          `}
        >
          {isOffline ? (
            <WifiOff className="w-5 h-5" />
          ) : (
            <Wifi className="w-5 h-5" />
          )}
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-(--foreground) leading-none mb-1">
            {isOffline ? 'Connection Lost' : 'Back Online'}
          </h4>
          <p className="text-xs font-medium text-(--secondary)">
            {isOffline
              ? 'Attempting to reconnect...'
              : 'You are connected to the internet.'}
          </p>
        </div>

        {isOffline && (
          <div className="ml-2 flex items-center justify-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkAlert;
