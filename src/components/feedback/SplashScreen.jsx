import { Logo } from '../';
import { Spinner } from '../';

const SplashScreen = ({ message = 'Loading...', subMessage }) => {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-(--background) transition-colors duration-300">
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          <div className="relative bg-(--card) p-4 rounded-2xl border border-(--border) shadow-xl">
            <Logo size={48} link={false} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Spinner size="md" className="text-primary opacity-80" />
          <p className="text-sm font-medium text-(--secondary) animate-pulse">
            {message}
          </p>
          {subMessage && (
            <p className="text-sm text-(--secondary) mt-4 max-w-md text-center animate-pulse">
              {subMessage}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 text-xs text-(--secondary)/50">
        Copyright © 2026 CorpSite
      </div>
    </div>
  );
};

export default SplashScreen;
