import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../categories/categoriesApi';
import {
  Modal,
  Button,
  Input,
  Spinner,
  ConfirmationDialog,
} from '../../../components';
import useToast from '../../../context/ToastContext';

const ManageCategoriesModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = data?.data?.categories || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const watchedName = watch('name');

  useEffect(() => {
    if (!editingId && watchedName && !dirtyFields.slug) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  }, [watchedName, editingId, dirtyFields.slug, setValue]);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateCategory({ id: editingId, ...data }).unwrap();
        toast.success('Category updated');
        handleCancelEdit();
      } else {
        await createCategory(data).unwrap();
        toast.success('Category added');
        reset();
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setValue('name', cat.name);
    setValue('slug', cat.slug);
    setValue('description', cat.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({
      name: '',
      slug: '',
      description: '',
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCategory(deleteId).unwrap();
        toast.success('Category deleted');
        setDeleteId(null);
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Categories"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-(--secondary)/5 p-4 rounded-lg border border-(--border)"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Name"
              placeholder="e.g. Technology"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />

            <Input
              label="Slug"
              placeholder="e.g. technology"
              {...register('slug', { required: 'Slug is required' })}
              error={errors.slug?.message}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Description (Optional)"
              placeholder="Short description for SEO..."
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-2">
            {editingId && (
              <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <Spinner size="sm" />
              ) : editingId ? (
                'Update Category'
              ) : (
                'Add Category'
              )}
            </Button>
          </div>
        </form>

        {/* List Section */}
        <div className="max-h-100 overflow-y-auto border rounded-lg border-(--border)">
          {isLoading ? (
            <div className="p-4 text-center">
              <Spinner />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-(--foreground)">
              No categories found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-(--secondary)/5 text-(--foreground) font-semibold sticky top-0">
                <tr>
                  <th className="p-3 border-b border-(--border)">Name</th>
                  <th className="p-3 border-b border-(--border)">Slug</th>
                  <th className="p-3 border-b border-(--border) hidden md:table-cell">
                    Description
                  </th>
                  <th className="p-3 border-b border-(--border) text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className={
                      editingId === cat._id
                        ? 'bg-primary/5'
                        : 'hover:bg-(--foreground)/5'
                    }
                  >
                    <td className="p-3 font-medium text-(--foreground)">{cat.name}</td>
                    <td className="p-3 text-(--foreground)">{cat.slug}</td>
                    <td className="p-3 text-(--foreground) hidden md:table-cell truncate max-w-xs">
                      {cat.description}
                    </td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-(--foreground) hover:text-primary p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat._id)}
                        className="text-(--foreground) hover:text-error p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure? Posts in this category will become Uncategorized."
        isLoading={isDeleting}
      />
    </Modal>
  );
};

export default ManageCategoriesModal;
