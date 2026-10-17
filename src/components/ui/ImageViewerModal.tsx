'use client';

import React, { useEffect } from 'react';

export interface ImageViewerItem {
  src: string;
  alt?: string;
}

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ImageViewerItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onIndexChange,
}: ImageViewerModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && items.length > 1) {
        onIndexChange((currentIndex - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowRight' && items.length > 1) {
        onIndexChange((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, items.length, onClose, onIndexChange]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex + 1) % items.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-8 select-none"
    >
      {/* Top Bar Controls */}
      <div
        className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none"
      >
        {items.length > 1 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto bg-black/60 text-white/90 font-mono text-xs px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm"
          >
            {currentIndex + 1} / {items.length}
          </div>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Close image viewer"
        >
          <span className="material-symbols-rounded text-[22px]">close</span>
        </button>
      </div>

      {/* Previous Button */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer z-20 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Previous image"
        >
          <span className="material-symbols-rounded text-[26px]">chevron_left</span>
        </button>
      )}

      {/* Next Button */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer z-20 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Next image"
        >
          <span className="material-symbols-rounded text-[26px]">chevron_right</span>
        </button>
      )}

      {/* Main Image Display */}
      <div
        className="relative max-h-[85vh] max-w-[90vw] flex flex-col items-center justify-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentItem.src}
          alt={currentItem.alt || 'Project screenshot'}
          className="max-h-[78vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl cursor-default"
        />
        {currentItem.alt && (
          <p className="mt-3 text-xs md:text-sm font-mono text-white/90 bg-black/70 border border-white/10 px-4 py-1.5 rounded-full text-center max-w-2xl truncate">
            {currentItem.alt}
          </p>
        )}
      </div>
    </div>
  );
}

