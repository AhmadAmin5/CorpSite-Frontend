import { useEffect, useState, useRef } from 'react';
import { useNavigation } from 'react-router-dom';

const TopLoader = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const [progress, setProgress] = useState(0);
  const activeRef = useRef(false);

  useEffect(() => {
    let delayTimer;
    let progressInterval;

    if (isLoading) {
      delayTimer = setTimeout(() => {
        activeRef.current = true;
        setProgress(30);
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            return prev < 90 ? prev + Math.random() * 5 : prev;
          });
        }, 500);
      }, 200);
    } else {
      clearTimeout(delayTimer);

      if (activeRef.current) {
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          activeRef.current = false;
        }, 300);
      }
    }

    return () => {
      clearTimeout(delayTimer);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-transparent">
      <div
        className="h-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default TopLoader;
