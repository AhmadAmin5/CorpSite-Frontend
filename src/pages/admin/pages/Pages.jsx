import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button, Input, ConfirmationDialog, Select } from '../../../components';
import { useDeletePageMutation } from '../../../features/pages/pagesApi';
import useToast from '../../../context/ToastContext';
import { PagesTable } from '../../../features/pages/components';

const Pages = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageToDelete, setPageToDelete] = useState(null);

  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();

  const handleDelete = async () => {
    if (!pageToDelete) return;
    try {
      await deletePage(pageToDelete._id).unwrap();
      toast.success('Page deleted successfully');
      setPageToDelete(null);
    } catch (err) {
      toast.error('Failed to delete page');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Pages</h1>
          <p className="text-(--secondary) text-sm mt-1">
            Build and manage high-performance dynamic pages for your site.
          </p>
        </div>

        <Button
          onClick={() => navigate('create')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Page
        </Button>
      </div>

      <div className="bg-(--card) p-4 rounded-xl border border-(--border) shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative grow md:max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary)">
            <Search className="w-4 h-4" />
          </div>
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputClassName="pl-10"
            className="w-full"
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

      <PagesTable
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onDelete={setPageToDelete}
      />

      <ConfirmationDialog
        isOpen={!!pageToDelete}
        onClose={() => setPageToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Page?"
        message={`Are you sure you want to delete "${pageToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Pages;
