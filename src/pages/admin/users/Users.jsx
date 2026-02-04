import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, Input, ConfirmationDialog, Select } from '../../../components';
import UsersTable from './UsersTable';
import InviteUserModal from './InviteUserModal';
import EditUserModal from './EditUserModal';
import { useDeleteUserMutation } from '../../../features/users/usersApi';
import useToast from '../../../context/ToastContext';

const Users = () => {
  const toast = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser._id).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'invited', label: 'Invited (Pending)' },
    { value: 'blocked', label: 'Blocked' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Users</h1>
          <p className="text-(--secondary) text-sm mt-1">
            Manage your team members and their permissions here.
          </p>
        </div>

        <Button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      <div className="bg-(--card) p-4 rounded-xl border border-(--border) shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative grow md:max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary)">
            <Search className="w-4 h-4" />
          </div>
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputClassName="pl-10"
            className="w-full"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="w-full md:w-48">
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              options={roleOptions}
              placeholder="Filter by Role"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Filter by Status"
            />
          </div>
        </div>
      </div>

      <UsersTable
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {isInviteModalOpen && (
        <InviteUserModal
          isOpen={true}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}

      {isEditUserModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isEditUserModalOpen}
          onClose={() => setIsEditUserModalOpen(false)}
          user={selectedUser}
        />
      )}

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User?"
        message={`Are you sure you want to delete "${selectedUser?.fullName || 'this user'}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        loadingText="Deleting..."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Users;
