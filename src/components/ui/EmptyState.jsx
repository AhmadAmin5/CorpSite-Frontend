import { SearchX } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No data found',
  description = 'Try adjusting your filters or create a new item.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-64 text-(--secondary) border-2 border-dashed border-(--border) rounded-xl p-8 text-center ${className}`}
    >
      <div className="p-4 bg-(--secondary)/5 rounded-full mb-4">
        <Icon className="w-8 h-8 opacity-50" />
      </div>
      <h3 className="text-lg font-medium text-(--foreground)">{title}</h3>
      <p className="text-sm mt-1 max-w-sm mx-auto">{description}</p>

      {actionLabel && onAction && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAction}
          className="mt-4 text-primary"
          text={actionLabel}
        />
      )}
    </div>
  );
};

export default EmptyState;
