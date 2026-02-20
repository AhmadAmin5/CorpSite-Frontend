import { format } from 'date-fns';
import { User as UserIcon, ImageIcon, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Img } from '../';

export const InfoCell = ({
  imgUrl,
  imgPlaceholder,
  title,
  subtitle,
  subLabel,
  onClick,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-(--secondary)/10 flex items-center justify-center overflow-hidden border border-(--border) shrink-0">
        {imgUrl ? (
          <Img
            src={imgUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-(--secondary)">
            {imgPlaceholder || <ImageIcon className="w-5 h-5" />}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div
          className={`font-medium text-(--foreground) truncate max-w-50 ${onClick ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
          onClick={onClick}
          title={title}
        >
          {title}
          {subLabel && (
            <span className="text-xs text-(--secondary) ml-1">{subLabel}</span>
          )}
        </div>
        {subtitle && (
          <div className="text-xs text-(--secondary) truncate max-w-50">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export const UserCell = ({ user, currentUser }) => (
  <InfoCell
    imgUrl={user?.profilePicture}
    imgPlaceholder={<UserIcon className="w-5 h-5" />}
    title={user?.fullName || 'Unknown'}
    subtitle={user?.email}
    subLabel={currentUser?._id === user?._id ? '(You)' : null}
  />
);

export const BadgeCell = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-md bg-(--secondary)/10 text-(--secondary) text-xs ${className}`}
  >
    {children}
  </span>
);

export const DateCell = ({ date, formatStr = 'MMM d, yyyy' }) => (
  <span className="text-sm text-(--secondary)">
    {date ? format(new Date(date), formatStr) : '-'}
  </span>
);

export const ActionsCell = ({ onEdit, onDelete, onView, customActions }) => {
  return (
    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
      {customActions}

      {onView && (
        <Button
          size="sm"
          variant="ghost"
          className="hover:text-primary"
          title="View"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          icon={<Eye />}
          iconSize="md"
        />
      )}

      {onEdit && (
        <Button
          size="sm"
          variant="ghost"
          className="hover:text-primary"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          icon={<Edit />}
          iconSize="md"
        />
      )}

      {onDelete && (
        <Button
          size="sm"
          variant="ghost"
          className="hover:text-error hover:bg-error/10"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          icon={<Trash2 />}
          iconSize="md"
        />
      )}
    </div>
  );
};
