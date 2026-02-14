import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Link as LinkIcon, LayoutTemplate, Code } from 'lucide-react';
import { useGetPagesQuery } from '../pagesApi';
import { Table, DateCell, ActionsCell } from '../../../components';
import PostStatusBadge from '../../posts/components/PostStatusBadge';

const PagesTable = ({ searchQuery, statusFilter, typeFilter, onDelete }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetPagesQuery({
    page,
    limit: 10,
    search: searchQuery,
    status: statusFilter,
    pageType: typeFilter === 'all' ? undefined : typeFilter,
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hardcoded':
        return <LayoutTemplate className="w-4 h-4" />;
      case 'functional':
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'hardcoded':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'functional':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const columns = [
    {
      header: 'Page Title',
      render: (page) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getTypeBadgeColor(page.pageType)}`}>
            {getTypeIcon(page.pageType)}
          </div>
          <div>
            <div className="font-medium text-(--foreground)">{page.title}</div>
            {page.componentName && (
              <div className="text-[10px] bg-(--muted) text-(--secondary) px-1.5 py-0.5 rounded inline-block mt-1 font-mono">
                {page.componentName}
              </div>
            )}
          </div>
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
      header: 'Type',
      render: (page) => (
        <span className="capitalize text-sm text-(--secondary)">
          {page.pageType || 'Generic'}
        </span>
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
