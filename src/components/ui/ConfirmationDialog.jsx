import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Spinner from './Spinner';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  loadingText = 'Loading...',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 
          ${
            variant === 'danger'
              ? 'bg-error/10 text-error'
              : 'bg-primary/10 text-primary'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-(--foreground) mb-2">{title}</h3>

        <p className="text-(--foreground) opacity-70 text-sm mb-6">{message}</p>

        <div className="flex gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center ${
              variant === 'danger'
                ? 'bg-error! hover:bg-error/70! text-white! border-error!'
                : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {' '}
                <Spinner size="sm" className="ml-2 text-white" />{' '}
                {loadingText}{' '}
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
