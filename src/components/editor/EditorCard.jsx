import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export const EditorCard = ({
  children,
  title,
  icon: Icon,
  className = '',
  headerAction,
  collapsible = false,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden ${className}`}
    >
      {(title || Icon) && (
        <div
          className={`px-4 py-3 border-b border-(--border) font-semibold text-sm flex items-center justify-between ${collapsible ? 'cursor-pointer hover:bg-(--secondary)/5' : ''}`}
          onClick={() => collapsible && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            {title}
          </div>
          <div className="flex items-center gap-2">
            {headerAction && (
              <div onClick={(e) => e.stopPropagation()}>{headerAction}</div>
            )}
            {collapsible &&
              (isOpen ? (
                <ChevronUp className="w-4 h-4 text-(--secondary)" />
              ) : (
                <ChevronDown className="w-4 h-4 text-(--secondary)" />
              ))}
          </div>
        </div>
      )}
      {(!collapsible || isOpen) && (
        <div className="p-4 space-y-4">{children}</div>
      )}
    </div>
  );
};

export default EditorCard;
