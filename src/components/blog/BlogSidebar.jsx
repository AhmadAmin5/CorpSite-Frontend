import { Search, X } from 'lucide-react';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi';
import { Input, Skeleton } from '../../components';

const BlogSidebar = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  onClearFilters,
}) => {
  const { data: catData, isLoading: catLoading } = useGetCategoriesQuery();

  const categories = catData?.data?.categories || [];

  return (
    <aside className="space-y-8 w-full">
      {/* --- Search Widget --- */}
      <div className="bg-(--card) border border-(--border) rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 text-(--foreground)">Search</h3>
        <div className="relative">
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <div className="absolute right-3 top-2.5 text-(--secondary)">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* --- Categories Widget --- */}
      <div className="bg-(--card) border border-(--border) rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-(--foreground)">Categories</h3>
          {(selectedCategory || search) && (
            <button
              onClick={onClearFilters}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`
              text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer
              ${
                !selectedCategory
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-(--secondary) hover:bg-(--secondary)/10 hover:text-(--foreground)'
              }
            `}
          >
            All Articles
          </button>

          {catLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))
            : categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`
                  text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center cursor-pointer
                  ${
                    selectedCategory === cat.name
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-(--secondary) hover:bg-(--secondary)/10 hover:text-(--foreground)'
                  }
                `}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
