import React, { useState } from 'react';
import { CtaContentSchema } from '../../types/schema';
import { z } from 'zod';
import { InlineText } from '../admin/InlineText';
import { LinkEditor } from '../admin/LinkEditor';
import { cn } from '../../lib/utils';
import { Settings } from 'lucide-react';

type Content = z.infer<typeof CtaContentSchema>;

interface CtaProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Cta: React.FC<CtaProps> = ({ content, isEditing, onUpdate }) => {
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  const handleButtonUpdate = (index: number, value: string) => {
    if (!onUpdate) return;
    const newButtons = [...content.buttons];
    newButtons[index] = { ...newButtons[index], text: value };
    onUpdate({ buttons: newButtons });
  };

  const handleLinkUpdate = (index: number, updates: any) => {
    if (!onUpdate) return;
    const newButtons = [...content.buttons];
    newButtons[index] = { ...newButtons[index], ...updates };
    onUpdate({ buttons: newButtons });
  };

  return (
    <div className="text-center space-y-8">
      <InlineText
        tagName="h2"
        className="text-3xl md:text-4xl font-bold tracking-tight"
        value={content.title}
        isEditing={isEditing}
        onUpdate={(val) => onUpdate?.({ title: val })}
      />
      <InlineText
        tagName="p"
        className="text-xl text-muted-foreground max-w-2xl mx-auto"
        value={content.description}
        isEditing={isEditing}
        onUpdate={(val) => onUpdate?.({ description: val })}
      />
      <div className="flex flex-wrap gap-4 justify-center">
        {content.buttons.map((btn, idx) => (
          <div key={idx} className="relative group">
            <a
              href={btn.url}
              target={btn.external ? "_blank" : undefined}
              rel={btn.external ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                 // Prevent navigation when editing
                 if (isEditing) e.preventDefault();
              }}
              className={cn("px-8 py-4 rounded-lg font-bold transition-colors shadow-lg inline-block", {
                  "bg-background text-foreground hover:bg-accent": btn.variant === 'primary', // Default styling override for CTA section
                  "bg-primary text-primary-foreground hover:bg-primary/90": btn.variant === 'secondary',
                  "border-2 border-input hover:bg-accent": btn.variant === 'outline'
              })}
            >
              <InlineText
                tagName="span"
                value={btn.text}
                isEditing={isEditing}
                onUpdate={(val) => handleButtonUpdate(idx, val)}
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
                                link={btn} 
                                onUpdate={(updates) => handleLinkUpdate(idx, updates)} 
                            />
                        </div>
                    )}
                </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cta;
