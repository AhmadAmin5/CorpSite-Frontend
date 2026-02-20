import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Layers,
  Image as ImageIcon,
  ArrowRight,
  Activity,
  Calendar,
} from 'lucide-react';

import { useGetPostsQuery } from '../../features/posts/postsApi';
import { useGetPagesQuery } from '../../features/pages/pagesApi';
import { useGetUsersQuery } from '../../features/users/usersApi';
import { useGetMediaQuery } from '../../features/media/mediaApi';
import { selectUser } from '../../features/auth/authSlice';

import { Button, Skeleton, Table, InfoCell, DateCell } from '../../components';
import PostStatusBadge from '../../features/posts/components/PostStatusBadge';

const StatCard = ({ title, value, icon: Icon, color, isLoading, to }) => {
  return (
    <div className="bg-(--card) border border-(--border) rounded-xl p-6 shadow-sm flex items-start justify-between relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-(--secondary) text-sm font-medium mb-1">{title}</p>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <h3 className="text-3xl font-bold text-(--foreground)">{value}</h3>
        )}
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-4 hover:underline"
        >
          Manage {title} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div
        className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 mb-auto`}
      >
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>

      <Icon
        className={`absolute -bottom-4 -right-4 w-32 h-32 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-500 ${color.replace('bg-', 'text-')}`}
      />
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, to, onClick }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="h-auto flex-col gap-3 p-4 border border-(--border) hover:border-primary hover:bg-primary/5 transition-all text-center w-full"
  >
    {to ? (
      <Link to={to} className="flex flex-col items-center gap-3 w-full">
        <div className="p-3 bg-(--background) rounded-full shadow-sm border border-(--border)">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <span className="font-medium text-(--foreground)">{label}</span>
      </Link>
    ) : (
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="p-3 bg-(--background) rounded-full shadow-sm border border-(--border)">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <span className="font-medium text-(--foreground)">{label}</span>
      </div>
    )}
  </Button>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const { data: postsData, isLoading: postsLoading } = useGetPostsQuery({
    limit: 5,
  });
  const { data: pagesData, isLoading: pagesLoading } = useGetPagesQuery({
    limit: 1,
  });
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({
    limit: 1,
  });
  const { data: mediaData, isLoading: mediaLoading } = useGetMediaQuery({
    limit: 1,
  });

  const stats = {
    posts: postsData?.data?.pagination?.totalPosts || 0,
    pages: pagesData?.data?.pagination?.totalPages || 0,
    users: usersData?.data?.pagination?.totalUsers || 0,
    media: mediaData?.data?.pagination?.totalMedia || 0,
  };

  const recentPostsColumns = [
    {
      header: 'Recent Post',
      render: (post) => (
        <InfoCell
          imgUrl={post.featuredImage?.url}
          title={post.title}
          subtitle={`/${post.slug}`}
        />
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
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-(--foreground) tracking-tight">
            Dashboard
          </h1>
          <div className="text-(--secondary) mt-2 flex items-start gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-success mt-2 shrink-0" />
            <p className="leading-normal">
              {getGreeting()},{' '}
              <span className="font-semibold text-(--foreground)">
                {user?.fullName || 'User'}
              </span>
              . Here is what's happening today.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-(--secondary) w-full md:w-auto justify-start md:justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Posts"
          value={stats.posts}
          icon={FileText}
          color="bg-blue-500"
          isLoading={postsLoading}
          to="/admin/posts"
        />
        <StatCard
          title="Pages"
          value={stats.pages}
          icon={Layers}
          color="bg-purple-500"
          isLoading={pagesLoading}
          to="/admin/pages"
        />
        <StatCard
          title="Media Items"
          value={stats.media}
          icon={ImageIcon}
          color="bg-pink-500"
          isLoading={mediaLoading}
          to="/admin/media"
        />
        <StatCard
          title="Users"
          value={stats.users}
          icon={Users}
          color="bg-orange-500"
          isLoading={usersLoading}
          to="/admin/users"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-(--foreground) flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Posts
            </h2>
            <Link
              to="/admin/posts"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={recentPostsColumns}
              data={postsData?.data?.posts || []}
              isLoading={postsLoading}
              emptyMessage="No posts created yet."
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-(--foreground)">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <QuickAction
              icon={FileText}
              label="New Post"
              onClick={() => navigate('/admin/posts/create')}
            />
            <QuickAction
              icon={Layers}
              label="New Page"
              onClick={() => navigate('/admin/pages/create')}
            />
            <QuickAction
              icon={ImageIcon}
              label="Upload Media"
              onClick={() => navigate('/admin/media')}
            />
            <QuickAction
              icon={Users}
              label="Invite User"
              onClick={() => navigate('/admin/users')}
            />
          </div>

          <div className="bg-(--card) border border-(--border) rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-(--foreground)">System Status</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-(--secondary)">Server Status</span>
                <span className="text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>{' '}
                  Online
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-(--secondary)">Version</span>
                <span className="text-(--foreground)">v1.0.2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-(--secondary)">Last Backup</span>
                <span className="text-(--foreground)">Today, 04:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
