import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../../lib/supabase';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  id?: string;
  placeholder?: string;
  rows?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  id = 'markdown-editor',
  placeholder = 'Write markdown content here... (Tip: Paste or drop images directly!)',
  rows = 14
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const handleUploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setIsUploading(true);
    const textarea = textareaRef.current;
    const originalValue = value;
    const startPos = textarea ? textarea.selectionStart : originalValue.length;
    const endPos = textarea ? textarea.selectionEnd : originalValue.length;

    const placeholderText = `![Uploading ${file.name}...]()`;
    const newValue =
      originalValue.substring(0, startPos) +
      placeholderText +
      originalValue.substring(endPos);
    onChange(newValue);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      const markdownImage = `![${file.name}](${publicUrl})`;

      const updatedValue = newValue.replace(placeholderText, markdownImage);
      onChange(updatedValue);
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      alert(`Image upload failed: ${err.message || 'Ensure bucket "project-images" exists in Supabase'}`);
      const revertedValue = newValue.replace(placeholderText, '');
      onChange(revertedValue);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = e.clipboardData?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        handleUploadImage(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        handleUploadImage(file);
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between bg-surface-container border border-b-0 border-outline-variant px-4 py-2 rounded-t-[16px]">
        <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-outline-variant/40">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`px-3 py-1 text-label-sm font-label-sm font-medium rounded-md transition-colors ${
              mode === 'write'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 text-label-sm font-label-sm font-medium rounded-md transition-colors ${
              mode === 'preview'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Preview
          </button>
        </div>

        {isUploading ? (
          <span className="font-label-sm text-label-sm text-primary animate-pulse flex items-center gap-1">
            <span className="material-symbols-rounded text-[16px]">cloud_upload</span>
            Uploading image...
          </span>
        ) : (
          <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70 hidden sm:inline">
            Paste or drag & drop images to auto-upload
          </span>
        )}
      </div>

      {mode === 'write' ? (
        <textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onDrop={handleDrop}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-surface border border-outline-variant rounded-b-[16px] p-4 font-mono text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-y min-h-[300px]"
        />
      ) : (
        <div className="w-full bg-surface border border-outline-variant rounded-b-[16px] p-6 min-h-[300px] max-h-[600px] overflow-y-auto prose prose-lg max-w-none text-on-surface-variant prose-headings:font-headline-md prose-headings:text-on-surface prose-a:text-primary">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-on-surface-variant italic font-body-md">
              Nothing to preview yet. Switch to "Write" mode to add content.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
