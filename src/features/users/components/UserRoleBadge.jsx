import { Shield } from 'lucide-react';
import { StatusBadge } from '../../../components';
import { ROLE_STYLES, ROLE_LABELS } from '../../../config/roles';

const UserRoleBadge = ({ role }) => {
  const style = ROLE_STYLES[role] || ROLE_STYLES.viewer;
  const label = ROLE_LABELS[role] || role;

  return (
    <StatusBadge icon={Shield} className={style}>
      {label}
    </StatusBadge>
  );
};

export default UserRoleBadge;
