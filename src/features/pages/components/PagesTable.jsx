import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { useGetPagesQuery } from '../pagesApi';
import { Table, DateCell, ActionsCell } from '../../../components';
import PostStatusBadge from '../../posts/components/PostStatusBadge';

const PagesTable = ({ searchQuery, statusFilter, onDelete }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetPagesQuery({
    page,
    limit: 10,
    search: searchQuery,
    status: statusFilter,
  });

  const columns = [
    {
      header: 'Page Title',
      render: (page) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-4 h-4" />
          </div>
          <div className="font-medium text-(--foreground)">{page.title}</div>
        </div>
      ),
    },
    {
      header: 'URL Path',
      render: (page) => (
        <div className="flex items-center gap-1 text-sm text-(--secondary)">
          <LinkIcon className="w-3 h-3" />/{page.fullPath}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (page) => <PostStatusBadge status={page.status} />,
    },
    {
      header: 'Last Updated',
      render: (page) => <DateCell date={page.updatedAt} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (page) => (
        <ActionsCell
          onView={() => window.open(`/${page.fullPath}`, '_blank')}
          onEdit={() => navigate(`edit/${page._id}`)}
          onDelete={() => onDelete(page)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data?.data?.pages || []}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyMessage="No pages found."
      pagination={{
        currentPage: data?.data?.pagination?.currentPage || 1,
        totalPages: data?.data?.pagination?.totalPages || 1,
        onPageChange: setPage,
      }}
    />
  );
};

export default PagesTable;
