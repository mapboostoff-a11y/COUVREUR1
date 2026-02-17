import React from 'react';
import { VideoContentSchema } from '../../types/schema';
import { z } from 'zod';
import { InlineText } from '../admin/InlineText';
import { Play } from 'lucide-react';

type Content = z.infer<typeof VideoContentSchema>;

interface VideoProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Video: React.FC<VideoProps> = ({ content, isEditing, onUpdate }) => {
  const isPlaying = content.autoplay;

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(content.videoUrl || '');

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {(content.title) && (
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
        className="relative w-full overflow-hidden rounded-xl shadow-2xl bg-black"
        style={{ 
          maxWidth: content.maxWidth || '800px',
          aspectRatio: '16/9'
        }}
      >
        {videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&controls=${content.controls ? 1 : 0}`}
            title={content.title || "Video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 0 }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
             <Play size={48} className="mb-4 opacity-50" />
             <p>Invalid Video URL</p>
          </div>
        )}

        {isEditing && (
            <div className="absolute top-4 right-4 bg-background/90 p-4 rounded-lg shadow-lg border border-border z-10 space-y-3">
                <label className="block text-sm font-medium">Video URL</label>
                <input 
                    type="text" 
                    value={content.videoUrl}
                    onChange={(e) => onUpdate?.({ videoUrl: e.target.value })}
                    className="w-full px-3 py-1 text-sm border rounded bg-background"
                    placeholder="https://youtube.com/..."
                />
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox"
                        checked={content.autoplay}
                        onChange={(e) => onUpdate?.({ autoplay: e.target.checked })}
                    />
                    <span className="text-sm">Autoplay</span>
                </div>
                 <div className="flex items-center gap-2">
                    <input 
                        type="checkbox"
                        checked={content.controls}
                        onChange={(e) => onUpdate?.({ controls: e.target.checked })}
                    />
                    <span className="text-sm">Show Controls</span>
                </div>
                 <div className="space-y-1">
                    <label className="text-xs">Max Width</label>
                    <input 
                        type="text"
                        value={content.maxWidth}
                        onChange={(e) => onUpdate?.({ maxWidth: e.target.value })}
                         className="w-full px-3 py-1 text-sm border rounded bg-background"
                    />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Video;
