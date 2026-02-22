import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../../../../components';

export const PostTitleSection = ({ siteUrl }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const watchedTitle = watch('title');

  useEffect(() => {
    if (watchedTitle && !dirtyFields.slug) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, dirtyFields.slug, setValue]);

  return (
    <div className="p-6 space-y-6">
      <Input
        label="Post Title"
        placeholder="Enter the title of your post"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
        className="w-full"
        inputClassName="text-xl font-bold px-4 py-3"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-(--foreground)">
          Slug
        </label>
        <div
          className={`flex items-center w-full border rounded-lg overflow-hidden bg-(--background) ${errors.slug ? 'border-error' : 'border-(--border) focus-within:border-primary'}`}
        >
          <div className="pl-4 py-2 bg-(--secondary)/5 text-(--secondary) text-sm whitespace-nowrap select-none">
            {siteUrl}/blog/
          </div>
          <input
            type="text"
            {...register('slug', { required: 'Slug is required' })}
            className="flex-1 pl-1 py-2 bg-transparent border-none outline-none text-(--foreground) w-full"
            placeholder="post-url-slug"
          />
        </div>
      </div>
    </div>
  );
};

export const SeoSettingsCard = ({ siteUrl }) => {
  const { register, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  const metaTitle = watch('metaTitle');
  const title = watch('title');
  const slug = watch('slug');
  const metaDesc = watch('metaDescription');
  const excerpt = watch('excerpt');

  return (
    <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-(--secondary)/5"
      >
        <div className="flex items-center gap-2 font-semibold text-(--foreground)">
          <Search className="w-4 h-4 text-primary" />
          Search Engine Optimization (SEO)
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-(--secondary)" />
        ) : (
          <ChevronDown className="w-4 h-4 text-(--secondary)" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 space-y-6 border-t border-(--border)">
          {/* Google Preview */}
          <div className="p-4 bg-(--background) rounded-lg border border-(--border)">
            <div className="text-xs text-(--secondary) mb-1">
              Preview on Google
            </div>
            <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-lg font-medium truncate">
              {metaTitle || title || 'Page Title'}
            </div>
            <div className="text-[#006621] dark:text-[#81c995] text-sm truncate">
              {siteUrl}/blog/{slug || 'post-slug'}
            </div>
            <div className="text-(--secondary) text-sm mt-1 line-clamp-2">
              {metaDesc || excerpt || 'Meta description will appear here...'}
            </div>
          </div>

          <Input
            label="Meta Title"
            placeholder="Custom title for search engines"
            {...register('metaTitle')}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-(--foreground)">
              Meta Description
            </label>
            <textarea
              {...register('metaDescription')}
              rows={3}
              className="w-full px-3 py-2 bg-(--background) border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-(--foreground)"
              placeholder="Summarize your post for search results..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
