import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';

import { Image as ImageIcon } from 'lucide-react';
import { BlockNoteView } from '@blocknote/mantine';
import {
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import '@blocknote/mantine/style.css';

import { MediaPickerModal } from '../../../components';
import {
  EditorHeader,
  TitleSlugSection,
  SeoSettingsCard,
  AuthorStatsCard,
  PublishingCard,
} from '../../../components/editor';

import { useGetPagesQuery } from '../pagesApi';
import PageAttributesCard from './PageAttributesCard';

const getEditorStats = (editor) => {
  if (!editor) return { words: 0, time: 0 };
  let text = '';
  editor.forEachBlock((block) => {
    if (block.content && Array.isArray(block.content)) {
      block.content.forEach((span) => {
        if (span.type === 'text') text += span.text + ' ';
      });
    }
  });
  const words = text.trim().split(/\s+/).length;
  return {
    words: words === 1 && text === '' ? 0 : words,
    time: Math.ceil(words / 200),
  };
};

const PageEditor = ({ initialData, onSubmit, isSaving }) => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const author = initialData?.author || currentUser;

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [stats, setStats] = useState({ words: 0, time: 0 });

  const { data: pagesData } = useGetPagesQuery({ limit: 1000 });
  const allPages = pagesData?.data?.pages || [];

  const methods = useForm({
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      status: initialData?.status || 'draft',
      parent: initialData?.parent?._id || initialData?.parent || '', 
      content: initialData?.content || [],
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isDirty },
  } = methods;

  const watchedParentId = watch('parent');

  const selectedParent = allPages.find((p) => p._id === watchedParentId);
  const dynamicUrlPrefix = selectedParent ? `/${selectedParent.fullPath}/` : '/';

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
      const cleanup = editor.onEditorContentChange(handleEditorChange);
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
        setIsMediaModalOpen(true);
      },
      aliases: ['image', 'img', 'picture'],
      group: 'Media',
      icon: <ImageIcon size={18} />,
      subtext: 'Insert from library',
    };
    return [customImageItem, ...defaultItems];
  };

  const handleMediaSelect = (media) => {
    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [
        {
          type: 'image',
          props: { url: media.url, name: media.originalName },
        },
      ],
      currentBlock,
      'after'
    );
  };

  const onFormSubmit = async (data) => {
    const blocks = editor.document;
    const payload = {
      ...data,
      parent: data.parent || null,
      content: JSON.stringify(blocks),
    };
    onSubmit(payload);
  };

  const handlePreview = () => {
    const slug = watch('slug') || 'preview';
    const path = selectedParent 
      ? `${selectedParent.fullPath}/${slug}` 
      : slug;
    window.open(`/${path}`, '_blank');
  };

  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://yoursite.com';

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col h-full bg-(--background)"
      >
        <EditorHeader
          title={initialData ? 'Edit Page' : 'Create New Page'}
          onBack={() => navigate('/admin/pages')}
          onPreview={handlePreview}
          isSaving={isSaving}
          isDirty={isDirty}
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 lg:p-8 max-w-400 mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
              {/* --- LEFT COLUMN: Main Content --- */}
              <div className="space-y-6 min-w-0">
                
                <TitleSlugSection siteUrl={siteUrl} urlPrefix={dynamicUrlPrefix} />

                <div className="min-h-125 pt-7 pb-5 bg-(--card) rounded-xl border border-(--border) shadow-sm p-1 text-(--foreground) [&_.bn-editor]:bg-transparent!">
                  <BlockNoteView
                    editor={editor}
                    theme="light"
                    slashMenu={false}
                  >
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

                <SeoSettingsCard siteUrl={siteUrl} urlPrefix={dynamicUrlPrefix} />
              </div>

              {/* --- RIGHT COLUMN: Sidebar --- */}
              <div className="space-y-6">
                <AuthorStatsCard
                  author={author}
                  isCurrentUser={author?._id === currentUser?._id}
                  stats={stats}
                  createdAt={initialData?.createdAt}
                  updatedAt={initialData?.updatedAt}
                />
                <PublishingCard />
                
                <PageAttributesCard 
                  currentId={initialData?._id} 
                  pages={allPages}
                />
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
    </FormProvider>
  );
};

export default PageEditor;