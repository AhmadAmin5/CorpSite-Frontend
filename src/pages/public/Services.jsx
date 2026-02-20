import React from 'react';
import { useGetPagesPublicQuery } from '../../features/pages/PagesApi';
import { CtaBlock, Hero, PageCard, Skeleton } from '../../components';
import GlobalError from '../error/GlobalError';

const mySlug = 'services';

const Services = () => {
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
        title="Our Services"
        description="We engineer robust, scalable, and secure digital solutions tailored to complex business needs. Explore our core service offerings below."
      />

      {/* Services Grid Section */}
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
              <PageCard key={page._id} page={page} basePath="/services" />
            ))}

          {/* Empty State */}
          {!isLoading && childPages.length === 0 && (
            <div className="col-span-full text-center py-12 text-(--secondary)">
              No services found at this time.
            </div>
          )}
        </div>
        <CtaBlock />
      </div>
    </div>
  );
};

export default Services;
