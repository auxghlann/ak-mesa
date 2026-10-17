'use client';

import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ImageViewerModal, { type ImageViewerItem } from '../ui/ImageViewerModal';

export function extractProjectImages(
  content: string,
  galleryImages: string[] = [],
  projectTitle: string = 'Project'
): ImageViewerItem[] {
  const items: ImageViewerItem[] = [];
  const seen = new Set<string>();

  galleryImages.forEach((src, idx) => {
    const cleanSrc = src?.trim();
    if (cleanSrc && !seen.has(cleanSrc)) {
      seen.add(cleanSrc);
      items.push({ src: cleanSrc, alt: `${projectTitle} screenshot ${idx + 1}` });
    }
  });

  const mdRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match: RegExpExecArray | null;
  while ((match = mdRegex.exec(content)) !== null) {
    const alt = match[1]?.trim();
    const src = match[2]?.trim();
    if (src && !seen.has(src)) {
      seen.add(src);
      items.push({ src, alt: alt || undefined });
    }
  }

  const htmlRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlRegex.exec(content)) !== null) {
    const tag = match[0];
    const src = match[1]?.trim();
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1]?.trim() : undefined;
    if (src && !seen.has(src)) {
      seen.add(src);
      items.push({ src, alt: alt || undefined });
    }
  }

  return items;
}

interface ProjectContentViewerProps {
  title: string;
  images?: string[];
  content: string;
}

export default function ProjectContentViewer({
  title,
  images = [],
  content,
}: ProjectContentViewerProps) {
  const initialImages = useMemo(
    () => extractProjectImages(content, images, title),
    [content, images, title]
  );

  const [extraImages, setExtraImages] = useState<ImageViewerItem[]>([]);
  const allImages = useMemo(
    () => [...initialImages, ...extraImages],
    [initialImages, extraImages]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModalForSrc = (src: string, explicitAlt?: string) => {
    const foundIndex = allImages.findIndex((item) => item.src === src);
    if (foundIndex !== -1) {
      setCurrentIndex(foundIndex);
    } else {
      setExtraImages((prev) => [...prev, { src, alt: explicitAlt }]);
      setCurrentIndex(allImages.length);
    }
    setIsOpen(true);
  };

  return (
    <>
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {images.map((url: string, idx: number) => {
            const isLastOdd = idx === images.length - 1 && images.length % 2 !== 0;
            const caption = `${title} screenshot ${idx + 1}`;
            return (
              <button
                type="button"
                key={url}
                onClick={() => openModalForSrc(url, caption)}
                className={`group block relative cursor-zoom-in w-full text-left rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/30 hover:border-outline transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  isLastOdd ? 'md:col-span-2' : ''
                }`}
                title="Click to view image"
              >
                <img
                  src={url}
                  alt={caption}
                  className="w-full h-auto transition-transform duration-200 group-hover:scale-[1.01]"
                />
                <span className="absolute bottom-3 right-3 bg-black/70 text-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="material-symbols-rounded text-[18px]">zoom_in</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline-md prose-headings:text-on-surface prose-p:text-on-surface-variant prose-strong:text-on-surface prose-strong:font-semibold prose-blockquote:text-on-surface prose-blockquote:border-l-outline prose-blockquote:bg-surface-container-low prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-li:text-on-surface-variant prose-a:text-on-surface prose-a:underline hover:prose-a:opacity-80 prose-code:font-mono prose-code:text-on-surface prose-code:bg-surface-container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-surface-container prose-pre:border prose-pre:border-outline-variant">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ src, alt, className, ...props }: React.ComponentPropsWithoutRef<'img'>) => {
              if (!src || typeof src !== 'string') return null;
              return (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => openModalForSrc(src, alt)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModalForSrc(src, alt);
                    }
                  }}
                  className="group block relative cursor-zoom-in w-full text-left rounded-2xl overflow-hidden border border-outline-variant/40 hover:border-outline transition-colors focus:outline-none focus:ring-2 focus:ring-primary my-4"
                  title="Click to view image"
                >
                  <img
                    src={src}
                    alt={alt || ''}
                    className={`w-full h-auto transition-transform duration-200 group-hover:scale-[1.01] ${className || ''}`}
                    loading="lazy"
                    {...props}
                  />
                  <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="material-symbols-rounded text-[18px]">zoom_in</span>
                  </span>
                </span>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <ImageViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={allImages}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    </>
  );
}