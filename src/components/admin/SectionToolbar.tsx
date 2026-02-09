import React, { useState, useRef, useEffect } from 'react';
import { SectionSettingsSchema } from '../../types/schema';
import { z } from 'zod';
import { Settings, Eye, EyeOff, Palette, Maximize, Box, ChevronDown, Sparkles, GripHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Settings = z.infer<typeof SectionSettingsSchema>;

interface SectionToolbarProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
}

export const SectionToolbar: React.FC<SectionToolbarProps> = ({ settings, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });

  // Handle Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: initialPosRef.current.x + dx,
        y: initialPosRef.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the grip handle or the main container background (not buttons)
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { ...position };
    e.preventDefault(); // Prevent text selection
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const bgColors = [
    { label: 'White', value: 'white', class: 'bg-background border-border' },
    { label: 'Gray', value: 'gray', class: 'bg-muted/30 border-border' },
    { label: 'Primary', value: 'primary', class: 'bg-primary border-primary' },
    { label: 'Dark', value: 'dark', class: 'bg-secondary border-secondary' },
  ];

  return (
    <div 
        className="absolute top-4 right-4 z-[100] flex items-center gap-2 cursor-grab active:cursor-grabbing" 
        ref={panelRef}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
    >
      {/* Quick Actions */}
      <div className="flex items-center bg-background border border-border rounded-full shadow-sm overflow-hidden p-1 select-none">
        <div className="flex items-center justify-center w-8 h-8 bg-muted/50 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing">
            <GripHorizontal size={18} />
        </div>
        
        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={() => onUpdate({ visible: !settings.visible })}
          className={cn(
            "p-2 hover:bg-muted rounded-full transition-colors",
            !settings.visible && "text-muted-foreground"
          )}
          title={settings.visible ? "Hide Section" : "Show Section"}
        >
          {settings.visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        
        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-2 hover:bg-muted rounded-full transition-colors flex items-center gap-2 text-sm font-medium",
            isOpen && "bg-muted text-foreground"
          )}
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Settings</span>
          <ChevronDown size={12} className={cn("transition-transform", isOpen && "rotate-180")} />
        </button>
      </div>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-background border border-border rounded-xl shadow-xl p-4 animate-in fade-in zoom-in-95 origin-top-right cursor-default" onMouseDown={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            {/* Background Color */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Background</Label>
              <div className="grid grid-cols-4 gap-2">
                {bgColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onUpdate({ backgroundColor: color.value as any })}
                    className={cn(
                      "h-8 rounded-md border transition-all",
                      color.class,
                      settings.backgroundColor === color.value ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-80"
                    )}
                    title={color.label}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Palette size={14} className="text-muted-foreground" />
                <Input 
                    type="text" 
                    placeholder="#FFFFFF or rgba(..)"
                    value={['white', 'gray', 'primary', 'dark'].includes(settings.backgroundColor) ? '' : settings.backgroundColor}
                    onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                    className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Layout */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Layout</Label>
              <div className="flex items-center justify-between p-2 rounded-md border border-border hover:bg-muted/20">
                <div className="flex items-center gap-2">
                    {settings.container ? <Box size={16} /> : <Maximize size={16} />}
                    <span className="text-sm">Container</span>
                </div>
                <input 
                    type="checkbox" 
                    checked={settings.container}
                    onChange={(e) => onUpdate({ container: e.target.checked })}
                    className="h-4 w-4"
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Animation */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={12} /> Animation
                </Label>
                <select
                    value={settings.animation || 'slide-up'}
                    onChange={(e) => onUpdate({ animation: e.target.value as any })}
                    className="w-full text-xs h-8 rounded border border-input bg-background px-2"
                >
                    <option value="none">None</option>
                    <option value="fade-in">Fade In</option>
                    <option value="slide-up">Slide Up</option>
                    <option value="slide-left">Slide Left</option>
                    <option value="slide-right">Slide Right</option>
                    <option value="zoom-in">Zoom In</option>
                </select>
            </div>

            <div className="h-px bg-border" />

            {/* Spacing */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Spacing (Padding)</Label>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Top</span>
                      <select 
                        value={['none', 'sm', 'md', 'lg', 'xl'].includes(settings.paddingTop) ? settings.paddingTop : 'custom'}
                        onChange={(e) => onUpdate({ paddingTop: e.target.value })}
                        className="w-full text-xs h-8 rounded border border-input bg-background px-2"
                      >
                          <option value="none">None</option>
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                          <option value="xl">Extra Large</option>
                          <option value="custom">Custom...</option>
                      </select>
                      {!['none', 'sm', 'md', 'lg', 'xl'].includes(settings.paddingTop) && (
                          <Input 
                            value={settings.paddingTop}
                            onChange={(e) => onUpdate({ paddingTop: e.target.value })}
                            className="h-7 text-xs mt-1"
                            placeholder="e.g. 100px"
                          />
                      )}
                  </div>
                  <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Bottom</span>
                      <select 
                        value={['none', 'sm', 'md', 'lg', 'xl'].includes(settings.paddingBottom) ? settings.paddingBottom : 'custom'}
                        onChange={(e) => onUpdate({ paddingBottom: e.target.value })}
                        className="w-full text-xs h-8 rounded border border-input bg-background px-2"
                      >
                          <option value="none">None</option>
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                          <option value="xl">Extra Large</option>
                          <option value="custom">Custom...</option>
                      </select>
                      {!['none', 'sm', 'md', 'lg', 'xl'].includes(settings.paddingBottom) && (
                          <Input 
                            value={settings.paddingBottom}
                            onChange={(e) => onUpdate({ paddingBottom: e.target.value })}
                            className="h-7 text-xs mt-1"
                            placeholder="e.g. 100px"
                          />
                      )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
