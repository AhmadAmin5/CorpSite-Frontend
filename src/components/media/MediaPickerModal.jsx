import { useState, useRef } from 'react';
import {
  UploadCloud,
  Check,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useGetMediaQuery,
  useUploadMediaMutation,
} from '../../features/media/mediaApi';
import { Modal, Button, Skeleton, Spinner } from '../index';
import useToast from '../../context/ToastContext';

const MediaPickerModal = ({ isOpen, onClose, onSelect }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const limit = 12;
  const [selectedImage, setSelectedImage] = useState(null);

  // API
  const { data, isLoading, isFetching } = useGetMediaQuery({ page, limit });
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const mediaList = data?.data?.media || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  // Handlers
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadMedia(formData).unwrap();
      toast.success('Image uploaded');
      setSelectedImage(res.data);
      e.target.value = null;
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    }
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Media"
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col h-[70vh]">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-(--border)">
          <div className="text-sm text-(--foreground)">
            {selectedImage ? '1 image selected' : 'Select an image to insert'}
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="border border-dashed border-(--border) text-(--foreground) hover:text-primary hover:border-primary"
            >
              {isUploading ? (
                <Spinner size="sm" />
              ) : (
                <UploadCloud className="w-4 h-4 mr-2" />
              )}
              {isUploading ? 'Uploading...' : 'Upload New'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg w-full" />
              ))}
            </div>
          ) : mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-(--secondary)">
              <ImageIcon className="w-12 h-12 opacity-20 mb-2" />
              <p>No media found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((item) => {
                const isSelected = selectedImage?._id === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => setSelectedImage(item)}
                    className={`
                      group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all
                      ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'border-(--border) hover:border-primary/50'
                      }
                      ${isFetching ? 'opacity-50' : ''}
                    `}
                  >
                    <img
                      src={item.url}
                      alt={item.originalName}
                      className="w-full h-full object-cover"
                    />

                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-white p-1 rounded-full shadow-sm">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-(--border) flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm flex items-center text-(--secondary)">
              {page} / {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= pagination.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!selectedImage} onClick={handleConfirm}>
              Insert Selected
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MediaPickerModal;
