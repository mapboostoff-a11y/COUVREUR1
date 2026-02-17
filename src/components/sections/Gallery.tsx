import React, { useState } from 'react';
import { GalleryContentSchema } from '../../types/schema';
import { z } from 'zod';
import { cn } from '../../lib/utils';
import { InlineText } from '../admin/InlineText';
import { EditableImage } from '../admin/EditableImage';
import { X, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

type Content = z.infer<typeof GalleryContentSchema>;

interface GalleryProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Gallery: React.FC<GalleryProps> = ({ content, isEditing, onUpdate }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const columns = content.columns || 3;
  
  const getGridClass = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4: return 'grid-cols-2 md:grid-cols-4';
      case 5: return 'grid-cols-2 md:grid-cols-5';
      case 6: return 'grid-cols-3 md:grid-cols-6';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case 'video': return 'aspect-video';
      case 'portrait': return 'aspect-[3/4]';
      case 'square': return 'aspect-square';
      default: return ''; // No fixed aspect ratio
    }
  };

  const handleAddImage = () => {
    if (!onUpdate) return;
    const newImage = {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "New Image",
      width: 800,
      height: 600
    };
    onUpdate({ images: [...content.images, newImage] });
  };

  const handleRemoveImage = (index: number) => {
    if (!onUpdate) return;
    const newImages = [...content.images];
    newImages.splice(index, 1);
    onUpdate({ images: newImages });
  };

  const handleImageUpdate = (index: number, newSrc: string) => {
     if (!onUpdate) return;
    const newImages = [...content.images];
    newImages[index] = { ...newImages[index], src: newSrc };
    onUpdate({ images: newImages });
  };

  const openLightbox = (index: number) => {
    if (!isEditing) {
        setLightboxIndex(index);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex + 1) % content.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex - 1 + content.images.length) % content.images.length);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {content.title && (
        <div className="text-center mb-8">
             <InlineText
                tagName="h2"
                className="text-3xl font-bold tracking-tight"
                value={content.title}
                isEditing={isEditing}
                onUpdate={(val) => onUpdate?.({ title: val })}
              />
        </div>
      )}

      {isEditing && (
          <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg border border-border mb-4">
              <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Columns:</label>
                  <select 
                    value={content.columns}
                    onChange={(e) => onUpdate?.({ columns: parseInt(e.target.value) as any })}
                    className="p-1 rounded border border-input text-sm"
                  >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
              </div>
              <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Aspect Ratio:</label>
                  <select 
                    value={content.aspectRatio}
                    onChange={(e) => onUpdate?.({ aspectRatio: e.target.value as any })}
                    className="p-1 rounded border border-input text-sm"
                  >
                      <option value="none">Original (No Crop)</option>
                      <option value="square">Square</option>
                      <option value="video">Video (16:9)</option>
                      <option value="portrait">Portrait (3:4)</option>
                  </select>
              </div>
              <Button onClick={handleAddImage} size="sm" variant="secondary" className="gap-2">
                  <Plus size={16} /> Add Image
              </Button>
          </div>
      )}

      <div className={cn("grid gap-4", getGridClass(columns))}>
        {content.images.map((image, idx) => (
          <div 
            key={idx} 
            className={cn(
                "relative group overflow-hidden rounded-lg bg-muted", 
                getAspectRatioClass(content.aspectRatio)
            )}
            onClick={() => openLightbox(idx)}
          >
             <EditableImage
                src={image.src}
                alt={image.alt}
                isEditing={isEditing}
                onUpdate={(src) => handleImageUpdate(idx, src)}
                className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer"
                imageClassName={content.aspectRatio === 'none' ? "object-contain" : "object-cover"}
             />
             
             {isEditing && (
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                    }}
                    className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Remove Image"
                 >
                     <Trash2 size={16} />
                 </button>
             )}

             {!isEditing && (
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
             )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setLightboxIndex(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={32} />
          </button>

          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
            onClick={prevImage}
          >
            <ChevronLeft size={48} />
          </button>

          <img 
            src={content.images[lightboxIndex].src} 
            alt={content.images[lightboxIndex].alt}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />

          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
            onClick={nextImage}
          >
            <ChevronRight size={48} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {lightboxIndex + 1} / {content.images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
