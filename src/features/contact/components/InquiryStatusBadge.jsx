import { Mail, MailOpen, Reply, Archive } from 'lucide-react';
import { StatusBadge } from '../../../components';

const InquiryStatusBadge = ({ status }) => {
  const config = {
    unread: {
      variant: 'info',
      icon: Mail,
      label: 'Unread',
    },
    read: {
      variant: 'neutral',
      icon: MailOpen,
      label: 'Read',
    },
    replied: {
      variant: 'success',
      icon: Reply,
      label: 'Replied',
    },
    archived: {
      variant: 'warning',
      icon: Archive,
      label: 'Archived',
    },
  };

  const { variant, icon, label } = config[status] || config.unread;

  return (
    <StatusBadge variant={variant} icon={icon}>
      {label}
    </StatusBadge>
  );
};

export default InquiryStatusBadge;
