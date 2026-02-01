import { useForm, Controller } from 'react-hook-form';
import { useInviteUserMutation } from '../../../features/users/usersApi';
import { Modal, Input, Button, Select, Spinner } from '../../../components';
import { useEffect } from 'react';
import { ROLE_OPTIONS } from '../../../config/roles.js';
import useToast from '../../../context/ToastContext.jsx';

const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

const InviteUserModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [inviteUser, { isLoading, isSuccess, error }] = useInviteUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isOpen, isSuccess, reset, onClose]);

  const onSubmit = async (data) => {
    try {
      const response = await inviteUser(data).unwrap();
      toast.success('User Created');
      handleCopyLink(response.data.user);
    } catch (err) {
      toast.error('Failed to create user');
    }
  };

  const handleCopyLink = async (user) => {
    if (isExpired(user.invitationExpiry)) return;
    const baseURL = window.location.origin;
    const link = `${baseURL}/activate-account?token=${user.invitationToken}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success(`Invite link for ${user.fullName} copied to clipboard`);
    } catch (err) {
      toast.error('Failed to copy invitation link');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite New User">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
            {error?.data?.message || 'Failed to send invitation'}
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
        />

        <Input
          label="Username"
          placeholder="e.g. johndoe"
          error={errors.username?.message}
          {...register('username', { required: 'Username is required' })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. john@company.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <div className="space-y-1">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select label="Role" options={ROLE_OPTIONS} {...field} />
            )}
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner size="sm" />}
            {isLoading ? 'Sending Invite...' : 'Send Invitation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteUserModal;
