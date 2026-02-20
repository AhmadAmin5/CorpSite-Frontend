import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (currentPage > 3) pages.push(1);
    if (currentPage > 4) pages.push('...');

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) pages.push('...');
    if (currentPage < totalPages - 2) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {getPageNumbers().map((page, idx) =>
        typeof page === 'number' ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={`
              w-9 h-9 rounded-lg text-sm font-medium transition-colors
              ${
                currentPage === page
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-(--foreground) hover:bg-(--secondary)/10'
              }
            `}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="text-(--secondary) px-1">
            ...
          </span>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Pagination;
