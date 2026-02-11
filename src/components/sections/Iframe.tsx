import React from 'react';
import { IframeContentSchema } from '../../types/schema';
import { z } from 'zod';
import { InlineText } from '../admin/InlineText';
import { ExternalLink } from 'lucide-react';

type Content = z.infer<typeof IframeContentSchema>;

interface IframeProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Iframe: React.FC<IframeProps> = ({ content, isEditing, onUpdate }) => {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {content.title && (
        <div className="w-full text-center max-w-3xl">
          <InlineText
            tagName="h2"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
            value={content.title}
            isEditing={isEditing}
            onUpdate={(val) => onUpdate?.({ title: val })}
          />
        </div>
      )}

      <div 
        className="relative w-full overflow-hidden rounded-xl bg-white"
        style={{ 
          maxWidth: content.maxWidth || '1200px',
          width: content.width || '100%',
          height: content.height || '500px',
        }}
      >
        {content.url ? (
          <iframe
            className="w-full h-full"
            src={content.url}
            title={content.title || "Embedded content"}
            allowFullScreen={content.allowFullScreen}
            style={{ border: content.border ? '1px solid #e2e8f0' : '0' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground border-2 border-dashed border-border rounded-xl">
             <ExternalLink size={48} className="mb-4 opacity-50" />
             <p>No URL provided for Iframe</p>
          </div>
        )}

        {isEditing && (
            <div className="absolute top-4 right-4 bg-background/95 p-4 rounded-lg shadow-xl border border-border z-10 space-y-4 min-w-[250px] max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Iframe URL</label>
                  <input 
                      type="text" 
                      value={content.url}
                      onChange={(e) => onUpdate?.({ url: e.target.value })}
                      className="w-full px-3 py-1 text-sm border rounded bg-background focus:ring-2 focus:ring-primary outline-none"
                      placeholder="https://example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                      <label className="text-xs font-medium">Height</label>
                      <input 
                          type="text"
                          value={content.height}
                          onChange={(e) => onUpdate?.({ height: e.target.value })}
                          className="w-full px-3 py-1 text-sm border rounded bg-background"
                          placeholder="500px"
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-medium">Max Width</label>
                      <input 
                          type="text"
                          value={content.maxWidth}
                          onChange={(e) => onUpdate?.({ maxWidth: e.target.value })}
                          className="w-full px-3 py-1 text-sm border rounded bg-background"
                          placeholder="1200px"
                      />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm">Show Border</span>
                    <input 
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={content.border}
                        onChange={(e) => onUpdate?.({ border: e.target.checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm">Allow Fullscreen</span>
                    <input 
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={content.allowFullScreen}
                        onChange={(e) => onUpdate?.({ allowFullScreen: e.target.checked })}
                    />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Iframe;
