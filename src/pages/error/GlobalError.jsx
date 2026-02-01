import { useRouteError } from 'react-router-dom';
import { AlertTriangle, Terminal } from 'lucide-react';
import { useState } from 'react';
import ErrorLayout from '../../layouts/ErrorLayout';

const GlobalError = () => {
  const error = useRouteError();
  const [showDetails, setShowDetails] = useState(false);

  const isChunkError = error?.name === 'ChunkLoadError';
  const title = isChunkError ? 'Update Available' : 'Application Error';
  const description = isChunkError 
    ? 'A new version of the app is available. Please reload.'
    : 'Something unexpected went wrong. Contact administration.';

  return (
    <ErrorLayout
      icon={AlertTriangle}
      title={title}
      description={description}
    >
      {error && (
        <div className="max-w-sm mx-auto mt-4 text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs flex items-center gap-1 text-(--secondary) hover:text-primary transition-colors mx-auto mb-2"
          >
            <Terminal className="w-3 h-3" />
            {showDetails ? 'Hide Technical Details' : 'Show Technical Details'}
          </button>

          {showDetails && (
            <div className="bg-(--card) border border-(--border) rounded-lg p-3 overflow-x-auto">
              <pre className="text-xs text-error font-mono">
                {error.statusText || error.message}
              </pre>
              {error.stack && (
                <pre className="text-[10px] text-(--secondary) mt-2 opacity-70">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </ErrorLayout>
  );
};

export default GlobalError;