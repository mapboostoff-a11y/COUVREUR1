import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface InlineTextProps {
  value: string;
  onUpdate?: (value: string) => void;
  className?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'a';
  isEditing?: boolean;
  placeholder?: string;
}

export const InlineText: React.FC<InlineTextProps> = ({
  value,
  onUpdate,
  className,
  tagName: Tag = 'div',
  isEditing = false,
  placeholder,
}) => {
  const [text, setText] = useState(value);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = () => {
    if (contentRef.current) {
      const newText = contentRef.current.innerText;
      if (newText !== value && onUpdate) {
        onUpdate(newText);
      }
    }
  };

  if (!isEditing) {
    if (!value && placeholder) {
       // Optional: render nothing or placeholder if needed in view mode? 
       // Usually in view mode if value is empty we might not want to show anything or show empty.
       // But if it's for editing, we want to see it. 
       return null; 
    }
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={contentRef as any}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      className={cn(
        "outline-none transition-colors",
        "hover:bg-primary/10 focus:bg-primary/5 focus:ring-2 focus:ring-primary/20 rounded px-1 -mx-1 cursor-text",
        !text && placeholder && "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50",
        className
      )}
      data-placeholder={placeholder}
    >
      {text}
    </Tag>
  );
};
