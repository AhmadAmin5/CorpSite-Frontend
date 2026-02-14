import Button from '../ui/Button';

const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-(--foreground)">{title}</h1>
        {description && (
          <p className="text-(--secondary) text-sm mt-1">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
