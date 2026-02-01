import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { format } from 'date-fns';

import { useGetPagesQuery } from '../../../features/pages/pagesApi';
import { Button, Skeleton } from '../../../components';
import PostStatusBadge from '../posts/PostStatusBadge'; // Reuse the badge UI

const PagesTable = ({ searchQuery, statusFilter, onDelete }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetPagesQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter,
  });

  const pages = data?.data?.pages || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  if (isLoading) {
    return (
      <div className="bg-(--card) rounded-xl border border-(--border) p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-(--secondary)/5 border-b border-(--border) text-xs uppercase text-(--secondary)">
              <th className="px-6 py-4 font-semibold">Page Title</th>
              <th className="px-6 py-4 font-semibold">URL Path</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Last Updated</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {pages.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-(--secondary)"
                >
                  No pages found.
                </td>
              </tr>
            ) : (
              pages.map((pageItem) => (
                <tr
                  key={pageItem._id}
                  className={`group hover:bg-(--secondary)/5 transition-colors ${isFetching ? 'opacity-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="font-medium text-(--foreground)">
                        {pageItem.title}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-(--secondary)">
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />/{pageItem.fullPath}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <PostStatusBadge status={pageItem.status} />
                  </td>

                  <td className="px-6 py-4 text-sm text-(--secondary)">
                    {pageItem.updatedAt
                      ? format(new Date(pageItem.updatedAt), 'MMM d, yyyy')
                      : '-'}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-(--secondary) hover:text-primary"
                        onClick={() =>
                          window.open(`/${pageItem.fullPath}`, '_blank')
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-(--secondary) hover:text-primary"
                        onClick={() => navigate(`edit/${pageItem._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-(--secondary) hover:text-error hover:bg-error/10"
                        onClick={() => onDelete(pageItem)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-(--border) flex justify-between items-center bg-(--background)">
        <span className="text-sm text-(--secondary)">
          Page{' '}
          <span className="font-medium text-(--foreground)">
            {pagination.currentPage}
          </span>{' '}
          of {pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={pagination.currentPage <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={
              pagination.currentPage >= pagination.totalPages || isFetching
            }
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PagesTable;
