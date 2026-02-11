import React, { useState, useMemo } from 'react';
import { SECTION_TEMPLATES } from '../../constants/templates';
import { 
  Plus, LayoutTemplate, Type, MessageSquare, CreditCard, MousePointerClick, 
  X, Search, Layout, List, Phone, Menu, Play, Image, MapPin, Film, ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';

interface SectionPickerProps {
  onSelect: (template: any) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Sections', icon: Layout },
  { id: 'header', label: 'Header', icon: Menu },
  { id: 'hero', label: 'Hero', icon: LayoutTemplate },
  { id: 'features', label: 'Features', icon: List },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'cta', label: 'Call to Action', icon: MousePointerClick },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'footer', label: 'Footer', icon: Type },
  { id: 'video', label: 'Video', icon: Play },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'map', label: 'Map', icon: MapPin },
  { id: 'video-gallery', label: 'Video Gallery', icon: Film },
  { id: 'iframe', label: 'Iframe', icon: ExternalLink },
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'hero': return <LayoutTemplate size={24} />;
    case 'features': return <List size={24} />;
    case 'testimonials': return <MessageSquare size={24} />;
    case 'pricing': return <CreditCard size={24} />;
    case 'cta': return <MousePointerClick size={24} />;
    case 'footer': return <Type size={24} />;
    case 'header': return <Menu size={24} />;
    case 'contact': return <Phone size={24} />;
    case 'video': return <Play size={24} />;
    case 'gallery': return <Image size={24} />;
    case 'map': return <MapPin size={24} />;
    case 'video-gallery': return <Film size={24} />;
    case 'iframe': return <ExternalLink size={24} />;
    default: return <Plus size={24} />;
  }
};

export const SectionPicker: React.FC<SectionPickerProps> = ({ onSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return SECTION_TEMPLATES.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.type === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            template.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
        
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="text-primary" size={20} />
            Add New Section
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-64 border-r border-border bg-muted/10 p-4 overflow-y-auto hidden md:block">
            <div className="space-y-1">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    selectedCategory === category.id 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <category.icon size={16} />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            {/* Search Bar */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search sections..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              
              {/* Mobile Category Scroll */}
              <div className="flex md:hidden overflow-x-auto gap-2 mt-4 pb-2 scrollbar-hide">
                 {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                      selectedCategory === category.id 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, idx) => (
                  <div 
                    key={idx}
                    className="group relative flex flex-col border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer"
                    onClick={() => onSelect(template)}
                  >
                    {/* Preview Area (Placeholder for now) */}
                    <div className="h-40 bg-muted/50 flex flex-col items-center justify-center group-hover:bg-muted/30 transition-colors relative overflow-hidden gap-2">
                       <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="text-muted-foreground/50 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                         {getIconForType(template.type)}
                       </div>
                       
                       {/* Template Name Display */}
                       <div className="text-xs font-medium text-muted-foreground/70 group-hover:text-foreground transition-colors z-10 text-center px-2">
                          {template.name}
                       </div>
                       
                       {/* Hover Overlay Button */}
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[1px]">
                         <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                           Insert
                         </span>
                       </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-4 border-t border-border">
                      <h3 className="font-semibold text-foreground truncate" title={template.name}>{template.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize mt-1">{template.type} Section</p>
                    </div>
                  </div>
                ))}

                {filteredTemplates.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p>No sections found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
