import { Search } from 'lucide-react';
import Input from '../ui/Input';

const TableToolbar = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search...',
  children,
}) => {
  return (
    <div className="bg-(--card) p-4 rounded-xl border border-(--border) shadow-sm flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Search Section */}
      <div className="relative grow md:max-w-md">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary)">
          <Search className="w-4 h-4" />
        </div>
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={onSearchChange}
          inputClassName="pl-10"
          className="w-full"
        />
      </div>

      {/* Filters Section (Dynamic) */}
      {children && (
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
