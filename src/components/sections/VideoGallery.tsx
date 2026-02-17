import React, { useState } from 'react';
import { VideoGalleryContentSchema } from '../../types/schema';
import { z } from 'zod';
import { cn } from '../../lib/utils';
import { InlineText } from '../admin/InlineText';
import { Plus, Play, Trash2, Film } from 'lucide-react';

type Content = z.infer<typeof VideoGalleryContentSchema>;

interface VideoGalleryProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ content, isEditing, onUpdate }) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const columns = content.columns || 3;
  
  const getGridClass = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4: return 'grid-cols-2 md:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'video': default: return 'aspect-video';
    }
  };

  const handleAddVideo = () => {
    if (!onUpdate) return;
    const newVideo = {
      videoUrl: "",
      title: "New Video",
    };
    onUpdate({ videos: [...content.videos, newVideo] });
  };

  const handleRemoveVideo = (index: number) => {
    if (!onUpdate) return;
    const newVideos = [...content.videos];
    newVideos.splice(index, 1);
    onUpdate({ videos: newVideos });
  };

  const handleVideoUpdate = (index: number, updates: any) => {
     if (!onUpdate) return;
    const newVideos = [...content.videos];
    newVideos[index] = { ...newVideos[index], ...updates };
    onUpdate({ videos: newVideos });
  };

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-8 w-full">
      {content.title && (
        <div className="text-center mb-8">
             <InlineText
                tagName="h2"
                className="text-3xl font-bold tracking-tight"
                value={content.title}
                isEditing={isEditing}
                onUpdate={(val) => onUpdate?.({ title: val })}
              />
        </div>
      )}

      <div className={cn("grid gap-6", getGridClass(columns))}>
        {content.videos.map((video, index) => {
            const videoId = getYouTubeId(video.videoUrl || '');
            const thumbnailUrl = video.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);
            const isPlaying = playingIndex === index;

            return (
                <div key={index} className="group relative space-y-2">
                    <div className={cn("relative rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-md transition-all", getAspectRatioClass(content.aspectRatio))}>
                        {isPlaying ? (
                             <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                                title={video.title || "Video"}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        ) : (
                            <>
                                {thumbnailUrl ? (
                                    <img 
                                        src={thumbnailUrl} 
                                        alt={video.title || "Video thumbnail"} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                        <Film size={48} className="opacity-20" />
                                    </div>
                                )}
                                
                                {/* Overlay */}
                                <div 
                                    className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer"
                                    onClick={() => !isEditing && setPlayingIndex(index)}
                                >
                                    <div className="h-12 w-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                        <Play size={20} className="ml-1 fill-current" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Edit Controls */}
                        {isEditing && (
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveVideo(index); }}
                                    className="p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-sm hover:bg-destructive/90"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )}
                        
                        {/* URL Editor Overlay */}
                        {isEditing && (
                             <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur p-2 border-t border-border transform translate-y-full group-hover:translate-y-0 transition-transform z-20">
                                <input 
                                    type="text" 
                                    className="w-full text-xs p-1.5 rounded border bg-background"
                                    placeholder="YouTube URL..."
                                    value={video.videoUrl}
                                    onChange={(e) => handleVideoUpdate(index, { videoUrl: e.target.value })}
                                    onClick={(e) => e.stopPropagation()}
                                />
                             </div>
                        )}
                    </div>
                    
                    {/* Caption */}
                    <div className="px-1">
                        <InlineText
                            tagName="h3"
                            className="font-medium text-sm leading-tight"
                            value={video.title || "Video Title"}
                            isEditing={isEditing}
                            onUpdate={(val) => handleVideoUpdate(index, { title: val })}
                        />
                    </div>
                </div>
            );
        })}

        {isEditing && (
            <button
                onClick={handleAddVideo}
                className={cn(
                    "rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary min-h-[200px]",
                    getAspectRatioClass(content.aspectRatio)
                )}
            >
                <Plus size={32} />
                <span className="font-medium">Add Video</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;
