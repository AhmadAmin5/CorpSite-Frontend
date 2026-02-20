import { useGetPagesPublicQuery } from '../../features/pages/pagesApi';
import { CtaBlock, Hero, PageCard, Skeleton } from '../../components';
import GlobalError from '../error/GlobalError';

const mySlug = 'solutions';

const Solutions = () => {
  const { data, isLoading, isError } = useGetPagesPublicQuery({
    parent: mySlug,
    limit: 20,
  });

  if (isError) return <GlobalError />;

  const childPages = data?.data?.pages || data?.pages || [];

  return (
    <div className="min-h-screen bg-(--background) pb-20 transition-colors duration-200">
      {/* Hero Section */}
      <Hero
        title="Our Solutions"
        description="Discover our innovative, end-to-end solutions designed to tackle your most complex business challenges and drive growth."
      />

      {/* Solutions Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Loading State */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col h-full bg-(--card) rounded-xl border border-(--border) p-6"
              >
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
                <Skeleton className="h-4 w-24 mt-auto" />
              </div>
            ))}

          {/* Render Child Pages */}
          {!isLoading &&
            childPages.length > 0 &&
            childPages.map((page) => (
              <PageCard key={page._id} page={page} basePath="/solutions" />
            ))}

          {/* Empty State */}
          {!isLoading && childPages.length === 0 && (
            <div className="col-span-full text-center py-12 text-(--secondary)">
              No solutions found at this time.
            </div>
          )}
        </div>
        <CtaBlock />
      </div>
    </div>
  );
};

export default Solutions;
