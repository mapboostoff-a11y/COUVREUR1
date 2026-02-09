import React from 'react';
import { TestimonialsContentSchema } from '../../types/schema';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { InlineText } from '../admin/InlineText';
import { EditableImage } from '../admin/EditableImage';

type Content = z.infer<typeof TestimonialsContentSchema>;

interface TestimonialsProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content, isEditing, onUpdate }) => {
  const handleTestimonialUpdate = (index: number, field: string, value: string) => {
    if (!onUpdate) return;
    const newTestimonials = [...content.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onUpdate({ testimonials: newTestimonials });
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <InlineText
          tagName="h2"
          className="text-3xl font-bold tracking-tight"
          value={content.title}
          isEditing={isEditing}
          onUpdate={(val) => onUpdate?.({ title: val })}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.testimonials.map((item, idx) => (
          <div key={idx} className="bg-card p-8 rounded-2xl shadow-sm border border-border">
            <div className="flex gap-1 mb-4 text-yellow-500">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} fill="currentColor" size={16} />
              ))}
            </div>
            <div className="text-muted-foreground mb-6 italic">
              <InlineText
                tagName="p"
                value={`"${item.content}"`} // This might be tricky if user deletes quotes
                isEditing={isEditing}
                onUpdate={(val) => handleTestimonialUpdate(idx, 'content', val.replace(/^"|"$/g, ''))} // Strip quotes if they were included
              />
            </div>
            <div className="flex items-center gap-4">
              {item.avatar && (
                <EditableImage 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full bg-muted object-cover"
                  isEditing={isEditing}
                  onUpdate={(newSrc) => handleTestimonialUpdate(idx, 'avatar', newSrc)}
                />
              )}
              <div>
                <InlineText
                  tagName="div"
                  className="font-semibold text-foreground"
                  value={item.name}
                  isEditing={isEditing}
                  onUpdate={(val) => handleTestimonialUpdate(idx, 'name', val)}
                />
                {item.role && (
                   <InlineText
                    tagName="div"
                    className="text-sm text-muted-foreground"
                    value={item.role}
                    isEditing={isEditing}
                    onUpdate={(val) => handleTestimonialUpdate(idx, 'role', val)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
