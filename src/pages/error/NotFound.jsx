import { SearchX } from 'lucide-react';
import ErrorLayout from '../../layouts/ErrorLayout';

const NotFound = () => {
  return (
    <ErrorLayout
      icon={SearchX}
      title="Page Not Found"
      description="Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."
    />
  );
};

export default NotFound;