import { useNavigate } from 'react-router-dom';
import PostEditor from '../../../features/posts/components/PostEditor';
import { useCreatePostMutation } from '../../../features/posts/postsApi';
import useToast from '../../../context/ToastContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSubmit = async (data) => {
    try {
      await createPost(data).unwrap();
      toast.success('Post created successfully');
      navigate('/admin/posts');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to create post');
    }
  };

  return <PostEditor onSubmit={handleSubmit} isSaving={isLoading} />;
};

export default CreatePost;
