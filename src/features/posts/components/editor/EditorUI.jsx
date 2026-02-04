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

export const EditorHeader = ({
  title,
  onBack,
  onPreview,
  isSaving,
  isDirty,
}) => {
  return (
    <div className="shrink-0 bg-(--card)/80 backdrop-blur-md border-b border-(--border) px-6 py-3 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-(--secondary) hover:text-(--foreground)"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div className="h-6 w-px bg-(--border)" />
        <h1 className="text-lg font-bold text-(--foreground)">{title}</h1>
        {isDirty && (
          <span className="text-xs text-(--secondary) italic">
            - Unsaved changes
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={onPreview}
          title="Live Preview"
          className="text-(--secondary) hover:text-primary"
        >
          <Eye className="w-5 h-5" />
        </Button>

        <Button
          type="submit"
          disabled={isSaving}
          className="min-w-30 shadow-sm"
        >
          {isSaving ? (
            <Spinner size="sm" className="mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save Post'}
        </Button>
      </div>
    </div>
  );
};
