import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Tag } from 'lucide-react';
import { Button, Input, ConfirmationDialog, Select, PageHeader, TableToolbar } from '../../../components';
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
      <PageHeader title="Posts" description="Create, manage, and publish content for your blog"
      actions={<>
        <Button
            variant="secondary"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 border border-(--border) w-full sm:w-auto"
            text="Manage Categories"
            icon={<Tag/>}
          />

          <Button
            onClick={() => navigate('create')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            text="Create New Post"
            icon={<Plus/>}
          />
          </>
      }
      />

      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search posts...">

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
      </TableToolbar>

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
