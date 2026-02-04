import { Globe, FileEdit, Archive, Lock } from 'lucide-react';
import { StatusBadge } from '../../../components';

const PostStatusBadge = ({ status }) => {
  const config = {
    published: {
      variant: 'success',
      icon: Globe,
      label: 'Published',
    },
    draft: {
      variant: 'neutral',
      icon: FileEdit,
      label: 'Draft',
    },
    archived: {
      variant: 'warning',
      icon: Archive,
      label: 'Archived',
    },
    private: {
      variant: 'info',
      icon: Lock,
      label: 'Private',
    },
  };

  const { variant, icon, label } = config[status] || config.draft;

  return (
    <StatusBadge variant={variant} icon={icon}>
      {label}
    </StatusBadge>
  );
};

export default PostStatusBadge;
