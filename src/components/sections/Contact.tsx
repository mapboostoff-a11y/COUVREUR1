import React from 'react';
import { ContactContentSchema } from '../../types/schema';
import { z } from 'zod';
import { InlineText } from '../admin/InlineText';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

type Content = z.infer<typeof ContactContentSchema>;

interface ContactProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Contact: React.FC<ContactProps> = ({ content, isEditing, onUpdate }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <InlineText
          tagName="h2"
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-4"
          value={content.title}
          isEditing={isEditing}
          onUpdate={(val) => onUpdate && onUpdate({ title: val })}
        />
        {content.subtitle && (
          <InlineText
            tagName="p"
            className="text-xl text-muted-foreground"
            value={content.subtitle}
            isEditing={isEditing}
            onUpdate={(val) => onUpdate && onUpdate({ subtitle: val })}
          />
        )}
      </div>

      <div className="w-full flex flex-wrap justify-center gap-8">
        {content.email && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border shadow-sm flex-1 min-w-[250px] max-w-[400px]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mail size={24} />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
              {isEditing ? (
                <InlineText
                  tagName="p"
                  className="text-foreground font-semibold break-all"
                  value={content.email}
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ email: val })}
                />
              ) : (
                <a 
                  href={`mailto:${content.email}`}
                  className="text-foreground font-semibold break-all hover:text-primary transition-colors"
                >
                  {content.email}
                </a>
              )}
            </div>
          </div>
        )}

        {content.phone && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border shadow-sm flex-1 min-w-[250px] max-w-[400px]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Phone size={24} />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-medium text-muted-foreground mb-1">Téléphone</p>
              {isEditing ? (
                <InlineText
                  tagName="p"
                  className="text-foreground font-semibold"
                  value={content.phone}
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ phone: val })}
                />
              ) : (
                <a 
                  href={`tel:${content.phone.replace(/\s/g, '')}`}
                  className="text-foreground font-semibold hover:text-primary transition-colors"
                >
                  {content.phone}
                </a>
              )}
            </div>
          </div>
        )}

        {content.address && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border shadow-sm flex-1 min-w-[250px] max-w-[400px]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin size={24} />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-medium text-muted-foreground mb-1">Adresse</p>
              <InlineText
                tagName="p"
                className="text-foreground font-semibold whitespace-pre-wrap"
                value={content.address}
                isEditing={isEditing}
                onUpdate={(val) => onUpdate && onUpdate({ address: val })}
              />
            </div>
          </div>
        )}

        {content.hours && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border shadow-sm flex-1 min-w-[250px] max-w-[400px]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Clock size={24} />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-medium text-muted-foreground mb-1">Horaires</p>
              <InlineText
                tagName="p"
                className="text-foreground font-semibold whitespace-pre-wrap"
                value={content.hours}
                isEditing={isEditing}
                onUpdate={(val) => onUpdate && onUpdate({ hours: val })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
