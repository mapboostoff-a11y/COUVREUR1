import React from 'react';
import { FooterContentSchema } from '../../types/schema';
import { z } from 'zod';
import * as Icons from 'lucide-react';
import { InlineText } from '../admin/InlineText';

type Content = z.infer<typeof FooterContentSchema>;

interface FooterProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Footer: React.FC<FooterProps> = ({ content, isEditing, onUpdate }) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Icons.Facebook;
      case 'twitter': return Icons.Twitter;
      case 'instagram': return Icons.Instagram;
      case 'linkedin': return Icons.Linkedin;
      case 'github': return Icons.Github;
      case 'youtube': return Icons.Youtube;
      default: return Icons.Link;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <InlineText
            tagName="div"
            className="text-sm text-muted-foreground/80 font-medium"
            value={content.copyright}
            isEditing={isEditing}
            onUpdate={(val) => onUpdate?.({ copyright: val })}
        />
        
        {content.socials && (
          <div className="flex gap-3 items-center">
            {content.socials.filter(s => s.enabled !== false).map((social, idx) => {
              const Icon = getIcon(social.platform);
              return (
                <div key={idx} className="relative group">
                    <a 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all block"
                        onClick={(e) => isEditing && e.preventDefault()}
                    >
                        <Icon size={18} />
                    </a>
                    {isEditing && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex bg-popover p-2 rounded border shadow-lg z-50 flex-col gap-2 min-w-[150px]">
                            <input 
                                className="bg-background border rounded px-2 py-1 text-xs w-full" 
                                value={social.url}
                                onChange={(e) => {
                                    const newSocials = [...content.socials!];
                                    const realIdx = content.socials!.indexOf(social);
                                    newSocials[realIdx] = { ...social, url: e.target.value };
                                    onUpdate?.({ socials: newSocials });
                                }}
                                placeholder="URL"
                            />
                            <button 
                                className="flex items-center gap-1 text-xs text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                                onClick={() => {
                                    const newSocials = [...content.socials!];
                                    const realIdx = content.socials!.indexOf(social);
                                    newSocials[realIdx] = { ...social, enabled: false };
                                    onUpdate?.({ socials: newSocials });
                                }}
                            >
                                <Icons.Trash2 size={12} /> Remove
                            </button>
                        </div>
                    )}
                </div>
              );
            })}
            
            {/* Add Social Button (Only Visible in Edit Mode) */}
            {isEditing && (
                <div className="relative group ml-2">
                    <button className="p-2 rounded-full text-muted-foreground/50 hover:text-primary transition-colors">
                        <Icons.PlusCircle size={20} />
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex bg-popover p-2 rounded border shadow-lg z-50 flex-col gap-1 min-w-[120px]">
                        <div className="text-xs font-semibold mb-1 px-2">Add Social</div>
                        {['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'GitHub', 'YouTube'].map(platform => (
                            <button
                                key={platform}
                                className="text-xs text-left px-2 py-1 hover:bg-muted rounded transition-colors"
                                onClick={() => {
                                    const newSocials = content.socials ? [...content.socials] : [];
                                    // Check if exists and is disabled
                                    const existing = newSocials.find(s => s.platform.toLowerCase() === platform.toLowerCase());
                                    if (existing) {
                                        existing.enabled = true;
                                    } else {
                                        newSocials.push({
                                            platform: platform.toLowerCase() as any,
                                            url: '#',
                                            enabled: true
                                        });
                                    }
                                    onUpdate?.({ socials: newSocials });
                                }}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;
