import { Controller, useFormContext } from 'react-hook-form';
import {
  Globe,
  Tag,
  ImageIcon,
  FileEdit,
  X,
  User,
  Clock,
  Calendar,
  History,
  FileText,
} from 'lucide-react';
import { Select, Button, Input } from '../../../../components';
import { EditorCard } from './EditorUI';
import { useGetCategoriesQuery } from '../../../categories/categoriesApi';

export const AuthorStatsCard = ({
  author,
  isCurrentUser,
  stats,
  createdAt,
  updatedAt,
}) => {
  return (
    <EditorCard className="p-0">
      {/* Header/Author Section */}
      <div className="p-4 border-b border-(--border) bg-(--secondary)/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-(--border) bg-(--background)">
            {author?.profilePicture ? (
              <img
                src={author.profilePicture}
                alt={author.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-(--secondary)">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-(--foreground)">
              {author?.fullName || 'Unknown'}
            </div>
            <div className="text-xs text-(--secondary)">
              {author?.role} {isCurrentUser && '(You)'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-(--secondary)/5 rounded-lg border border-(--border)/50">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-(--secondary) flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Words
            </span>
            <span className="text-sm font-semibold text-(--foreground)">
              {stats.words}
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l border-(--border)/50 pl-4">
            <span className="text-xs text-(--secondary) flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Time
            </span>
            <span className="text-sm font-semibold text-(--foreground)">
              {stats.time} min
            </span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-3 pt-1">
          <div className="flex justify-between items-start text-sm group">
            <span className="text-(--secondary) flex items-center gap-2 mt-0.5">
              <Calendar className="w-4 h-4" /> Created
            </span>
            <div className="text-right">
              <div className="font-medium">
                {createdAt ? new Date(createdAt).toLocaleDateString() : 'Now'}
              </div>
            </div>
          </div>
          {createdAt && createdAt !== updatedAt && (
            <div className="flex justify-between items-start text-sm group">
              <span className="text-(--secondary) flex items-center gap-2 mt-0.5">
                <History className="w-4 h-4" /> Modified
              </span>
              <div className="text-right">
                <div className="font-medium">
                  {new Date(updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </EditorCard>
  );
};

export const PublishingCard = () => {
  const { control } = useFormContext();

  const statusOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'private', label: 'Private' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <EditorCard title="Publishing" icon={Globe}>
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select label="Status" options={statusOptions} {...field} />
        )}
      />
    </EditorCard>
  );
};

export const TaxonomyCard = () => {
  const { register, control } = useFormContext();
  const { data } = useGetCategoriesQuery();

  const categoryOptions =
    data?.data?.categories?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    })) || [];

  if (categoryOptions.length === 0)
    categoryOptions.push({ value: 'Uncategorized', label: 'Uncategorized' });

  return (
    <EditorCard title="Taxonomy" icon={Tag}>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            options={categoryOptions}
            {...field}
            placeholder="Select Category"
          />
        )}
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-(--foreground)">
          Tags
        </label>
        <input
          type="text"
          {...register('tags')}
          placeholder="react, design, tutorial"
          className="w-full px-3 py-2 bg-(--background) border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-(--foreground)"
        />
        <p className="text-xs text-(--secondary)">Separate with commas</p>
      </div>
    </EditorCard>
  );
};

export const FeaturedImageCard = ({ onOpenPicker }) => {
  const { watch, setValue } = useFormContext();
  const featuredImage = watch('featuredImage');

  return (
    <EditorCard title="Featured Image" icon={ImageIcon}>
      {featuredImage ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-(--border) group">
          <img
            src={featuredImage.url}
            alt="Featured"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white border border-white/50"
              onClick={onOpenPicker}
            >
              Change
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-300 border border-red-300/50"
              onClick={() =>
                setValue('featuredImage', null, { shouldDirty: true })
              }
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={onOpenPicker}
          className="aspect-video rounded-lg border-2 border-dashed border-(--border) hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center text-(--secondary) gap-2"
        >
          <ImageIcon className="w-8 h-8 opacity-50" />
          <span className="text-sm">Select Image</span>
        </div>
      )}
    </EditorCard>
  );
};

export const ExcerptCard = () => {
  const { register, watch } = useFormContext();
  const excerpt = watch('excerpt');

  return (
    <EditorCard title="Excerpt" icon={FileEdit}>
      <textarea
        className="w-full h-32 px-3 py-2 text-sm bg-(--background) border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-(--foreground)"
        placeholder="Write a short summary..."
        {...register('excerpt')}
      />
      <p className="text-xs text-(--secondary) mt-2 text-right">
        {excerpt?.length || 0} characters
      </p>
    </EditorCard>
  );
};
