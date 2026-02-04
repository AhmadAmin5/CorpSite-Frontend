import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetPostQuery,
  useUpdatePostMutation,
} from '../../../features/posts/postsApi';
import { PostEditor } from '../../../features/posts/components/';
import { Loading, Button } from '../../../components';
import { AlertTriangle } from 'lucide-react';
import useToast from '../../../context/ToastContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data, isLoading, isError } = useGetPostQuery(id);
  const [updatePost, { isLoading: isSaving }] = useUpdatePostMutation();

  if (isLoading) return <Loading />;

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center text-error">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Post not found</h2>
        <Button onClick={() => navigate('/admin/posts')}>Go Back</Button>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    try {
      await updatePost({ id, ...formData }).unwrap();
      toast.success('Post updated successfully');
      navigate('/admin/posts');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to update post');
    }
  };

  return (
    <PostEditor
      initialData={data.data}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    />
  );
};

export default EditPost;
