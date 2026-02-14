import { Controller, useFormContext } from 'react-hook-form';
import { Layers, Code, Box } from 'lucide-react'; // Added icons
import { EditorCard } from '../../../components/editor';
import { Select, Input } from '../../../components';

const PageAttributesCard = ({ currentId, pages = [] }) => {
  const { control, watch } = useFormContext();

  const pageType = watch('pageType');

  const parentOptions = [
    { value: '', label: '(No Parent)' },
    ...pages
      .filter((p) => p._id !== currentId)
      .map((p) => ({
        value: p._id,
        label: `${p.title} (${p.fullPath})`,
      })),
  ];

  const typeOptions = [
    { value: 'generic', label: 'Generic (Rich Text)' },
    { value: 'hardcoded', label: 'Hardcoded (React Component)' },
    { value: 'functional', label: 'Functional (Logic Based)' },
  ];

  return (
    <EditorCard title="Page Attributes" icon={Layers}>
      <div className="space-y-4">
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

        <Controller
          name="pageType"
          control={control}
          render={({ field }) => (
            <Select
              label="Page Type"
              options={typeOptions}
              {...field}
              value={field.value || 'generic'}
              placeholder="Select Type"
            />
          )}
        />

        {pageType && pageType !== 'generic' && (
          <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg space-y-3 animation-fade-in">
            <div className="flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400">
              <Code className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                This page uses a custom React component. Content editing might
                be disabled.
              </p>
            </div>

            <Controller
              name="componentName"
              control={control}
              rules={{ required: 'Component Name is required for this type' }}
              render={({ field, fieldState }) => (
                <Input
                  label="Component Name"
                  placeholder="e.g. HomeTemplate"
                  {...field}
                  error={fieldState.error?.message}
                  icon={Box}
                />
              )}
            />
          </div>
        )}

        <div className="text-xs text-(--secondary) mt-1">
          Set a parent to create a nested URL structure (e.g. /parent/child).
        </div>
      </div>
    </EditorCard>
  );
};

export default PageAttributesCard;
