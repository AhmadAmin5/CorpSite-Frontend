import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Mail, Calendar, User as UserIcon } from 'lucide-react';
import { useUpdateContactQueryMutation } from '../contactApi';
import { Modal, Button, Select } from '../../../components';
import useToast from '../../../context/ToastContext';

const ViewInquiryModal = ({ isOpen, onClose, inquiry }) => {
  const toast = useToast();
  const [updateContactQuery, { isLoading }] = useUpdateContactQueryMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      status: 'unread',
      notes: '',
    },
  });

  useEffect(() => {
    if (inquiry) {
      reset({
        status: inquiry.status || 'unread',
        notes: inquiry.notes || '',
      });
    }
  }, [inquiry, reset]);

  const onSubmit = async (data) => {
    if (!inquiry) return;
    try {
      await updateContactQuery({ id: inquiry._id, ...data }).unwrap();
      toast.success('Inquiry updated successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to update inquiry');
    }
  };

  const statusOptions = [
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
    { value: 'archived', label: 'Archived' },
  ];

  if (!inquiry) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View Inquiry"
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Read-Only Sender Info */}
        <div className="space-y-4 md:col-span-2 bg-(--secondary)/5 p-4 rounded-xl border border-(--border)">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-(--foreground) font-medium text-lg">
                <UserIcon className="w-5 h-5 text-(--secondary)" />
                {inquiry.name}
              </div>
              <div className="flex items-center gap-2 text-(--secondary) text-sm">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${inquiry.email}`}
                  className="hover:text-primary hover:underline"
                >
                  {inquiry.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2 text-(--secondary) text-sm">
              <Calendar className="w-4 h-4 mt-0.5" />
              {new Date(inquiry.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="pt-4 border-t border-(--border)">
            <h4 className="font-bold text-(--foreground) mb-2">
              {inquiry.subject}
            </h4>
            <div className="text-(--foreground) whitespace-pre-wrap bg-(--background) p-4 rounded-lg border border-(--border) max-h-60 overflow-y-auto text-sm leading-relaxed">
              {inquiry.message}
            </div>
          </div>
        </div>
      </div>

      {/* Editable Admin Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border-t border-(--border) pt-4"
      >
        <h4 className="font-semibold text-(--foreground) mb-2">
          Admin Controls
        </h4>

        <div className="w-full md:w-1/2">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select label="Status" options={statusOptions} {...field} />
            )}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-(--foreground) mb-1">
            Internal Notes
          </label>
          <textarea
            rows={3}
            placeholder="Add notes about this inquiry (only visible to admins)..."
            className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-(--background) text-(--foreground) resize-y"
            {...register('notes')}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} text="Cancel" />
          <Button
            type="submit"
            disabled={!isDirty}
            isButtonLoading={isLoading}
            text="Save Changes"
            loadingText="Saving..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default ViewInquiryModal;
