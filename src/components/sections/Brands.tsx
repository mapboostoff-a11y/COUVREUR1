import React from 'react';
import { BrandsContentSchema } from '../../types/schema';
import { z } from 'zod';
import { InlineText } from '../admin/InlineText';
import { EditableImage } from '../admin/EditableImage';
import { Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

type Content = z.infer<typeof BrandsContentSchema>;

interface BrandsProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Brands: React.FC<BrandsProps> = ({ content, isEditing, onUpdate }) => {
  const images = content.images || [];
  const speed = content.speed || 30;
  const direction = content.direction || 'left';
  const grayscale = content.grayscale !== false; // Default to true

  const handleAddImage = () => {
    if (!onUpdate) return;
    const newImage = {
      src: "https://via.placeholder.com/150x80?text=Logo",
      alt: "Partner Logo",
      width: 150,
      height: 80
    };
    onUpdate({ images: [...images, newImage] });
  };

  const handleRemoveImage = (index: number) => {
    if (!onUpdate) return;
    const newImages = [...images];
    newImages.splice(index, 1);
    onUpdate({ images: newImages });
  };

  const handleImageUpdate = (index: number, newSrc: string) => {
    if (!onUpdate) return;
    const newImages = [...images];
    newImages[index] = { ...newImages[index], src: newSrc };
    onUpdate({ images: newImages });
  };

  const toggleDirection = () => {
    if (!onUpdate) return;
    onUpdate({ direction: direction === 'left' ? 'right' : 'left' });
  };
  
  const toggleGrayscale = () => {
    if (!onUpdate) return;
    onUpdate({ grayscale: !grayscale });
  };

  return (
    <div className="w-full overflow-hidden py-8">
      {content.title && (
        <div className="text-center mb-8 px-4">
          <InlineText
            tagName="h3"
            className="text-lg font-medium text-muted-foreground uppercase tracking-widest"
            value={content.title}
            isEditing={isEditing}
            onUpdate={(val) => onUpdate?.({ title: val })}
            placeholder="TRUSTED BY..."
          />
        </div>
      )}

      {isEditing && (
        <div className="flex flex-wrap justify-center gap-4 mb-8 p-4 bg-muted/30 rounded-lg mx-auto max-w-2xl border border-dashed border-border">
          <button 
            onClick={handleAddImage}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Add Logo
          </button>
          
          <button 
            onClick={toggleDirection}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-md hover:bg-secondary/80 transition-colors"
          >
            {direction === 'left' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} 
            Direction: {direction}
          </button>

          <button 
            onClick={toggleGrayscale}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-md hover:bg-secondary/80 transition-colors"
          >
            {grayscale ? "Color" : "Grayscale"} Mode
          </button>
        </div>
      )}

      {/* If editing, show a static grid for easier management */}
      {isEditing ? (
        <div className="flex flex-wrap justify-center gap-8 py-8">
          {images.map((img, idx) => (
            <div key={`logo-edit-${idx}`} className="relative group">
              <EditableImage
                  src={img.src}
                  alt={img.alt}
                  className="h-16 w-auto flex items-center justify-center"
                  imageClassName={`w-auto h-full object-contain ${grayscale ? 'grayscale' : ''}`}
                  isEditing={isEditing}
                  onUpdate={(newSrc) => handleImageUpdate(idx, newSrc)}
                />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute -top-3 -right-3 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-100 shadow-md hover:bg-destructive/90 transition-colors z-20"
                title="Remove Logo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {images.length === 0 && (
             <div className="text-muted-foreground text-sm italic">No logos added yet. Click "Add Logo" above.</div>
          )}
        </div>
      ) : (
        <div className="relative overflow-hidden w-full group py-4">
          <div 
            className="flex w-fit animate-marquee"
            style={{ 
              animationDuration: `${speed}s`,
              animationDirection: direction === 'right' ? 'reverse' : 'normal',
            }}
          >
            {/* We render 2 sets of images. Each set contains the logos repeated twice to ensure it fills wide screens.
                Total = 4x logo list.
                Animation moves by 50% (width of one set). 
            */}
            {[0, 1].map((setIndex) => (
              <div key={`set-${setIndex}`} className="flex items-center gap-12 pr-12 shrink-0">
                {/* Repeat images twice in each set to ensure width > screen width */}
                {[...images, ...images].map((img, idx) => (
                  <div key={`logo-${setIndex}-${idx}`} className={`relative flex-shrink-0 ${grayscale ? 'grayscale hover:grayscale-0 transition-all duration-300' : ''}`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-12 md:h-16 w-auto object-contain max-w-[200px]"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Brands;
