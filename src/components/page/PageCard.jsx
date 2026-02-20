import { Link } from 'react-router-dom';

const PageCard = ({ page, basePath, icon: Icon }) => {
  if (!page) return null; //

  const description =
    page?.metaDescription ||
    `Explore our specialized solutions in ${page?.title}.`; //

  return (
    <Link
      to={`${basePath}/${page?.slug}`} //
      className="group relative flex flex-col justify-between h-full bg-(--card) rounded-2xl border border-(--border) shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-8"
    >
      {Icon && (
        <div className="absolute -top-4 -right-4 text-primary opacity-[0.1] group-hover:opacity-[0.2] transition-all duration-500 pointer-events-none">
          <Icon
            size={140}
            strokeWidth={1}
            className="rotate-12 group-hover:rotate-0 transition-transform duration-700"
          />
        </div>
      )}

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-(--foreground) group-hover:text-primary transition-colors duration-300">
          {page?.title}
        </h3>
        <p className="mt-4 text-base text-(--secondary) leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-8 flex items-center gap-2 text-sm font-bold text-primary">
        <span>Learn more</span>
        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
          &rarr;
        </span>
      </div>
    </Link>
  );
};

export default PageCard;
