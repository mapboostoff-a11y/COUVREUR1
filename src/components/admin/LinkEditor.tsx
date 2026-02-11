import React from 'react';
import { LinkSchema } from '../../types/schema';
import { z } from 'zod';
import { ExternalLink, Check, Anchor } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useConfigStore } from '../../store/use-config-store';

type Link = z.infer<typeof LinkSchema>;

interface LinkEditorProps {
  link: Link;
  onUpdate: (updates: Partial<Link>) => void;
  onRemove?: () => void;
  className?: string;
}

export const LinkEditor: React.FC<LinkEditorProps> = ({ link, onUpdate, onRemove, className }) => {
  const sections = useConfigStore(state => state.config.sections);
  
  // Get potential anchors (sections with IDs)
  const anchors = sections
    .filter(s => s.settings.visible && s.type !== 'header' && s.type !== 'footer')
    .map(s => ({ 
      id: s.id, 
      label: (s as any).name || (s as any).content?.title || (s as any).content?.headline || s.type.charAt(0).toUpperCase() + s.type.slice(1) 
    }));

  const isInternal = link.url.startsWith('#');

  return (
    <div className={cn("bg-popover text-popover-foreground p-3 rounded-md border shadow-lg flex flex-col gap-3 min-w-[260px]", className)} onClick={(e) => e.stopPropagation()}>
      <div className="space-y-1">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lien / URL</label>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Anchor size={10} /> Aller à une section
            </label>
            <select 
              className="w-full bg-background border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={isInternal ? link.url : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val) onUpdate({ url: val, external: false });
              }}
            >
              <option value="">-- Choisir une section --</option>
              {anchors.map(anchor => (
                <option key={anchor.id} value={`#${anchor.id}`}>
                  {anchor.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase">Ou URL externe</label>
            <input 
              type="text" 
              value={isInternal ? '' : link.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              className="flex-1 bg-background border rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="https://..."
            />
          </div>
        </div>
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
