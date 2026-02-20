import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetPostsPublicQuery } from '../../features/posts/postsApi';

import PostCard from '../../components/blog/PostCard';
import BlogSidebar from '../../components/blog/BlogSidebar';
import Pagination from '../../components/blog/Pagination';
import { Skeleton, Button, CtaBlock } from '../../components';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (debouncedSearch) params.q = debouncedSearch;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
  }, [page, debouncedSearch, category, setSearchParams]);

  const { data, isLoading, isFetching, isError } = useGetPostsPublicQuery({
    page,
    limit: 9,
    search: debouncedSearch,
    category: category === 'all' ? '' : category,
    status: 'published',
  });

  const posts = data?.data?.posts || [];
  const pagination = data?.data?.pagination || {
    totalPages: 1,
    currentPage: 1,
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-(--background) py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-(--foreground) mb-3">
            Our Blog
          </h1>
          <p className="text-lg text-(--secondary)">
            Insights, tutorials, and updates from our team.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* --- SIDEBAR (Desktop: Right side, Mobile: Top) --- */}
          <div className="lg:w-1/4 lg:order-last">
            <BlogSidebar
              search={search}
              setSearch={setSearch}
              selectedCategory={category}
              setSelectedCategory={handleCategoryChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="lg:w-3/4">
            {/* Loading State */}
            {(isLoading || isFetching) && posts.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-20 bg-destructive/5 rounded-xl border border-destructive/20">
                <h3 className="text-destructive font-bold text-lg mb-2">
                  Error loading posts
                </h3>
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>

                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-(--card) rounded-xl border border-(--border)">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--secondary)/10 mb-4">
                  <Search className="w-8 h-8 text-(--secondary)" />
                </div>
                <h3 className="text-xl font-bold text-(--foreground) mb-2">
                  No articles found
                </h3>
                <p className="text-(--secondary) mb-6">
                  We couldn't find any articles matching your search criteria.
                </p>
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        <CtaBlock />
      </div>
    </div>
  );
};

export default Blog;
