import { useNavigate } from 'react-router-dom';
import { PageEditor } from '../../../features/pages/components';
import { useCreatePageMutation } from '../../../features/pages/pagesApi';
import useToast from '../../../context/ToastContext';

const CreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [createPage, { isLoading }] = useCreatePageMutation();

  const handleSubmit = async (data) => {
    try {
      await createPage(data).unwrap();
      toast.success('Page created successfully');
      navigate('/admin/pages');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to create page');
    }
  };

  return <PageEditor onSubmit={handleSubmit} isSaving={isLoading} />;
};

export default CreatePage;