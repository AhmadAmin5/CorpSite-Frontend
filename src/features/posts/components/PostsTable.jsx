import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetPostsQuery } from '../postsApi';
import {
  Table,
  InfoCell,
  BadgeCell,
  DateCell,
  ActionsCell,
  Img,
} from '../../../components';
import PostStatusBadge from './PostStatusBadge';
import { useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';

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
        <Link
          to={`/author/${post.author?.username}`}
          className="flex items-center gap-3 group"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-(--border) shrink-0">
            <Img
              src={post?.author?.profilePicture}
              alt={post.author?.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-(--secondary) group-hover:text-blue-600 transition-colors">
            {post.author?.fullName || 'Unknown'}
            {post.author?._id === thisUser?._id && ' (You)'}
          </span>
        </Link>
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
