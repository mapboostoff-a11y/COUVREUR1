import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Section } from '../../types/schema';
import { GripVertical, Eye, EyeOff, Trash2, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SortableSectionItemProps {
  section: Section;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDuplicate,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-card border rounded-lg group transition-all",
        isSelected ? "border-primary shadow-md ring-1 ring-ring" : "border-border hover:border-primary/50"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical size={20} />
      </div>

      <div className="flex-1 font-medium text-sm truncate cursor-pointer text-card-foreground" onClick={() => onSelect(section.id)}>
        <span className="capitalize">{section.name || section.type}</span>
        <span className="text-muted-foreground font-normal ml-2 text-xs">#{section.id.slice(0, 4)}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleVisibility(section.id)}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
          title={section.settings.visible ? "Hide" : "Show"}
        >
          {section.settings.visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          onClick={() => onDuplicate(section.id)}
          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
          title="Duplicate"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
