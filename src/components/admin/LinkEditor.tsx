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
    .map(s => {
      const content = (s as any).content || {};
      const label = (s as any).name || content.title || content.headline || (s.type.charAt(0).toUpperCase() + s.type.slice(1));
      // Truncate label if too long
      const displayLabel = label.length > 30 ? label.substring(0, 27) + '...' : label;
      return { id: s.id, label: displayLabel, type: s.type };
    });

  const isInternal = link.url.startsWith('#');

  return (
    <div className={cn("bg-popover text-popover-foreground p-3 rounded-md border shadow-lg flex flex-col gap-3 min-w-[260px]", className)} onClick={(e) => e.stopPropagation()}>
      <div className="space-y-1">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lien / URL</label>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5 p-2 bg-muted/30 rounded-lg border border-border/50">
            <label className="text-[10px] font-bold text-primary uppercase flex items-center gap-1.5 mb-1">
              <Anchor size={12} /> Aller à une section
            </label>
            <select 
              className="w-full bg-background border border-border rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              value={isInternal ? link.url : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  onUpdate({ url: val, external: false });
                }
              }}
            >
              <option value="">-- Sélectionner une section --</option>
              {anchors.map(anchor => (
                <option key={anchor.id} value={`#${anchor.id}`}>
                  {anchor.type.charAt(0).toUpperCase() + anchor.type.slice(1)} : {anchor.label}
                </option>
              ))}
            </select>
            <p className="text-[9px] text-muted-foreground italic">Permet de faire défiler la page jusqu'à la section choisie.</p>
          </div>

          <div className="relative py-1">
             <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"></span></div>
             <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-popover px-2 text-muted-foreground font-medium">OU</span></div>
          </div>

          <div className="space-y-1.5 p-2 bg-muted/10 rounded-lg border border-border/30">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
              <ExternalLink size={12} /> URL Externe / Page
            </label>
            <input 
              type="text" 
              value={isInternal ? '' : link.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              className="flex-1 bg-background border border-border rounded-md px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Ex: https://google.fr ou /contact"
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
