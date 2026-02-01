import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

// 1. USE YOUR THEME COLORS
// We use 'text-success' instead of 'text-green-600' to match your index.css
const variants = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-success" />,
    border: 'border-l-success',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-error" />,
    border: 'border-l-error',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-warning" />,
    border: 'border-l-warning',
  },
  info: {
    icon: <Info className="w-5 h-5 text-primary" />,
    border: 'border-l-primary',
  },
};

const Toast = ({ id, type = 'info', message, onClose, duration = 3000 }) => {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose, isPaused]);

  const variant = variants[type] || variants.info;

  return (
    <div
      className={`
      relative flex items-center w-full p-4 gap-3 
      rounded-lg shadow-lg border border-(--border)
      bg-(--card) text-(--foreground)
      border-l-4 ${variant.border}
      animate-in slide-in-from-right-full fade-in duration-300
    `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="shrink-0">{variant.icon}</div>

      <div className="flex-1 text-sm font-medium">{message}</div>

      <button
        onClick={() => onClose(id)}
        className="shrink-0 ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-(--secondary) hover:text-(--foreground) transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
