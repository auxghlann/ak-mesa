'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import MarkdownEditor from './MarkdownEditor';
import AdminProjectFormSkeleton from '../skeletons/AdminProjectFormSkeleton';
import { revalidateProjectsCache } from '@/app/actions/projects';

interface ProjectFormData {
  slug: string;
  title: string;
  date: string;
  icon: string;
  app_icon_url: string;
  tags: string;
  short_description: string;
  tech_stack: string;
  livePreview: string;
  github: string;
  videoDemo: string;
  article: string;
  content: string;
  is_pinned: boolean;
  is_visible: boolean;
}

export default function AdminProjectForm({ id }: { id?: string }) {
  const isEditing = Boolean(id);
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormData>({
    slug: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    icon: 'code',
    app_icon_url: '',
    tags: '',
    short_description: '',
    tech_stack: '',
    livePreview: '',
    github: '',
    videoDemo: '',
    article: '',
    content: '',
    is_pinned: false,
    is_visible: true,
  });

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      async function fetchProject() {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setErrorMsg(`Failed to load project: ${error.message}`);
        } else if (data) {
          setFormData({
            slug: data.slug || '',
            title: data.title || '',
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            icon: data.icon || 'code',
            app_icon_url: data.app_icon_url || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            short_description: data.short_description || '',
            tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack.join(', ') : '',
            livePreview: data.links?.livePreview || '',
            github: data.links?.github || '',
            videoDemo: data.links?.videoDemo || '',
            article: data.links?.article || '',
            content: data.content || '',
            is_pinned: Boolean(data.is_pinned),
            is_visible: data.is_visible !== false,
          });
        }
        setIsLoading(false);
      }
      fetchProject();
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData((prev) => {
      const autoSlug = titleVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      return {
        ...prev,
        title: titleVal,
        slug: isEditing ? prev.slug : autoSlug,
      };
    });
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingIcon(true);
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanSlug = formData.slug || 'project';
      const fileName = `icon-${cleanSlug}-${Date.now()}.${fileExt}`;
      const filePath = `icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, app_icon_url: publicUrlData.publicUrl }));
    } catch (err: any) {
      alert(`Failed to upload icon: ${err.message}`);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleRemoveIcon = () => {
    setFormData((prev) => ({ ...prev, app_icon_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const techStackArray = formData.tech_stack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const linksObj = {
        livePreview: formData.livePreview.trim() || null,
        github: formData.github.trim() || null,
        videoDemo: formData.videoDemo.trim() || null,
        article: formData.article.trim() || null,
      };

      const payload = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        date: formData.date || null,
        icon: formData.icon.trim() || 'code',
        app_icon_url: formData.app_icon_url.trim() || null,
        tags: tagsArray,
        short_description: formData.short_description.trim(),
        tech_stack: techStackArray,
        links: linksObj,
        content: formData.content,
        is_pinned: formData.is_pinned,
        is_visible: formData.is_visible,
      };

      if (isEditing && id) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([payload]);

        if (error) throw error;
      }

      await revalidateProjectsCache();
      router.push('/admin/projects');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save project. Ensure slug is unique.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AdminProjectFormSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-md text-label-md mb-4 transition-colors"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_back</span>
          Back to CMS Dashboard
        </Link>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">
          {isEditing ? 'Edit Project Showcase' : 'Create New Showcase'}
        </h1>
      </div>

      <div className="bg-surface-container rounded-[24px] p-8 border border-outline-variant/30">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-body-md font-medium border border-error/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                Project Title *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. AI Portfolio Assistant"
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                URL Slug *
              </label>
              <input
                type="text"
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. ai-portfolio-assistant"
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                Publication Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                App Icon (Image Upload - Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="bg-surface-container border border-outline-variant hover:border-outline rounded-xl px-4 py-2.5 text-xs font-mono text-on-surface cursor-pointer transition-colors inline-flex items-center gap-2">
                  <span className="material-symbols-rounded text-[18px]">
                    {isUploadingIcon ? 'progress_activity' : 'upload_file'}
                  </span>
                  <span>{isUploadingIcon ? 'Uploading...' : 'Choose Icon'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    disabled={isUploadingIcon}
                    className="hidden"
                  />
                </label>

                {formData.app_icon_url ? (
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-xl border border-outline-variant overflow-hidden bg-surface-container shrink-0">
                      <img
                        src={formData.app_icon_url}
                        alt="Uploaded app icon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      className="text-error hover:underline font-mono text-xs cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <span className="text-on-surface-variant text-xs font-sans">
                    No custom icon (uses fallback)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                Fallback Material Symbol Icon
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g. code, terminal, smart_toy"
                  className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                />
                <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-primary shrink-0 border border-outline-variant">
                  <span className="material-symbols-rounded text-2xl">
                    {formData.icon || 'code'}
                  </span>
                </div>
              </div>
            </div>

            {/* Visibility & Pin Project Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-outline-variant">
                <input
                  type="checkbox"
                  id="is_visible"
                  name="is_visible"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_visible: e.target.checked }))}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <label htmlFor="is_visible" className="cursor-pointer select-none">
                  <span className="block font-mono text-xs font-semibold text-on-surface">
                    Publicly Visible
                  </span>
                  <span className="block text-[11px] text-on-surface-variant font-sans">
                    Show this project on your portfolio and public catalog. Uncheck to hide.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-outline-variant">
                <input
                  type="checkbox"
                  id="is_pinned"
                  name="is_pinned"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_pinned: e.target.checked }))}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <label htmlFor="is_pinned" className="cursor-pointer select-none">
                  <span className="block font-mono text-xs font-semibold text-on-surface">
                    Pin Project (Featured Highlight)
                  </span>
                  <span className="block text-[11px] text-on-surface-variant font-sans">
                    Display this project on Home highlights and prioritize at the top of the list.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
              Short Description (Summary Card) *
            </label>
            <textarea
              required
              rows={2}
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              placeholder="Brief summary explaining what problem this project solves..."
              className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                Category Tags (Comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="AI & Agents, Data Engineering, Web Apps"
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
              />
              <span className="text-[11px] text-on-surface-variant font-sans mt-1 block">
                Tags for category filtering on the public /projects catalog.
              </span>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                Technology Stack (Comma separated)
              </label>
              <input
                type="text"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="React 19, TypeScript, Supabase, TailwindCSS"
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
              />
              <span className="text-[11px] text-on-surface-variant font-sans mt-1 block">
                Libraries and technologies displayed on the project card.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/30">
            <h2 className="font-title-md text-title-md text-on-surface mb-4 font-semibold">
              External & Showcase Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Live Demo Preview URL
                </label>
                <input
                  type="url"
                  name="livePreview"
                  value={formData.livePreview}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-surface border border-outline-variant rounded-xl p-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full bg-surface border border-outline-variant rounded-xl p-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Video Demo URL
                </label>
                <input
                  type="url"
                  name="videoDemo"
                  value={formData.videoDemo}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-surface border border-outline-variant rounded-xl p-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Article / Case Study URL
                </label>
                <input
                  type="url"
                  name="article"
                  value={formData.article}
                  onChange={handleChange}
                  placeholder="https://medium.com/..."
                  className="w-full bg-surface border border-outline-variant rounded-xl p-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
              Detailed Markdown Content
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              rows={14}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <Link
              href="/admin/projects"
              className="border border-outline text-on-surface hover:bg-surface-container font-label-lg text-label-lg px-6 py-3 rounded-full transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-on-primary font-label-lg text-label-lg px-8 py-3 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-sm font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-rounded animate-spin text-[20px]">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-rounded text-[20px]">save</span>
                  {isEditing ? 'Save Changes' : 'Create Showcase'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
