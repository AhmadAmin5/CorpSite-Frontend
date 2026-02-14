import { useState } from 'react';
import { useGetUsersQuery } from '../usersApi';
import { Button, Table, UserCell, ActionsCell } from '../../../components';
import useToast from '../../../context/ToastContext';
import UserStatusBadge from './UserStatusBadge';
import UserRoleBadge from './UserRoleBadge';
import { Link, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';

const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

const UsersTable = ({
  searchQuery,
  roleFilter,
  statusFilter,
  onEdit,
  onDelete,
}) => {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [copiedStates, setCopiedStates] = useState({});
  const thisUser = useSelector(selectUser);

  const { data, isLoading, isError, error, isFetching } = useGetUsersQuery({
    page,
    limit: 10,
    search: searchQuery,
    role: roleFilter,
    status: statusFilter,
  });

  const handleCopyLink = async (user) => {
    const link = `${window.location.origin}/activate-account?token=${user.invitationToken}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedStates((prev) => ({ ...prev, [user._id]: true }));
      toast.success(`Invite link copied`);
      setTimeout(
        () => setCopiedStates((prev) => ({ ...prev, [user._id]: false })),
        2000
      );
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const columns = [
    {
      header: 'User',
      render: (user) => <UserCell user={user} currentUser={thisUser} />,
    },
    {
      header: 'Role',
      className: 'text-center',
      render: (user) => <UserRoleBadge role={user.role} />,
    },
    {
      header: 'Status',
      className: 'text-center',
      render: (user) => (
        <UserStatusBadge
          isBlocked={user.isBlocked}
          isActivated={user.isActivated}
          invitationExpiry={user.invitationExpiry}
        />
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (user) => (
        <ActionsCell
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
          customActions={
            !user.isActivated &&
            !user.isBlocked &&
            !isExpired(user.invitationExpiry) && (
              <Button
                size="sm"
                variant="ghost"
                className={`w-10 h-10 p-0 ${copiedStates[user._id] ? 'text-success bg-success/10' : 'text-(--secondary)'}`}
                onClick={() => handleCopyLink(user)}
                title="Copy Invite Link"
              >
                {copiedStates[user._id] ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Link className="w-6 h-6" />
                )}
              </Button>
            )
          }
        />
      ),
    },
  ];

  if (isError)
    return (
      <div className="p-6 text-center text-error">
        Failed to load users. <br /> {error.data.message} <br />{' '}
        {error.status == 403 &&
          'Only admins are allowed to access this section.'}
      </div>
    );

  return (
    <Table
      columns={columns}
      data={data?.data?.users || []}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyMessage="No users found."
      pagination={{
        currentPage: data?.data?.pagination?.currentPage || 1,
        totalPages: data?.data?.pagination?.totalPages || 1,
        onPageChange: setPage,
      }}
    />
  );
};

export default UsersTable;
