import { ArrowLeft, Eye, Save } from 'lucide-react';
import { Button, Spinner } from '../../../../components';

export const EditorCard = ({
  children,
  title,
  icon: Icon,
  className = '',
  headerAction,
}) => {
  return (
    <div
      className={`bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden ${className}`}
    >
      {(title || Icon) && (
        <div className="px-4 py-3 border-b border-(--border) font-semibold text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            {title}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
};

