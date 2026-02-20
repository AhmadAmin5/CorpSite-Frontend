import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code,
  Cloud,
  ShieldCheck,
  Cpu,
  Database,
  Globe,
} from 'lucide-react';
import { useGetPagesPublicQuery } from '../../features/pages/PagesApi';
import { PageCard, Skeleton } from '../';

const TECH_ICONS = [Code, Cloud, ShieldCheck, Cpu, Database, Globe];

const ServicesSection = () => {
  const { data, isLoading, isError } = useGetPagesPublicQuery({
    parent: 'services',
    limit: 3,
  });

  const services = data?.data?.pages || data?.pages || [];

  if (isError) return null;

  return (
    <section className="py-24 bg-(--card) border-t border-(--border)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-(--foreground) mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-(--secondary)">
              We engineer robust, scalable, and secure digital solutions
              tailored to complex business needs.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline shrink-0"
          >
            View all services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col h-72 bg-(--background) rounded-xl border border-(--border) p-6 shadow-sm"
              >
                <Skeleton className="h-12 w-12 rounded-lg mb-6" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
                <Skeleton className="h-4 w-24 mt-auto" />
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const AssignedIcon = TECH_ICONS[index % TECH_ICONS.length];

              return (
                <PageCard
                  key={service._id}
                  page={service}
                  basePath="/services"
                  icon={AssignedIcon}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-(--secondary) bg-(--background) rounded-2xl border border-(--border)">
            More services coming soon.
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
