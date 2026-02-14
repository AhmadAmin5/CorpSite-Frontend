import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import Skeleton from './Skeleton';
import Spinner from './Spinner';

const Img = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-video',
  fallbackSrc,
  ...props
}) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  const handleLoad = () => {
    setStatus('loaded');
  };

  const handleError = () => {
    setStatus('error');
  };

  const containerClasses = `relative overflow-hidden bg-(--secondary)/5 rounded-lg ${aspectRatio} ${className}`;

  return (
    <div className={containerClasses}>
      {status === 'loading' && (
        <>
          <Skeleton className="absolute inset-0 w-full h-full z-10 opacity-50" />

          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Spinner size="md" className="text-(--foreground) opacity-30" />
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-(--secondary) bg-(--secondary)/10 z-20">
          <ImageOff className="w-8 h-8 opacity-20 mb-2" />
          <span className="text-xs font-medium opacity-50">Failed to load</span>
        </div>
      )}

      <img
        src={src}
        alt={alt || 'Image'}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-all duration-700 ease-in-out
          ${status === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
        `}
        {...props}
      />
    </div>
  );
};

export default Img;
