import React from 'react';
import { FeaturesContentSchema } from '../../types/schema';
import { z } from 'zod';
import * as Icons from 'lucide-react';
import { InlineText } from '../admin/InlineText';

type Content = z.infer<typeof FeaturesContentSchema>;

interface FeaturesProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Features: React.FC<FeaturesProps> = ({ content, isEditing, onUpdate }) => {
  const gridCols = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    if (!onUpdate) return;
    const newFeatures = [...content.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate({ features: newFeatures });
  };

  return (
    <div className="space-y-12 px-4 md:px-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <InlineText
          tagName="h2"
          className="text-3xl font-bold tracking-tight"
          value={content.title}
          isEditing={isEditing}
          onUpdate={(val) => onUpdate?.({ title: val })}
        />
        {content.subtitle && (
          <InlineText
            tagName="p"
            className="text-lg text-muted-foreground"
            value={content.subtitle}
            isEditing={isEditing}
            onUpdate={(val) => onUpdate?.({ subtitle: val })}
          />
        )}
      </div>

      <div className={`grid gap-8 ${gridCols[content.columns as 1|2|3|4]}`}>
        {content.features.map((feature, idx) => {
          // Dynamic Icon Rendering
          // @ts-ignore - Dynamic access to Lucide icons
          const IconComponent = Icons[feature.icon] || Icons.HelpCircle;

          return (
            <div key={idx} className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <IconComponent size={24} />
              </div>
              <InlineText
                tagName="h3"
                className="text-xl font-semibold mb-2 text-card-foreground"
                value={feature.title}
                isEditing={isEditing}
                onUpdate={(val) => handleFeatureUpdate(idx, 'title', val)}
              />
              <InlineText
                tagName="p"
                className="text-muted-foreground"
                value={feature.description}
                isEditing={isEditing}
                onUpdate={(val) => handleFeatureUpdate(idx, 'description', val)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
