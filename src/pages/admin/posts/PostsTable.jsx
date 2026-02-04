import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPostsQuery } from '../../../features/posts/postsApi';
import {
  Table,
  InfoCell,
  BadgeCell,
  DateCell,
  ActionsCell,
} from '../../../components';
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
  const thisUser = useSelector(selectUser);

  const { data, isLoading, isFetching } = useGetPostsQuery({
    page,
    limit: 10,
    search: searchQuery,
    status: statusFilter,
    category: categoryFilter,
  });

  // --- MODULAR COLUMNS ---
  const columns = [
    {
      header: 'Post',
      render: (post) => (
        <InfoCell
          imgUrl={post.featuredImage?.url}
          title={post.title}
          subtitle={`/${post.slug}`}
        />
      ),
    },
    {
      header: 'Category',
      render: (post) => (
        <BadgeCell>{post.category || 'Uncategorized'}</BadgeCell>
      ),
    },
    {
      header: 'Author',
      render: (post) => (
        <span className="text-sm text-(--secondary)">
          {post.author?.fullName || 'Unknown'}{' '}
          {post.author?._id === thisUser._id && '(You)'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (post) => <PostStatusBadge status={post.status} />,
    },
    {
      header: 'Date',
      render: (post) => <DateCell date={post.createdAt} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (post) => (
        <ActionsCell
          onView={() => window.open(`/blog/${post.slug}`, '_blank')}
          onEdit={() => navigate(`edit/${post._id}`)}
          onDelete={() => onDelete(post)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data?.data?.posts || []}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyMessage="No posts found."
      pagination={{
        currentPage: data?.data?.pagination?.currentPage || 1,
        totalPages: data?.data?.pagination?.totalPages || 1,
        onPageChange: setPage,
      }}
    />
  );
};

export default PostsTable;
