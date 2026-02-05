import { Tag } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { useGetCategoriesQuery } from '../../../categories/categoriesApi';
import { Select } from '../../../../components'
import { EditorCard } from '../../../../components/editor';

const TaxonomyCard = () => {
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

export default TaxonomyCard;