import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApi'; // Import
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Calendar,
  X,
  Globe,
  FileEdit,
  User,
  Clock,
  Eye,
  Tag,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// BlockNote Imports
import { BlockNoteView } from '@blocknote/mantine';
import {
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import '@blocknote/mantine/style.css';

import {
  Button,
  Input,
  Select,
  Spinner,
  MediaPickerModal,
} from '../../../components';
import useToast from '../../../context/ToastContext';

// Word Count & Reading Time
const getEditorStats = (editor) => {
  if (!editor) return { words: 0, time: 0 };

  // Extract text from all blocks
  let text = '';
  editor.forEachBlock((block) => {
    if (block.content && Array.isArray(block.content)) {
      block.content.forEach((span) => {
        if (span.type === 'text') text += span.text + ' ';
      });
    }
  });

  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200); // Avg reading speed 200 wpm
  return { words: words === 1 && text === '' ? 0 : words, time };
};

const PostEditor = ({ initialData, onSubmit, isSaving }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const currentUser = useSelector(selectUser);
  const author = initialData?.author || currentUser;

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaPickerContext, setMediaPickerContext] = useState('featured');

  const thisUser = useSelector(selectUser);

  // Feature State: SEO Accordion
  const [isSeoOpen, setIsSeoOpen] = useState(false);

  // Feature State: Stats
  const [stats, setStats] = useState({ words: 0, time: 0 });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      status: initialData?.status || 'draft',
      featuredImage: initialData?.featuredImage || null,
      content: initialData?.content || [],
      // New Fields
      category: initialData?.category || 'Uncategorized',
      tags: initialData?.tags?.join(', ') || '',
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
    },
  });

  const watchedTitle = watch('title');
  const watchedSlug = watch('slug');
  const watchedMetaTitle = watch('metaTitle');
  const watchedMetaDesc = watch('metaDescription');
  const featuredImage = watch('featuredImage');

  /*

  // --- FEATURE: Auto-Save (Drafts) ---
  const DRAFT_KEY = `post_draft_${initialData?._id || 'new'}`;

  // 1. Load Draft on Mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft && !initialData) {
      // Only restore for new posts to avoid overwriting server data on edit
      const parsed = JSON.parse(savedDraft);
      if (window.confirm('Found an unsaved draft. Do you want to restore it?')) {
        reset(parsed);
        toast.info('Draft restored');
      }
    }
  }, [DRAFT_KEY, initialData, reset, toast]);

  */

  // 3. Clear Draft on Submit
  const handleFormSubmit = async (data) => {
    // localStorage.removeItem(DRAFT_KEY);
    const blocks = editor.document;

    const tagsArray = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...data,
      tags: tagsArray,
      content: JSON.stringify(blocks),
    };
    onSubmit(payload);
  };

  useEffect(() => {
    if (!initialData && watchedTitle && !isDirty.slug) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, initialData, isDirty.slug, setValue]);

  // --- Editor Setup ---
  const editor = useCreateBlockNote({
    initialContent: initialData?.content
      ? typeof initialData.content === 'string'
        ? JSON.parse(initialData.content)
        : initialData.content
      : undefined,
  });

  const handleEditorChange = useCallback(() => {
    setStats(getEditorStats(editor));
  }, [editor]);

  useEffect(() => {
    if (editor) {
      const cleanup = editor.onEditorContentChange(() => {
        handleEditorChange();
      });
      // Initial calc
      handleEditorChange();
      return cleanup;
    }
  }, [editor, handleEditorChange]);

  const getCustomSlashMenuItems = (editor) => {
    const defaultItems = getDefaultReactSlashMenuItems(editor).filter(
      (item) => item.title !== 'Image'
    );

    const customImageItem = {
      title: 'Image',
      onItemClick: () => {
        setMediaPickerContext('editor');
        setIsMediaModalOpen(true);
      },
      aliases: ['image', 'img', 'picture', 'photo'],
      group: 'Media',
      icon: <ImageIcon size={18} />,
      subtext: 'Insert an image from your library',
    };

    return [customImageItem, ...defaultItems];
  };

  const handleMediaSelect = (media) => {
    if (mediaPickerContext === 'featured') {
      setValue('featuredImage', media, { shouldDirty: true });
    } else {
      const currentBlock = editor.getTextCursorPosition().block;
      editor.insertBlocks(
        [
          {
            type: 'image',
            props: {
              url: media.url,
              name: media.originalName,
            },
          },
        ],
        currentBlock,
        'after'
      );
    }
  };

  const openFeaturedImagePicker = () => {
    setMediaPickerContext('featured');
    setIsMediaModalOpen(true);
  };

  // --- FEATURE: Live Preview ---
  const handlePreview = () => {
    const slug = watchedSlug || 'preview';
    // Opens in new tab
    window.open(`/blog/${slug}`, '_blank');
  };

  const statusOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'private', label: 'Private' },
    { value: 'archived', label: 'Archived' },
  ];

  const { data: categoryData } = useGetCategoriesQuery();

  const categoryOptions =
    categoryData?.data?.categories?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    })) || [];

  // Fallback if empty
  if (categoryOptions.length === 0) {
    categoryOptions.push({ value: 'Uncategorized', label: 'Uncategorized' });
  }

  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://yoursite.com';

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col h-full bg-(--background)"
    >
      <div className="shrink-0 bg-(--card)/80 backdrop-blur-md border-b border-(--border) px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/posts')}
            className="text-(--secondary) hover:text-(--foreground)"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="h-6 w-px bg-(--border)" />
          <h1 className="text-lg font-bold text-(--foreground)">
            {initialData ? 'Edit Post' : 'Create New Post'}
          </h1>
          {isDirty && (
            <span className="text-xs text-(--secondary) italic">
              - Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* FEATURE: Preview Button */}
          <Button
            variant="ghost"
            onClick={handlePreview}
            title="Live Preview"
            className="text-(--secondary) hover:text-primary"
          >
            <Eye className="w-5 h-5" />
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            className="min-w-30 shadow-sm"
          >
            {isSaving ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 lg:p-8 max-w-400 mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            {/* --- LEFT COLUMN --- */}
            <div className="space-y-6 min-w-0">
              <div className=" p-6 space-y-6">
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
                    className={`
                    flex items-center w-full border rounded-lg overflow-hidden transition-all duration-200
                    bg-(--background)
                    ${
                      errors.slug
                        ? 'border-error ring-1 ring-error/20'
                        : 'border-(--border) focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                    }
                  `}
                  >
                    <div className="pl-4 py-2 bg-(--secondary)/5 text-(--secondary) text-sm whitespace-nowrap select-none">
                      {siteUrl}/blog/
                    </div>
                    <input
                      type="text"
                      {...register('slug', { required: 'Slug is required' })}
                      className="flex-1 pl-1 py-2 bg-transparent border-none outline-none text-(--foreground) placeholder-(--secondary)/50 w-full min-w-0"
                      placeholder="post-url-slug"
                    />
                  </div>
                </div>
              </div>

              <div className="min-h-125 pt-7 pb-5 bg-(--card) rounded-xl border border-(--border) shadow-sm p-1 text-(--foreground) [&_.bn-editor]:bg-transparent!">
                <BlockNoteView editor={editor} theme="light" slashMenu={false}>
                  <SuggestionMenuController
                    triggerCharacter={'/'}
                    getItems={async (query) =>
                      getCustomSlashMenuItems(editor).filter((item) =>
                        item.title.toLowerCase().includes(query.toLowerCase())
                      )
                    }
                  />
                </BlockNoteView>
              </div>

              {/* FEATURE: SEO Settings Card */}
              <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsSeoOpen(!isSeoOpen)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-(--secondary)/5 transition-colors"
                >
                  <div className="flex items-center gap-2 font-semibold text-(--foreground)">
                    <Search className="w-4 h-4 text-primary" />
                    Search Engine Optimization (SEO)
                  </div>
                  {isSeoOpen ? (
                    <ChevronUp className="w-4 h-4 text-(--secondary)" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-(--secondary)" />
                  )}
                </button>

                {isSeoOpen && (
                  <div className="px-6 pb-6 pt-2 space-y-6 border-t border-(--border)">
                    <div className="p-4 bg-(--background) rounded-lg border border-(--border)">
                      <div className="text-xs text-(--secondary) mb-1">
                        Preview on Google
                      </div>
                      <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-lg font-medium truncate">
                        {watchedMetaTitle || watchedTitle || 'Page Title'}
                      </div>
                      <div className="text-[#006621] dark:text-[#81c995] text-sm truncate">
                        {siteUrl}/blog/{watchedSlug || 'post-slug'}
                      </div>
                      <div className="text-(--secondary) text-sm mt-1 line-clamp-2">
                        {watchedMetaDesc ||
                          watch('excerpt') ||
                          'Meta description will appear here...'}
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
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="space-y-6">
              {/* Author & Stats */}
              <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden">
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
                        {author?.fullName || 'Unknown Author'}
                      </div>
                      <div className="text-xs text-(--secondary)">
                        {author?.role || 'Author'}
                        {author?._id == thisUser._id && ' (You)'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-(--secondary) flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Created
                    </span>
                    <span className="text-(--foreground) font-medium">
                      {initialData?.createdAt
                        ? new Date(initialData.createdAt).toLocaleDateString()
                        : 'Now'}
                    </span>
                  </div>

                  {/* FEATURE: Word Count Stats */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-(--secondary) flex items-center gap-1.5">
                      <FileEdit className="w-3.5 h-3.5" /> Words
                    </span>
                    <span className="text-(--foreground) font-medium">
                      {stats.words}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-(--secondary) flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Read Time
                    </span>
                    <span className="text-(--foreground) font-medium">
                      {stats.time} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-(--border) font-semibold text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Publishing
                </div>
                <div className="p-4 space-y-4">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Status"
                        options={statusOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* FEATURE: Taxonomy Card */}
              <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-(--border) font-semibold text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Taxonomy
                </div>
                <div className="p-4 space-y-4">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Category"
                        options={categoryOptions}
                        value={field.value}
                        onChange={field.onChange}
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
                    <p className="text-xs text-(--secondary)">
                      Separate with commas
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-(--border) font-semibold text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Featured Image
                </div>
                <div className="p-4">
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
                          className="text-white hover:text-white border border-white/50"
                          onClick={openFeaturedImagePicker}
                        >
                          Change
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-300 hover:text-red-100 border border-red-300/50"
                          onClick={() =>
                            setValue('featuredImage', null, {
                              shouldDirty: true,
                            })
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={openFeaturedImagePicker}
                      className="aspect-video rounded-lg border-2 border-dashed border-(--border) hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center text-(--secondary) gap-2"
                    >
                      <ImageIcon className="w-8 h-8 opacity-50" />
                      <span className="text-sm">Select Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-(--border) font-semibold text-sm flex items-center gap-2">
                  <FileEdit className="w-4 h-4" />
                  Excerpt
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full h-32 px-3 py-2 text-sm bg-(--background) border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-(--foreground)"
                    placeholder="Write a short summary..."
                    {...register('excerpt')}
                  />
                  <p className="text-xs text-(--secondary) mt-2 text-right">
                    {watch('excerpt')?.length || 0} characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
      />
    </form>
  );
};

export default PostEditor;
