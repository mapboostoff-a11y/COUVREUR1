import React, { useState } from 'react';
import { HeaderContentSchema } from '../../types/schema';
import { z } from 'zod';
import { Menu, X, Settings, Image as ImageIcon, Type, List, Plus, Trash, GripVertical, Check } from 'lucide-react';
import { InlineText } from '../admin/InlineText';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useConfigStore } from '../../store/use-config-store';
import { EditableImage } from '../admin/EditableImage';
import { LinkEditor } from '../admin/LinkEditor';

type Content = z.infer<typeof HeaderContentSchema>;

interface HeaderProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Header: React.FC<HeaderProps> = ({ content, isEditing, onUpdate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const sections = useConfigStore(state => state.config.sections);
  
  const handleLinkUpdate = (index: number, updates: any) => {
    if (!onUpdate) return;
    const newLinks = [...content.links];
    newLinks[index] = { ...newLinks[index], ...updates };
    onUpdate({ links: newLinks });
  };

  const handleCtaUpdate = (updates: any) => {
    if (!onUpdate || !content.cta) return;
    onUpdate({ cta: { ...content.cta, ...updates } });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleSectionInMenu = (section: any) => {
    if (!onUpdate) return;
    const linkUrl = `#${section.id}`;
    const exists = content.links.some(link => link.url === linkUrl);

    if (exists) {
      // Remove
      onUpdate({ links: content.links.filter(link => link.url !== linkUrl) });
    } else {
      // Add
      onUpdate({ 
        links: [
          ...content.links, 
          { 
            text: section.name || section.type.charAt(0).toUpperCase() + section.type.slice(1), 
            url: linkUrl, 
            variant: 'link', 
            external: false 
          }
        ] 
      });
    }
  };

  return (
    <header className={cn(
      "w-full z-50 bg-background/80 backdrop-blur-md border-b border-border",
      content.sticky ? "sticky top-0" : "relative"
    )}>
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 font-bold text-xl text-foreground relative group flex items-center gap-3">
          {isEditing && (
             <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-20">
                <div className="flex bg-background border border-border rounded shadow-lg p-1 gap-1">
                <button 
                  onClick={() => onUpdate?.({ logoMode: 'text' })}
                  className={cn("p-1 rounded hover:bg-muted", content.logoMode === 'text' ? "text-primary bg-primary/10" : "text-muted-foreground")}
                  title="Text Only"
                >
                  <Type size={14} />
                </button>
                <button 
                  onClick={() => onUpdate?.({ logoMode: 'image' })}
                  className={cn("p-1 rounded hover:bg-muted", content.logoMode === 'image' ? "text-primary bg-primary/10" : "text-muted-foreground")}
                  title="Image Only"
                >
                  <ImageIcon size={14} />
                </button>
                <button 
                  onClick={() => onUpdate?.({ logoMode: 'both' })}
                  className={cn("p-1 rounded hover:bg-muted", content.logoMode === 'both' ? "text-primary bg-primary/10" : "text-muted-foreground")}
                  title="Both (Image + Text)"
                >
                  <div className="flex items-center gap-0.5">
                      <ImageIcon size={10} />
                      <Type size={10} />
                  </div>
                </button>
                </div>
             </div>
          )}

          {/* Image Logo */}
          {(content.logoMode === 'image' || content.logoMode === 'both') && (
            <div className="h-10 w-auto">
               <EditableImage
                  src={content.logo || "https://via.placeholder.com/150x50?text=LOGO"}
                  alt="Logo"
                  className="h-full w-auto"
                  imageClassName="object-contain"
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ logo: val })}
               />
            </div>
          )}
          
          {/* Text Logo */}
          {(content.logoMode === 'text' || content.logoMode === 'both') && (
            <InlineText
              tagName="span"
              value={content.title || content.logo || 'Logo'} // Fallback for backward compat
              isEditing={isEditing}
              onUpdate={(val) => onUpdate && onUpdate({ title: val })}
            />
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isEditing && (
             <div className="relative">
                <button
                   onClick={() => setIsManageMenuOpen(!isManageMenuOpen)}
                   className={cn(
                       "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                       isManageMenuOpen ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:text-foreground"
                   )}
                >
                   <List size={14} />
                   Manage Menu
                </button>

                {isManageMenuOpen && (
                    <div className="absolute top-full left-0 mt-4 w-72 bg-background border border-border rounded-xl shadow-2xl p-4 z-[500] animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-border">
                            <h4 className="font-semibold text-sm">Menu Items</h4>
                            <button onClick={() => setIsManageMenuOpen(false)}><X size={16} /></button>
                        </div>
                        
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Links</label>
                                {content.links.length === 0 && <p className="text-xs text-muted-foreground italic py-2">No links in menu</p>}
                                <div className="space-y-2">
                                    {content.links.map((link, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-muted/30 p-2 rounded border border-border/50 group">
                                            <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{link.text}</div>
                                                <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newLinks = [...content.links];
                                                    newLinks.splice(idx, 1);
                                                    onUpdate?.({ links: newLinks });
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1 pt-2 border-t border-border">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Add from Sections</label>
                                <div className="space-y-1">
                                    {sections.filter(s => s.type !== 'header' && s.type !== 'footer').map(section => {
                                        const isActive = content.links.some(l => l.url === `#${section.id}`);
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => toggleSectionInMenu(section)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-2 rounded text-sm transition-colors text-left",
                                                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                                                )}
                                            >
                                                <span className="truncate flex-1 pr-2">{(section as any).name || section.type}</span>
                                                {isActive && <Check size={14} />}
                                                {!isActive && <Plus size={14} className="opacity-0 group-hover:opacity-100" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
             </div>
          )}

          {content.links.map((link, idx) => (
            <div key={idx} className="relative group">
              <a 
                href={link.url}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer block"
                onClick={(e) => isEditing && e.preventDefault()}
              >
                <InlineText
                    tagName="span"
                    value={link.text}
                    isEditing={isEditing}
                    onUpdate={(val) => handleLinkUpdate(idx, { text: val })}
                />
              </a>
              
              {isEditing && (
                <button
                  className="absolute -top-3 -right-3 p-1 bg-background border border-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary z-10 shadow-sm"
                  onClick={(e) => {
                      e.stopPropagation();
                      setEditingLinkIndex(editingLinkIndex === idx ? null : idx);
                  }}
                >
                    <Settings size={12} />
                </button>
              )}

              {/* Link Settings Popover */}
              {isEditing && editingLinkIndex === idx && (
                <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in zoom-in-95">
                  <LinkEditor 
                    link={link} 
                    onUpdate={(updates) => handleLinkUpdate(idx, updates)}
                    onRemove={() => {
                      const newLinks = [...content.links];
                      newLinks.splice(idx, 1);
                      onUpdate?.({ links: newLinks });
                      setEditingLinkIndex(null);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          
          {content.cta && (
            <div className="relative group">
                <Button 
                    variant={content.cta.variant as any || "default"}
                    onClick={(e) => {
                        if (isEditing) e.preventDefault();
                        else if (content.cta?.url) window.location.href = content.cta.url;
                    }}
                >
                  <InlineText
                    tagName="span"
                    value={content.cta.text}
                    isEditing={isEditing}
                    onUpdate={(val) => handleCtaUpdate({ text: val })}
                  />
                </Button>
                {isEditing && (
                    <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-50">
                        <LinkEditor 
                            link={content.cta} 
                            onUpdate={handleCtaUpdate} 
                        />
                    </div>
                )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5 z-[100]">
          {content.links.map((link, idx) => (
             <a 
                key={idx}
                href={link.url}
                className="text-base font-medium text-foreground py-2 border-b border-border/50 last:border-0 block"
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                  } else {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {link.text}
              </a>
          ))}
          {content.cta && (
            <div className="pt-2">
              <Button 
                className="w-full" 
                variant={content.cta.variant as any || "default"}
                onClick={() => {
                  if (!isEditing && content.cta?.url) {
                    setIsMenuOpen(false);
                    window.location.href = content.cta.url;
                  }
                }}
              >
                <InlineText
                  tagName="span"
                  value={content.cta.text}
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ cta: { ...content.cta!, text: val } })}
                />
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
