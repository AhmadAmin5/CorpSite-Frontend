import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';
import { format } from 'date-fns';

import { useGetPostsQuery } from '../../../features/posts/postsApi';
import { Button, Skeleton } from '../../../components';
import PostStatusBadge from './PostStatusBadge';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';

const PostsTable = ({
  searchQuery,
  statusFilter,
  categoryFilter,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetPostsQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter,
    category: categoryFilter,
  });

  const thisUser = useSelector(selectUser);

  const posts = data?.data?.posts || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  console.log(thisUser);
  console.log(posts);

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
            <tr className="bg-(--secondary)/5 border-b border-(--border) text-xs uppercase text-(--secondary) ">
              <th className="px-6 py-4 font-semibold">Post</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Author</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-(--secondary)"
                >
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post._id}
                  className={`group hover:bg-(--secondary)/5 transition-colors ${isFetching ? 'opacity-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-(--secondary)/10 overflow-hidden shrink-0 border border-(--border)">
                        {post.featuredImage?.url ? (
                          <img
                            src={post.featuredImage.url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-(--secondary)" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div
                          className="font-medium text-(--foreground) truncate max-w-50 md:max-w-xs"
                          title={post.title}
                        >
                          {post.title}
                        </div>
                        <div className="text-xs text-(--secondary) truncate">
                          /{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category Column */}
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-(--secondary)/10 text-(--secondary) text-xs">
                      {post.category || 'Uncategorized'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-(--secondary)">
                    {post.author?.fullName || 'Unknown'}
                    {post.author?._id == thisUser._id && (
                      <b className="text-xs"> (You)</b>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <PostStatusBadge status={post.status} />
                  </td>

                  <td className="px-6 py-4 text-sm text-(--secondary)">
                    {post.createdAt
                      ? format(new Date(post.createdAt), 'MMM d, yyyy')
                      : '-'}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-(--secondary) hover:text-primary"
                        title="View"
                        onClick={() =>
                          window.open(`/blog/${post.slug}`, '_blank')
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-(--secondary) hover:text-primary"
                        title="Edit"
                        onClick={() => navigate(`edit/${post._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-(--secondary) hover:text-error hover:bg-error/10"
                        title="Delete"
                        onClick={() => onDelete(post)}
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

      {/* Pagination */}
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

export default PostsTable;
