import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetPageQuery,
  useUpdatePageMutation,
} from '../../../features/pages/pagesApi';
import { PageEditor } from '../../../features/pages/components';
import { Loading, Button } from '../../../components';
import { AlertTriangle } from 'lucide-react';
import useToast from '../../../context/ToastContext';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data, isLoading, isError } = useGetPageQuery(id);
  const [updatePage, { isLoading: isSaving }] = useUpdatePageMutation();

  if (isLoading) return <Loading />;

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center text-error">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Page not found</h2>
        <Button onClick={() => navigate('/admin/pages')}>Go Back</Button>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    try {
      await updatePage({ id, ...formData }).unwrap();
      toast.success('Page updated successfully');
      navigate('/admin/pages');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to update page');
    }
  };

  return (
    <PageEditor
      initialData={data.data}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    />
  );
};

export default EditPage;