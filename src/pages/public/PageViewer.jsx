import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPagePublicQuery } from '../../features/pages/PagesApi';

import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';

import { Skeleton, TopLoader, Hero, Button } from '../../components';
import NotFound from '../error/NotFound';
import { Mail, Phone, ArrowRight } from 'lucide-react';

const PageContentRenderer = ({ content, theme }) => {
  const initialContent = useMemo(() => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      console.error('Failed to parse page content', e);
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

const PageViewer = () => {
  const { slug, '*': splatPath } = useParams();
  const queryPath = splatPath || slug;

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

  const { data, isLoading, isError, isFetching } =
    useGetPagePublicQuery(queryPath);

  const page = data?.data?.page || data?.data || data;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <Skeleton className="h-14 w-1/2 mb-6" />
        <Skeleton className="h-4 w-1/4 mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          <div className="space-y-4">
            <Skeleton className="h-75 w-full rounded-2xl mb-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !page) {
    return <NotFound />;
  }

  return (
    <>
      <TopLoader forceLoading={isFetching && !isLoading} />

      <header>
        <Hero title={page.title} description={page.metaDescription} />
      </header>

      <article className="min-h-screen bg-(--background) pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
            {/* Left Column: Main Content */}
            <div className="min-w-0">
              {page.featuredImage && (
                <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-(--border)">
                  <img
                    src={page.featuredImage.url}
                    alt={page.title}
                    className="w-full h-auto max-h-125 object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {page.content ? (
                  <PageContentRenderer
                    key={page._id}
                    content={page.content}
                    theme={currentTheme}
                  />
                ) : (
                  <p className="text-(--secondary) italic">
                    This page is currently empty.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="space-y-6">
              {/* Support CTA Card */}
              <div className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-(--foreground) mb-2">
                    Need Assistance?
                  </h3>
                  <p className="text-(--secondary) mb-6 text-sm">
                    Our team is ready to help you find the right solution for
                    your business.
                  </p>
                  <div className="space-y-4">
                    <Button
                      variant="primary"
                      className="w-full justify-center shadow-md"
                      text="Contact Support"
                      onClick={() => (window.location.href = '/contact')}
                    />
                    <div className="flex flex-col gap-3 pt-4 border-t border-(--border) text-sm text-(--secondary)">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />{' '}
                        support@corpsite.com
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" /> +1 (555)
                        123-4567
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-(--foreground) mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/services"
                      className="text-(--secondary) hover:text-primary flex items-center justify-between group transition-colors"
                    >
                      Our Services
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/solutions"
                      className="text-(--secondary) hover:text-primary flex items-center justify-between group transition-colors"
                    >
                      Industry Solutions
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-(--secondary) hover:text-primary flex items-center justify-between group transition-colors"
                    >
                      About Us
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
};

export default PageViewer;
