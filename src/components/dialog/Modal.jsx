import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${maxWidth} bg-(--card) rounded-xl shadow-2xl border border-(--border) transform transition-all`}
      >
        <div className="flex items-center justify-between p-4 border-b border-(--border)">
          <h3 className="text-lg font-semibold text-(--foreground)">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-(--foreground) hover:bg-(--secondary)/10 hover:text-(--foreground) transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
