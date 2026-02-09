import React from 'react';
import { MapContentSchema } from '../../types/schema';
import { z } from 'zod';
import { InlineText } from '../admin/InlineText';

type Content = z.infer<typeof MapContentSchema>;

interface MapSectionProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ content, isEditing, onUpdate }) => {
  const encodedAddress = encodeURIComponent(content.address);
  const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=${content.zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {content.title && (
          <div className="container mx-auto px-4">
               <InlineText
                  tagName="h2"
                  className="text-3xl font-bold text-center"
                  value={content.title}
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate?.({ title: val })}
              />
          </div>
      )}
      
      <div className="relative w-full rounded-lg overflow-hidden shadow-sm border border-border bg-muted" style={{ height: content.height }}>
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          title="Map"
          className="w-full h-full"
        />
        
        {/* Interaction blocker for drag/drop when editing (optional but good for UX) */}
        {isEditing && (
            <div className="absolute inset-0 bg-transparent pointer-events-none" />
        )}

        {isEditing && (
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border z-10 w-80 pointer-events-auto">
             <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                 Map Settings
             </h4>
             <div className="space-y-4">
                 <div className="space-y-1.5">
                     <label className="text-xs font-medium text-muted-foreground block">Address / Location</label>
                     <input 
                        type="text" 
                        value={content.address}
                        onChange={(e) => onUpdate?.({ address: e.target.value })}
                        className="w-full text-sm p-2 border rounded-md bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="e.g. Eiffel Tower, Paris"
                     />
                 </div>
                 <div className="space-y-1.5">
                     <div className="flex justify-between">
                        <label className="text-xs font-medium text-muted-foreground block">Zoom Level</label>
                        <span className="text-xs text-muted-foreground">{content.zoom}</span>
                     </div>
                     <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={content.zoom}
                        onChange={(e) => onUpdate?.({ zoom: parseInt(e.target.value) })}
                        className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                     />
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-xs font-medium text-muted-foreground block">Height</label>
                     <select 
                        value={content.height}
                        onChange={(e) => onUpdate?.({ height: e.target.value })}
                        className="w-full text-sm p-2 border rounded-md bg-background focus:ring-1 focus:ring-primary outline-none"
                     >
                         <option value="300px">Small (300px)</option>
                         <option value="400px">Medium (400px)</option>
                         <option value="500px">Large (500px)</option>
                         <option value="600px">Extra Large (600px)</option>
                         <option value="80vh">Full Screen (80vh)</option>
                     </select>
                 </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSection;
