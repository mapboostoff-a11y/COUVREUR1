import React from 'react';
import { LinkSchema } from '../../types/schema';
import { z } from 'zod';
import { ExternalLink, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

type Link = z.infer<typeof LinkSchema>;

interface LinkEditorProps {
  link: Link;
  onUpdate: (updates: Partial<Link>) => void;
  onRemove?: () => void;
  className?: string;
}

export const LinkEditor: React.FC<LinkEditorProps> = ({ link, onUpdate, onRemove, className }) => {
  return (
    <div className={cn("bg-popover text-popover-foreground p-3 rounded-md border shadow-lg flex flex-col gap-3 min-w-[240px]", className)} onClick={(e) => e.stopPropagation()}>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">URL</label>
        <input 
          type="text" 
          value={link.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          className="flex-1 bg-background border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Style</label>
          <select 
            value={link.variant}
            onChange={(e) => onUpdate({ variant: e.target.value as any })}
            className="w-full bg-background border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="link">Link</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-border mt-1">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", link.external ? "bg-primary border-primary text-primary-foreground" : "bg-background border-input")}>
             {link.external && <Check size={10} />}
          </div>
          <input 
            type="checkbox" 
            checked={link.external || false}
            onChange={(e) => onUpdate({ external: e.target.checked })}
            className="hidden"
          />
          <span className="flex items-center gap-1">
             New Tab <ExternalLink size={12} className="text-muted-foreground" />
          </span>
        </label>
        
        {onRemove && (
            <button 
                onClick={onRemove}
                className="ml-auto text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition-colors"
            >
                Remove
            </button>
        )}
      </div>
    </div>
  );
};
