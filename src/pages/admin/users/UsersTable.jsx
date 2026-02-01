import { useState } from 'react';
import { useGetUsersQuery } from '../../../features/users/usersApi';
import { Button } from '../../../components';
import useToast from '../../../context/ToastContext';
import UsersTableSkeleton from './UsersTableSkeleton';
import UserStatusBadge from './UserStatusBadge';
import UserRoleBadge from './UserRoleBadge';
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Link,
  Check,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';

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
  const limit = 10;

  const { data, isLoading, isError, error, isFetching } = useGetUsersQuery({
    page,
    limit,
    search: searchQuery,
    role: roleFilter,
    status: statusFilter,
  });

  const thisUser = useSelector(selectUser);

  const handleCopyLink = async (user) => {
    if (isExpired(user.invitationExpiry)) return;

    const baseURL = window.location.origin;
    const link = `${baseURL}/activate-account?token=${user.invitationToken}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedStates((prev) => ({ ...prev, [user._id]: true }));
      toast.success(`Invite link for ${user.fullName} copied`);

      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [user._id]: false }));
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) return <UsersTableSkeleton />;

  if (isError) {
    return (
      <div className="p-6 text-center bg-error/5 text-error rounded-xl border border-error/20">
        <p className="font-medium">Failed to load users</p>
        <p className="text-sm opacity-80 mt-1">
          {error?.data?.message || error?.error || 'Server error occurred'}
        </p>
      </div>
    );
  }

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  return (
    <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-(--secondary)/5 border-b border-(--border) text-xs uppercase text-(--secondary) text-center">
              <th className="px-6 py-4 font-semibold text-left">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-(--secondary)"
                >
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isCopied = copiedStates[user._id];

                return (
                  <tr
                    key={user._id}
                    className={`group hover:bg-(--secondary)/5 transition-colors ${
                      isFetching ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-(--secondary)/10 flex items-center justify-center overflow-hidden border border-(--border)">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-5 h-5 text-(--secondary)" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-(--foreground)">
                            {user.fullName || 'No Name'}
                            {user._id == thisUser._id && ' (You)'}
                          </div>
                          <div className="text-sm text-(--secondary)">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <UserRoleBadge role={user.role} />
                    </td>

                    <td className="px-6 py-4 text-center">
                      <UserStatusBadge
                        isBlocked={user.isBlocked}
                        isActivated={user.isActivated}
                        invitationExpiry={user.invitationExpiry}
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                        {!user.isActivated &&
                          !user.isBlocked &&
                          !isExpired(user.invitationExpiry) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`${
                                isCopied
                                  ? 'text-success bg-success/10'
                                  : 'text-(--secondary) hover:text-primary hover:bg-primary/10'
                              }`}
                              title={isCopied ? 'Copied!' : 'Copy Invite Link'}
                              onClick={(e) => {
                                e.currentTarget.blur();
                                handleCopyLink(user);
                              }}
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Link className="w-4 h-4" />
                              )}
                            </Button>
                          )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-(--secondary) hover:text-primary hover:bg-primary/10"
                          title="Edit User"
                          onClick={() => onEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-(--secondary) hover:text-error hover:bg-error/10"
                          title="Delete User"
                          onClick={() => onDelete(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-(--border) flex justify-between items-center bg-(--background)">
        <span className="text-sm text-(--secondary)">
          Page{' '}
          <span className="font-medium text-(--foreground)">
            {pagination.currentPage}
          </span>{' '}
          of{' '}
          <span className="font-medium text-(--foreground)">
            {pagination.totalPages}
          </span>
        </span>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={pagination.currentPage <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={
              pagination.currentPage >= pagination.totalPages || isFetching
            }
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
