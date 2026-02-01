import { CheckCircle, XCircle, Clock, TimerOff } from 'lucide-react';
import { StatusBadge } from '../../../components';

const isExpired = (date) => new Date(date) < new Date();

const UserStatusBadge = ({ isBlocked, isActivated, invitationExpiry }) => {
  if (isBlocked) {
    return (
      <StatusBadge variant="error" icon={XCircle}>
        Blocked
      </StatusBadge>
    );
  }

  if (!isActivated) {
    if (isExpired(invitationExpiry)) {
      return (
        <StatusBadge variant="warning" icon={TimerOff} className="opacity-70">
          Invitation Expired
        </StatusBadge>
      );
    }
    return (
      <StatusBadge variant="warning" icon={Clock}>
        Invited
      </StatusBadge>
    );
  }

  return (
    <StatusBadge variant="success" icon={CheckCircle}>
      Active
    </StatusBadge>
  );
};

export default UserStatusBadge;