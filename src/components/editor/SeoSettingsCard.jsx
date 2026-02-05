import { Search } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Input } from '..';
import EditorCard from './EditorCard';

const SeoSettingsCard = ({ siteUrl, urlPrefix = '/blog/' }) => {
  const { register, watch } = useFormContext();

  const metaTitle = watch('metaTitle');
  const title = watch('title');
  const slug = watch('slug');
  const metaDesc = watch('metaDescription');
  const excerpt = watch('excerpt');

  return (
    <EditorCard 
      title="Search Engine Optimization (SEO)" 
      icon={Search} 
      collapsible={true} 
      defaultOpen={false}
    >
      <div className="space-y-6">
        {/* Google Preview */}
        <div className="p-4 bg-(--background) rounded-lg border border-(--border)">
          <div className="text-xs text-(--secondary) mb-1">
            Preview on Google
          </div>
          <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-lg font-medium truncate">
            {metaTitle || title || 'Page Title'}
          </div>
          <div className="text-[#006621] dark:text-[#81c995] text-sm truncate">
            {siteUrl}{urlPrefix}{slug || 'slug'}
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
            placeholder="Summarize your content for search results..."
          />
        </div>
      </div>
    </EditorCard>
  );
};

export default SeoSettingsCard;