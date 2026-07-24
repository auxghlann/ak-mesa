import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import MarkdownEditor from '../../components/admin/MarkdownEditor';

interface ProjectFormData {
  slug: string;
  title: string;
  date: string;
  icon: string;
  short_description: string;
  tech_stack: string; // Comma-separated input
  livePreview: string;
  github: string;
  videoDemo: string;
  article: string;
  content: string;
}

export default function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProjectFormData>({
    slug: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    icon: 'code',
    short_description: '',
    tech_stack: '',
    livePreview: '',
    github: '',
    videoDemo: '',
    article: '',
    content: '',
  });

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
            short_description: data.short_description || '',
            tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack.join(', ') : '',
            livePreview: data.links?.livePreview || '',
            github: data.links?.github || '',
            videoDemo: data.links?.videoDemo || '',
            article: data.links?.article || '',
            content: data.content || '',
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
      // Auto-generate slug from title if creating a new project and slug hasn't been manually edited heavily
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const techStackArray = formData.tech_stack
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
        short_description: formData.short_description.trim(),
        tech_stack: techStackArray,
        links: linksObj,
        content: formData.content,
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

      navigate('/admin/projects');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save project. Ensure slug is unique.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <h2 className="font-headline-md text-headline-md text-on-surface animate-pulse">
          Loading project data...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-lg text-label-lg mb-6 transition-colors"
      >
        <span className="material-symbols-rounded text-[20px]">arrow_back</span>
        Back to Project Dashboard
      </Link>

      <div className="bg-surface-container rounded-[24px] p-6 md:p-8 border border-outline-variant/30 shadow-md">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-outline-variant/30">
          <div className="w-12 h-12 bg-primary rounded-[16px] flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-rounded text-2xl">
              {isEditing ? 'edit_note' : 'post_add'}
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
              {isEditing ? 'Edit Project Showcase' : 'Create New Project Showcase'}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Fill in the details below to update your portfolio
            </p>
          </div>
        </div>

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
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. AI-Powered Workflow Automator"
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
                placeholder="e.g. ai-workflow-automator"
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                Release / Creation Date *
              </label>
              <input
                type="date"
                required
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
                Material Symbol Icon Name
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g. code, smart_toy, psychology"
                  className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                />
                <div className="w-12 h-12 bg-surface border border-outline-variant rounded-xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-rounded text-2xl">
                    {formData.icon || 'code'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
              Short Description *
            </label>
            <textarea
              required
              rows={2}
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              placeholder="Brief summary displayed on project cards..."
              className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="e.g. React 19, TypeScript, Supabase, LangChain"
              className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="border border-outline-variant/30 rounded-2xl p-4 bg-surface/50 space-y-4">
            <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
              Project Links (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Live Preview URL
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
              to="/admin/projects"
              className="border border-outline text-on-surface hover:bg-surface-container font-label-lg text-label-lg px-6 py-3 rounded-full transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-on-primary font-label-lg text-label-lg px-8 py-3 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-sm font-semibold disabled:opacity-50"
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
