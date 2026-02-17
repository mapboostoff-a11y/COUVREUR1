import React from 'react';
import { TestimonialsContentSchema } from '../../types/schema';
import { z } from 'zod';
import { Star, Plus, Trash } from 'lucide-react';
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

  const handleAddTestimonial = () => {
    if (!onUpdate) return;
    const newTestimonial = {
      name: "Nouveau Client",
      role: "Client",
      content: "Votre avis ici...",
      rating: 5,
    };
    onUpdate({ testimonials: [...content.testimonials, newTestimonial] });
  };

  const handleDeleteTestimonial = (index: number) => {
    if (!onUpdate) return;
    const newTestimonials = content.testimonials.filter((_, i) => i !== index);
    onUpdate({ testimonials: newTestimonials });
  };

  const getGridClass = () => {
    const count = content.testimonials.length;
    if (count === 1) return "max-w-xl mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <div className="space-y-12">
      <div className="text-center relative group">
        <InlineText
          tagName="h2"
          className="text-3xl font-bold tracking-tight"
          value={content.title}
          isEditing={isEditing}
          onUpdate={(val) => onUpdate?.({ title: val })}
        />
        {isEditing && (
          <button
            onClick={handleAddTestimonial}
            className="absolute right-0 top-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors z-10"
            title="Ajouter un avis"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className={`grid gap-8 ${getGridClass()}`}>
        {content.testimonials.map((item, idx) => (
          <div key={idx} className="bg-card p-8 rounded-2xl shadow-sm border border-border relative group">
            {isEditing && (
              <button
                onClick={() => handleDeleteTestimonial(idx)}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive/90"
                title="Supprimer cet avis"
              >
                <Trash size={16} />
              </button>
            )}
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
