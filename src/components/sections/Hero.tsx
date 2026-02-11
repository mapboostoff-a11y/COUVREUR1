import React, { useState } from 'react';
import { HeroContentSchema } from '../../types/schema';
import { z } from 'zod';
import { cn } from '../../lib/utils';
import { InlineText } from '../admin/InlineText';
import { EditableImage } from '../admin/EditableImage';
import { LinkEditor } from '../admin/LinkEditor';
import { X, Settings } from 'lucide-react';

type Content = z.infer<typeof HeroContentSchema>;

interface HeroProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Hero: React.FC<HeroProps> = ({ content, isEditing, onUpdate }) => {
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  const handleCtaUpdate = (index: number, value: string) => {
    if (!onUpdate || !content.cta) return;
    const newCta = [...content.cta];
    newCta[index] = { ...newCta[index], text: value };
    onUpdate({ cta: newCta });
  };

  const handleCtaLinkUpdate = (index: number, updates: any) => {
    if (!onUpdate || !content.cta) return;
    const newCta = [...content.cta];
    newCta[index] = { ...newCta[index], ...updates };
    onUpdate({ cta: newCta });
  };

  return (
    <div className={cn("flex flex-col gap-8", {
      "text-center items-center": content.alignment === 'center',
      "text-left items-start": content.alignment === 'left',
      "text-right items-end": content.alignment === 'right',
    })}>
      <div className="space-y-4 max-w-3xl w-full">
        {!content.logo && isEditing && (
            <div className={cn("mb-4", {
                "mx-auto": content.alignment === 'center',
                "ml-0": content.alignment === 'left',
                "mr-0": content.alignment === 'right',
            })}>
                <button 
                    onClick={() => onUpdate && onUpdate({ logo: "https://via.placeholder.com/150x50?text=LOGO" })}
                    className="text-xs text-muted-foreground hover:text-primary border border-dashed border-muted-foreground/50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 bg-muted/20"
                >
                    + Add Brand Logo
                </button>
            </div>
        )}
        {content.logo && (
           <div className={cn("mb-6 group relative inline-block", {
             "mx-auto": content.alignment === 'center',
             "ml-0": content.alignment === 'left',
             "mr-0": content.alignment === 'right',
           })}>
              <div className="h-16 relative inline-block">
                <EditableImage
                  src={content.logo}
                  alt="Hero Logo"
                  className="h-full w-auto object-contain"
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ logo: val })}
                />
                {isEditing && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onUpdate && onUpdate({ logo: undefined }); }}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                        title="Remove Logo"
                    >
                        <X size={12} />
                    </button>
                )}
              </div>
           </div>
        )}
        <InlineText
          tagName="h1"
          className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
          value={content.headline}
          isEditing={isEditing}
          onUpdate={(val) => onUpdate?.({ headline: val })}
        />
        <InlineText
          tagName="p"
          className="text-xl text-muted-foreground"
          value={content.subheadline}
          isEditing={isEditing}
          onUpdate={(val) => onUpdate?.({ subheadline: val })}
        />
      </div>

      {content.cta && content.cta.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          {content.cta.map((link, idx) => (
            <div key={idx} className="relative group">
                <a
                  href={link.url}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={(e) => isEditing && e.preventDefault()}
                  className={cn("px-6 py-3 rounded-lg font-medium transition-colors inline-block", {
                    "bg-primary text-primary-foreground hover:bg-primary/90": link.variant === 'primary',
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80": link.variant === 'secondary',
                    "border-2 border-input hover:border-foreground hover:bg-accent hover:text-accent-foreground": link.variant === 'outline',
                    "text-primary hover:underline": link.variant === 'link',
                  })}
                >
                  <InlineText
                    tagName="span"
                    value={link.text}
                    isEditing={isEditing}
                    onUpdate={(val) => handleCtaUpdate(idx, val)}
                  />
                </a>
                {isEditing && (
                    <>
                        <button
                            className="absolute -top-3 -right-3 p-1.5 bg-background border border-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary z-10 shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingLinkIndex(editingLinkIndex === idx ? null : idx);
                            }}
                        >
                            <Settings size={14} />
                        </button>
                        
                        {editingLinkIndex === idx && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-in fade-in zoom-in-95">
                                <LinkEditor 
                                    link={link} 
                                    onUpdate={(updates) => handleCtaLinkUpdate(idx, updates)} 
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
          ))}
        </div>
      )}

      {content.image && !content.videoUrl && (
        <div className="mt-8 rounded-xl overflow-hidden shadow-2xl mx-auto">
          <EditableImage 
            src={content.image.src} 
            alt={content.image.alt} 
            width={content.image.width} 
            height={content.image.height}
            className="max-w-full h-auto"
            isEditing={isEditing}
            onUpdate={(newSrc) => onUpdate?.({ image: { ...content.image!, src: newSrc } })}
          />
        </div>
      )}

      {/* Video Support */}
      {(content.videoUrl || (isEditing && content.image === undefined && content.videoUrl === undefined)) && (
         <div className="mt-8 w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl aspect-video bg-muted relative group">
            {content.videoUrl ? (
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={content.videoUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                    title="Hero Video"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                ></iframe>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    No Video URL
                </div>
            )}
            
            {isEditing && (
                 <div className={cn("absolute top-4 right-4 bg-background/90 backdrop-blur p-2 rounded shadow-lg border border-border z-10", content.videoUrl ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100")}>
                    <label className="text-xs font-semibold block mb-1">YouTube URL</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="text-xs p-1 border rounded w-48"
                            placeholder="https://youtube.com/..."
                            value={content.videoUrl || ''}
                            onChange={(e) => onUpdate?.({ videoUrl: e.target.value })}
                        />
                        {content.videoUrl && (
                             <button 
                                onClick={() => onUpdate?.({ videoUrl: undefined })}
                                className="text-destructive hover:bg-destructive/10 p-1 rounded"
                                title="Remove Video"
                             >
                                <X size={14} />
                             </button>
                        )}
                    </div>
                 </div>
            )}
         </div>
      )}
    </div>
  );
};

export default Hero;
