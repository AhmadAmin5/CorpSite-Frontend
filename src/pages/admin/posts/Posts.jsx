import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Tag } from 'lucide-react';
import { Button, Input, ConfirmationDialog, Select } from '../../../components';
import { useDeletePostMutation } from '../../../features/posts/postsApi';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApi';
import useToast from '../../../context/ToastContext';
import {
  PostsTable,
  ManageCategoriesModal,
} from '../../../features/posts/components/';

const Posts = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [postToDelete, setPostToDelete] = useState(null);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const { data: categoryData } = useGetCategoriesQuery();

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete._id).unwrap();
      toast.success('Post moved to trash');
      setPostToDelete(null);
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'private', label: 'Private' },
    { value: 'archived', label: 'Archived' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...(categoryData?.data?.categories?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    })) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Posts</h1>
          <p className="text-(--secondary) text-sm mt-1">
            Create, manage, and publish content for your blog.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 border border-(--border) w-full sm:w-auto"
          >
            <Tag className="w-4 h-4" />
            Manage Categories
          </Button>

          <Button
            onClick={() => navigate('create')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-(--card) p-4 rounded-xl border border-(--border) shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative grow md:max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary)">
            <Search className="w-4 h-4" />
          </div>
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputClassName="pl-10"
            className="w-full"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="w-full md:w-48">
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              placeholder="Filter by Category"
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

      {/* Table */}
      <PostsTable
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onDelete={setPostToDelete}
      />

      {/* Delete Dialog */}
      <ConfirmationDialog
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Post?"
        message={`Are you sure you want to delete "${postToDelete?.title}"?`}
        confirmText="Delete"
        isLoading={isDeleting}
      />

      {/* Manage Categories Modal */}
      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};

export default Posts;
