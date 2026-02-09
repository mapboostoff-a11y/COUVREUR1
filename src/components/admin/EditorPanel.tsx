import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useConfigStore } from '../../store/use-config-store';
import { AlertCircle, Palette, Code, Layout, Settings, Bot } from 'lucide-react';
import { SectionSchema } from '../../types/schema';
import { cn } from '../../lib/utils';
import { Slider } from '../ui/slider';
import { GlobalSettingsPanel } from './GlobalSettingsPanel';
import { AiBuilder } from './AiBuilder';

interface EditorPanelProps {
  sectionId: string | null;
}

const PADDING_LEVELS = ['none', 'sm', 'md', 'lg', 'xl'] as const;

const BG_COLOR_OPTIONS = [
  { label: 'White', value: 'white', class: 'bg-background border-border' },
  { label: 'Gray', value: 'gray', class: 'bg-muted border-border' },
  { label: 'Primary', value: 'primary', class: 'bg-primary border-primary' },
  { label: 'Dark', value: 'dark', class: 'bg-secondary border-secondary' },
];

export const EditorPanel: React.FC<EditorPanelProps> = ({ sectionId }) => {
  const config = useConfigStore((state) => state.config);
  const updateSection = useConfigStore((state) => state.updateSection);
  const updateSectionSettings = useConfigStore((state) => state.updateSectionSettings);
  
  const section = config.sections.find((s) => s.id === sectionId);
  const [activeTab, setActiveTab] = useState<'style' | 'json' | 'ai'>('style');
  const [globalTab, setGlobalTab] = useState<'settings' | 'ai'>('settings');
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (section) {
      setJsonContent(JSON.stringify(section, null, 2));
      setError(null);
    } else {
        setJsonContent('');
    }
  }, [sectionId, section, activeTab]);

  const handleJsonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonContent(value);

    try {
      const parsed = JSON.parse(value);
      const result = SectionSchema.safeParse(parsed);
      
      if (result.success) {
        setError(null);
        if (sectionId && result.data.id === sectionId) {
             updateSection(sectionId, result.data);
        }
      } else {
        setError(result.error.issues[0].message);
      }
    } catch (err) {
      setError("Invalid JSON syntax");
    }
  };

  if (!sectionId || !section) {
    return (
      <div className="flex flex-col h-full bg-background border-l border-border">
        <div className="flex border-b border-border">
             <button
              onClick={() => setGlobalTab('settings')}
              className={cn(
                "flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
                globalTab === 'settings' 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Settings size={16} />
              Global Settings
            </button>
            <button
              onClick={() => setGlobalTab('ai')}
              className={cn(
                "flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
                globalTab === 'ai' 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Bot size={16} />
              AI Mode
            </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {globalTab === 'settings' ? <GlobalSettingsPanel /> : <AiBuilder />}
        </div>
      </div>
    );
  }

  const paddingTopIndex = PADDING_LEVELS.indexOf(section.settings.paddingTop as any);
  const paddingBottomIndex = PADDING_LEVELS.indexOf(section.settings.paddingBottom as any);

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('style')}
          className={cn(
            "flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
            activeTab === 'style' 
              ? "border-primary text-primary bg-primary/5" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Palette size={16} />
          Style
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={cn(
            "flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
            activeTab === 'json' 
              ? "border-primary text-primary bg-primary/5" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Code size={16} />
          Advanced
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={cn(
            "flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
            activeTab === 'ai' 
              ? "border-primary text-primary bg-primary/5" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Bot size={16} />
          AI Mode
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'style' ? (
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layout size={16} />
                Spacing
              </h4>
              <div className="space-y-6">
                <Slider 
                  label={`Top Padding: ${section.settings.paddingTop}`}
                  min={0}
                  max={PADDING_LEVELS.length - 1}
                  step={1}
                  value={paddingTopIndex !== -1 ? paddingTopIndex : 2}
                  onChange={(e) => {
                    const newPadding = PADDING_LEVELS[parseInt(e.target.value)];
                    updateSectionSettings(section.id, { paddingTop: newPadding as any });
                  }}
                />
                <Slider 
                  label={`Bottom Padding: ${section.settings.paddingBottom}`}
                  min={0}
                  max={PADDING_LEVELS.length - 1}
                  step={1}
                  value={paddingBottomIndex !== -1 ? paddingBottomIndex : 2}
                  onChange={(e) => {
                    const newPadding = PADDING_LEVELS[parseInt(e.target.value)];
                    updateSectionSettings(section.id, { paddingBottom: newPadding as any });
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Palette size={16} />
                Background
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {BG_COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateSectionSettings(section.id, { backgroundColor: color.value })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      color.class,
                      section.settings.backgroundColor === color.value 
                        ? "ring-2 ring-offset-2 ring-ring border-transparent" 
                        : "hover:scale-110"
                    )}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Settings size={16} />
                Effects & Borders
              </h4>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Shadow</label>
                    <div className="flex bg-muted/20 p-1 rounded-lg">
                        {['none', 'sm', 'md', 'lg'].map((shadow) => (
                            <button
                                key={shadow}
                                onClick={() => updateSectionSettings(section.id, { shadow: shadow as any })}
                                className={cn(
                                    "flex-1 text-xs py-1.5 rounded-md capitalize transition-colors",
                                    section.settings.shadow === shadow
                                        ? "bg-background shadow-sm text-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {shadow}
                            </button>
                        ))}
                    </div>
                 </div>

                 <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors border border-dashed border-border">
                  <input
                    type="checkbox"
                    checked={section.settings.border}
                    onChange={(e) => updateSectionSettings(section.id, { border: e.target.checked })}
                    className="rounded border-input text-primary shadow-sm focus:border-ring focus:ring focus:ring-primary/20 focus:ring-opacity-50 accent-primary"
                  />
                  <span className="text-sm text-foreground">Add Vertical Border</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Settings size={16} />
                General
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={section.settings.container}
                    onChange={(e) => updateSectionSettings(section.id, { container: e.target.checked })}
                    className="rounded border-input text-primary shadow-sm focus:border-ring focus:ring focus:ring-primary/20 focus:ring-opacity-50 accent-primary"
                  />
                  <span className="text-sm text-foreground">Constrain Width (Container)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={section.settings.visible}
                    onChange={(e) => updateSectionSettings(section.id, { visible: e.target.checked })}
                    className="rounded border-input text-primary shadow-sm focus:border-ring focus:ring focus:ring-primary/20 focus:ring-opacity-50 accent-primary"
                  />
                  <span className="text-sm text-foreground">Visible</span>
                </label>
              </div>
            </div>
          </div>
        ) : activeTab === 'json' ? (
          <div className="h-full relative">
            <textarea
              value={jsonContent}
              onChange={handleJsonChange}
              className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-background text-foreground"
              spellCheck={false}
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-destructive/10 text-destructive p-3 rounded-lg border border-destructive/20 text-sm flex items-start gap-2 shadow-lg">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <AiBuilder />
        )}
      </div>
    </div>
  );
};
