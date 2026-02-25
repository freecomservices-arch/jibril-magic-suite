import React, { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';

interface PhotoLightboxProps {
  photos: { src: string; alt?: string }[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photos, initialIndex = 0, open, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % photos.length);
      if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, photos.length, onClose]);

  if (!open || photos.length === 0) return null;

  const photo = photos[current];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-foreground/90 backdrop-blur-xl animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-sm font-medium text-background/80">
          {current + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={photo.src}
            download
            className="rounded-lg bg-background/10 p-2 text-background/70 hover:bg-background/20 hover:text-background transition-colors"
          >
            <Download className="h-4 w-4" />
          </a>
          <button
            onClick={onClose}
            className="rounded-lg bg-background/10 p-2 text-background/70 hover:bg-background/20 hover:text-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center px-16 relative">
        {photos.length > 1 && (
          <button
            onClick={() => setCurrent(c => (c - 1 + photos.length) % photos.length)}
            className="absolute left-4 rounded-full bg-background/10 p-3 text-background/70 hover:bg-background/20 hover:text-background transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <img
          src={photo.src}
          alt={photo.alt || `Photo ${current + 1}`}
          className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
        />

        {photos.length > 1 && (
          <button
            onClick={() => setCurrent(c => (c + 1) % photos.length)}
            className="absolute right-4 rounded-full bg-background/10 p-3 text-background/70 hover:bg-background/20 hover:text-background transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-2 px-5 py-4 overflow-x-auto">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={p.src} alt={p.alt || `Thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoLightbox;
