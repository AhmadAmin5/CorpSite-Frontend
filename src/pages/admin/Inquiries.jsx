import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import {
  PageHeader,
  TableToolbar,
  ConfirmationDialog,
  Select,
} from '../../components';
import { useDeleteContactQueryMutation } from '../../features/contact/contactApi';
import {
  InquiriesTable,
  ViewInquiryModal,
} from '../../features/contact/components';
import useToast from '../../context/ToastContext';

const Inquiries = () => {
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);

  const [deleteContactQuery, { isLoading: isDeleting }] =
    useDeleteContactQueryMutation();

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;
    try {
      await deleteContactQuery(inquiryToDelete._id).unwrap();
      toast.success('Inquiry deleted successfully');
      setInquiryToDelete(null);
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Manage contact form submissions and client messages."
      />

      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name, email, or subject..."
      >
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter by Status"
          />
        </div>
      </TableToolbar>

      <InquiriesTable
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onView={handleView}
        onDelete={setInquiryToDelete}
      />

      {/* View/Edit Modal */}
      {isViewModalOpen && selectedInquiry && (
        <ViewInquiryModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          inquiry={selectedInquiry}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!inquiryToDelete}
        onClose={() => setInquiryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Inquiry?"
        message={`Are you sure you want to delete the message from "${inquiryToDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        loadingText="Deleting..."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Inquiries;
