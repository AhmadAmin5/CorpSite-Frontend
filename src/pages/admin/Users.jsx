import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  Button,
  Input,
  ConfirmationDialog,
  Select,
  PageHeader,
  TableToolbar,
} from '../../components';
import {
  UsersTable,
  InviteUserModal,
  EditUserModal,
} from '../../features/users/components';
import { useDeleteUserMutation } from '../../features/users/usersApi';
import useToast from '../../context/ToastContext';

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
      {/* 1. New Modular Header */}
      <PageHeader
        title="Users"
        description="Manage your team members and their permissions here."
        actions={
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2"
            icon={<Plus />}
          />
        }
      />

      {/* 2. New Modular Toolbar */}
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
      >
        {/* Pass specific filters as children */}
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
      </TableToolbar>

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
