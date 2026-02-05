import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '..';

const TitleSlugSection = ({ siteUrl, urlPrefix = '/blog/' }) => {
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
        label="Title"
        placeholder="Enter title here"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
        className="w-full"
        inputClassName="text-xl font-bold px-4 py-3"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-(--foreground)">
          Slug (URL)
        </label>
        <div
          className={`flex items-center w-full border rounded-lg overflow-hidden bg-(--background) ${errors.slug ? 'border-error' : 'border-(--border) focus-within:border-primary'}`}
        >
          <div className="pl-4 py-2 bg-(--secondary)/5 text-(--foreground)/50 text-sm whitespace-nowrap select-none">
            {siteUrl}{urlPrefix}
          </div>
          <input
            type="text"
            {...register('slug', { required: 'Slug is required' })}
            className="flex-1 pl-0 py-2 bg-transparent border-none outline-none text-(--foreground) w-full"
            placeholder="url-slug"
          />
        </div>
      </div>
    </div>
  );
};

export default TitleSlugSection;