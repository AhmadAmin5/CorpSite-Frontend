import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateUserMutation } from '../usersApi.js';
import {
  Modal,
  Input,
  Button,
  Select,
  Spinner,
} from '../../../components/index.js';
import { ROLE_OPTIONS } from '../../../config/roles.js';
import useToast from '../../../context/ToastContext.jsx';

const EditUserModal = ({ isOpen, onClose, user }) => {
  const toast = useToast();
  const [updateUser, { isLoading, isSuccess, error }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        role: user.role,
        isBlocked: user.isBlocked,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isOpen, isSuccess, reset, onClose]);

  const onSubmit = async (data) => {
    if (!user) return;
    try {
      await updateUser({ id: user._id, data }).unwrap();
    } catch (err) {
      toast.error('Failed to edit user');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit User: ${user?.username || ''}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
            {error?.data?.message || 'Update failed'}
          </div>
        )}

        <Input
          label="Full Name"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
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

        <div className="flex items-center gap-3 p-3 border border-(--border) rounded-lg bg-(--secondary)/5">
          <input
            id="isBlocked"
            type="checkbox"
            {...register('isBlocked')}
            className="w-5 h-5 rounded border-gray-300 text-error focus:ring-error"
          />
          <label
            htmlFor="isBlocked"
            className="text-sm font-medium text-(--foreground)"
          >
            Block this user (Revoke Access)
          </label>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner size="sm" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
