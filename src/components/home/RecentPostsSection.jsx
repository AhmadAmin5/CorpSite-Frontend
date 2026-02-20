import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGetPostsPublicQuery } from '../../features/posts/postsApi';
import PostCard from '../blog/PostCard';
import { Skeleton } from '../';

const RecentPostsSection = () => {
  const { data, isLoading, isError } = useGetPostsPublicQuery({
    page: 1,
    limit: 3,
  });

  const posts = data?.data?.posts || [];

  if (isError) return null;

  return (
    <section className="py-24 bg-(--secondary)/5 border-t border-(--border)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-(--foreground) mb-4">
              Latest Engineering Insights
            </h2>
            <p className="text-lg text-(--secondary)">
              Discover our latest thoughts on software architecture, industry
              trends, and deep technical dives from our engineering team.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline shrink-0"
          >
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-(--secondary) bg-(--card) rounded-2xl border border-(--border)">
            More insights coming soon.
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentPostsSection;
