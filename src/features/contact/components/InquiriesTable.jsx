import { useState } from 'react';
import { User } from 'lucide-react';
import { useGetContactQueriesQuery } from '../contactApi';
import { Table, InfoCell, DateCell, ActionsCell } from '../../../components';
import InquiryStatusBadge from './InquiryStatusBadge';

const InquiriesTable = ({ searchQuery, statusFilter, onView, onDelete }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetContactQueriesQuery({
    page,
    limit: 10,
    search: searchQuery,
    status: statusFilter === 'all' ? '' : statusFilter,
  });

  const columns = [
    {
      header: 'Sender',
      render: (inquiry) => (
        <InfoCell
          imgPlaceholder={<User className="w-5 h-5" />}
          title={inquiry.name}
          subtitle={inquiry.email}
        />
      ),
    },
    {
      header: 'Subject',
      render: (inquiry) => (
        <span className="font-medium text-(--foreground) line-clamp-1 max-w-xs">
          {inquiry.subject}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (inquiry) => <InquiryStatusBadge status={inquiry.status} />,
    },
    {
      header: 'Date',
      render: (inquiry) => <DateCell date={inquiry.createdAt} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (inquiry) => (
        <ActionsCell
          onView={() => onView(inquiry)}
          onDelete={() => onDelete(inquiry)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data?.data?.queries || []}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyMessage="No inquiries found."
      pagination={{
        currentPage: data?.data?.pagination?.currentPage || 1,
        totalPages: data?.data?.pagination?.totalPages || 1,
        onPageChange: setPage,
      }}
    />
  );
};

export default InquiriesTable;
