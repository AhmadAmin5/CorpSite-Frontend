import { useState, useRef } from 'react';
import {
  UploadCloud,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useGetMediaQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} from '../../../features/media/mediaApi';
import {
  Button,
  Spinner,
  ConfirmationDialog,
  Skeleton,
} from '../../../components';
import useToast from '../../../context/ToastContext';

const Media = () => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const limit = 12;
  const [deleteId, setDeleteId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // API Hooks
  const { data, isLoading, isFetching } = useGetMediaQuery({ page, limit });
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();

  // Handlers
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadMedia(formData).unwrap();
      toast.success('Image uploaded successfully');
      e.target.value = null;
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedia(deleteId).unwrap();
      toast.success('Image deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleCopyLink = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const mediaList = data?.data?.media || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">
            Media Library
          </h1>
          <p className="text-(--secondary) text-sm mt-1">
            Manage images and files for your posts.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm p-6 min-h-100">
        {isLoading ? (
          // Loading Skeleton Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg w-full" />
            ))}
          </div>
        ) : mediaList.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-64 text-(--secondary) border-2 border-dashed border-(--border) rounded-xl">
            <ImageIcon className="w-12 h-12 opacity-20 mb-2" />
            <p>No media found</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-primary"
            >
              Upload your first image
            </Button>
          </div>
        ) : (
          // Image Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className={`group relative aspect-square bg-(--secondary)/5 rounded-lg overflow-hidden border border-(--border) transition-all hover:shadow-md ${isFetching ? 'opacity-50' : ''}`}
              >
                {/* Image */}
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <div className="flex gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyLink(item.url, item._id)}
                      className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item._id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full backdrop-blur-sm transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-white/80 truncate max-w-full px-2">
                    {(item.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-(--border) pt-4">
            <span className="text-sm text-(--secondary)">
              Page{' '}
              <span className="font-medium text-(--foreground)">{page}</span> of{' '}
              {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= pagination.totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Image?"
        message="Are you sure you want to delete this image? This action cannot be undone and might break posts using this image."
        confirmText="Delete"
        loadingText="Deleting"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Media;
