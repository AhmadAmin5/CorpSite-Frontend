import { Controller, useFormContext } from 'react-hook-form';
import { Layers } from 'lucide-react';
import { EditorCard } from '../../../components/editor';
import { Select } from '../../../components';

const PageAttributesCard = ({ currentId, pages = [] }) => {
  const { control } = useFormContext();

  const parentOptions = [
    { value: '', label: '(No Parent)' },
    ...pages
      .filter((p) => p._id !== currentId)
      .map((p) => ({
        value: p._id,
        label: `${p.title} (${p.fullPath})`,
      })),
  ];

  return (
    <EditorCard title="Page Attributes" icon={Layers}>
      <Controller
        name="parent"
        control={control}
        render={({ field }) => (
          <Select
            label="Parent Page"
            options={parentOptions}
            {...field}
            value={field.value || ''}
            placeholder="Select Parent"
          />
        )}
      />
      <div className="text-xs text-(--secondary) mt-1">
        Set a parent to create a nested URL structure (e.g. /parent/child).
      </div>
    </EditorCard>
  );
};

export default PageAttributesCard;