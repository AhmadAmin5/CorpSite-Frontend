import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPostPublicQuery } from '../../features/posts/postsApi';

import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';

import { Skeleton, TopLoader } from '../../components';
import NotFound from '../error/NotFound';

const PostContentRenderer = ({ content, theme }) => {
  const initialContent = useMemo(() => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      console.error('Failed to parse post content', e);
      return undefined;
    }
  }, [content]);

  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  if (!editor) return null;

  return (
    <div className="bn-viewer-container [&_.bn-editor]:bg-transparent! [&_.bn-editor]:px-0! md:[&_.bn-editor]:px-13.5!">
      <BlockNoteView
        key={theme}
        editor={editor}
        theme={theme}
        editable={false}
      />
    </div>
  );
};

const PostViewer = () => {
  const { slug } = useParams();

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setCurrentTheme(isDark ? 'dark' : 'light');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const { data, isLoading, isError, isFetching } = useGetPostPublicQuery(slug);

  const post = data?.data?.post || data?.data || data;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return <NotFound />;
  }

  return (
    <>
      <TopLoader forceLoading={isFetching && !isLoading} />

      <article className="min-h-screen bg-(--background) pt-4 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-(--foreground) leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-(--secondary) mb-6">
              {post.category && (
                <Link
                  to={`/blog?category=${encodeURIComponent(post.category)}`}
                  className="bg-(--secondary)/10 px-3 py-1 rounded-full text-(--foreground) font-medium hover:bg-(--secondary)/20 hover:text-primary transition-colors"
                >
                  {post.category}
                </Link>
              )}
              <span>•</span>
              <time dateTime={post.publishedAt || post.createdAt}>
                {new Date(
                  post.publishedAt || post.createdAt
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {post.author && (
              <Link
                to={`/author/${post.author.username}`}
                className="group inline-block"
              >
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all">
                    <img
                      src={
                        post.author.profilePicture ||
                        `https://ui-avatars.com/api/?name=${post.author.name || 'Admin'}`
                      }
                      alt={post.author.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-(--foreground) group-hover:text-primary transition-colors">
                      {post.author.fullName || 'Unknown Author'}
                    </p>
                    {post.author.role && (
                      <p className="text-xs text-(--secondary) capitalize">
                        {post.author.role}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </header>

          {post.featuredImage && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-(--border)">
              <img
                src={post.featuredImage.url}
                alt={post.title}
                className="w-full h-auto max-h-150 object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content ? (
              <PostContentRenderer
                key={post._id}
                content={post.content}
                theme={currentTheme}
              />
            ) : (
              <p className="text-center text-(--secondary) italic">
                No content available.
              </p>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-(--border)">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-(--secondary)/5 text-(--secondary) rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default PostViewer;
