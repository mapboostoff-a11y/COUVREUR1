import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useConfigStore } from '../../store/use-config-store';
import { SortableSectionItem } from '../../components/admin/SortableSectionItem';
import { EditorPanel } from '../../components/admin/EditorPanel';
import { AiBuilder } from '../../components/admin/AiBuilder';
import { SectionRenderer } from '../../components/renderer/SectionRenderer';
import { generateUUID, cn } from '../../lib/utils';
import { SectionPicker } from '../../components/admin/SectionPicker';
import { WelcomeGuide } from '../../components/admin/WelcomeGuide';
import { ThemeToggle } from '../../components/theme-toggle';
import { PreviewFrame, useFrameDocument } from '../../components/admin/PreviewFrame';
import { Plus, Monitor, Smartphone, Tablet, HelpCircle, RotateCw, Settings, PanelLeft, PanelRight, Bot, Download, Save } from 'lucide-react';
import { ThemeInjector } from '../../components/renderer/ThemeInjector';
import { WhatsAppButton } from '../../components/WhatsAppButton';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const FrameThemeInjector = () => {
  const doc = useFrameDocument();
  return <ThemeInjector target={doc?.documentElement} />;
};

const PublishDialog = ({ config }: { config: any }) => {
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "default-config.ts.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const copyToClipboard = () => {
    const content = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(content);
    alert("Configuration copiée ! Collez-la dans src/data/default-config.ts");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Save size={16} />
          Publier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publier les changements</DialogTitle>
          <DialogDescription>
            Ce site fonctionne sans base de données pour garantir rapidité et sécurité.
            Pour rendre vos modifications visibles par tous, vous devez mettre à jour le code source.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-semibold">Procédure de mise à jour :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Téléchargez la configuration ci-dessous.</li>
              <li>Ouvrez le fichier <code className="bg-background px-1 rounded">src/data/default-config.ts</code></li>
              <li>Remplacez tout son contenu par le nouveau JSON.</li>
              <li>Poussez les changements sur GitHub (git push).</li>
            </ol>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={copyToClipboard} variant="outline" className="gap-2">
              Copier le JSON
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download size={16} />
              Télécharger le fichier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AdminDashboard = () => {
  const { config, reorderSections, addSection, removeSection, updateSectionSettings, updateSection, duplicateSection } = useConfigStore();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [rightPanelMode, setRightPanelMode] = useState<'settings' | 'ai'>('settings');

  useEffect(() => {
    const hasSeen = localStorage.getItem('has_seen_guide');
    if (!hasSeen) {
      setShowGuide(true);
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      reorderSections(active.id as string, over.id as string);
    }
  };

  const handleAddSection = (template: any) => {
    const newId = generateUUID();
    addSection({
      id: newId,
      ...template
    });
    setSelectedSectionId(newId);
    setRightPanelMode('settings');
    setShowRightPanel(true);
    setShowSectionPicker(false);
  };

  const handleToggleVisibility = (id: string) => {
    const section = config.sections.find(s => s.id === id);
    if (section) {
      updateSectionSettings(id, { visible: !section.settings.visible });
    }
  };

  const getPreviewWidthValue = () => {
    if (previewMode === 'mobile') {
      return orientation === 'portrait' ? '375px' : '667px';
    }
    if (previewMode === 'tablet') {
      return orientation === 'portrait' ? '768px' : '1024px';
    }
    return '100%';
  };

  return (
    <div className="flex h-full bg-background text-foreground">
      {/* Left Panel: Section List */}
      {showLeftPanel && (
        <div className="w-72 bg-muted/30 border-r border-border flex flex-col animate-in slide-in-from-left duration-200">
        <div className="p-4 border-b border-border flex justify-between items-center bg-card relative">
          <h2 className="font-semibold text-foreground">Sections</h2>
          <button 
            onClick={() => setShowSectionPicker(!showSectionPicker)}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            title="Add Section"
          >
            <Plus size={18} />
          </button>
          {showSectionPicker && (
            <SectionPicker onSelect={handleAddSection} onClose={() => setShowSectionPicker(false)} />
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={config.sections.map(s => s.id)} 
              strategy={verticalListSortingStrategy}
            >
              {config.sections.map((section) => (
                <SortableSectionItem 
                  key={section.id} 
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={(id) => {
                      setSelectedSectionId(id);
                      setRightPanelMode('settings');
                      setShowRightPanel(true);
                  }}
                  onToggleVisibility={handleToggleVisibility}
                  onDuplicate={duplicateSection}
                  onDelete={removeSection}
                />
              ))}
            </SortableContext>
          </DndContext>

          {config.sections.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-sm">
              No sections yet. Click + to add one.
            </div>
          )}
        </div>
      </div>
      )}

      {/* Middle Panel: Preview */}
      <div className="flex-1 bg-muted/50 flex flex-col min-w-0 transition-all duration-300">
        {/* Toolbar */}
        <div className="h-14 bg-card border-b border-border flex items-center justify-between gap-4 px-4 shadow-sm z-10 relative">
           
           {/* Left Controls */}
           <div className="flex items-center gap-2">
             <button
                onClick={() => setShowLeftPanel(!showLeftPanel)}
                className={cn("p-2 rounded hover:bg-muted transition-colors", !showLeftPanel && "text-muted-foreground")}
                title={showLeftPanel ? "Hide Sidebar" : "Show Sidebar"}
             >
               <PanelLeft size={20} />
             </button>

             <div className="h-6 w-px bg-border mx-1" />

             <div className="flex bg-muted p-1 rounded-lg">
               <button 
                 onClick={() => setPreviewMode('desktop')}
                 className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                 title="Desktop"
               >
                 <Monitor size={18} />
               </button>
               <button 
                 onClick={() => setPreviewMode('tablet')}
                 className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                 title="Tablet"
               >
                 <Tablet size={18} />
               </button>
               <button 
                 onClick={() => setPreviewMode('mobile')}
                 className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                 title="Mobile"
               >
                 <Smartphone size={18} />
               </button>
             </div>
             
             {previewMode !== 'desktop' && (
               <button
                 onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
                 className={`p-2 rounded transition-colors ${orientation === 'landscape' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                 title="Toggle Orientation"
               >
                 <RotateCw size={18} />
               </button>
             )}
           </div>
           
           <div className="text-xs text-muted-foreground hidden lg:block">Live Preview</div>
           
           {/* Right Controls */}
           <div className="flex items-center gap-2">
             <button
               onClick={() => {
                   setRightPanelMode('ai');
                   setShowRightPanel(true);
               }}
               className={cn(
                 "p-2 transition-all duration-200 rounded-md relative group",
                 "hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-105",
                 rightPanelMode === 'ai' && showRightPanel 
                   ? 'text-primary bg-primary/10 shadow-sm ring-1 ring-primary/20' 
                   : 'text-foreground/70'
               )}
               title="AI Builder"
             >
               <Bot size={20} />
               <span className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2" />
             </button>
             <div className="h-6 w-px bg-border mx-1" />
             <button
               onClick={() => {
                   setSelectedSectionId(null);
                   setRightPanelMode('settings');
                   setShowRightPanel(true);
               }}
               className={cn("p-2 transition-colors rounded hover:bg-muted", rightPanelMode === 'settings' && selectedSectionId === null && showRightPanel ? 'text-primary bg-primary/10' : 'text-muted-foreground')}
               title="Global Settings"
             >
               <Settings size={20} />
             </button>
             <button
               onClick={() => {
                 if (window.confirm('Are you sure you want to reset all changes?')) {
                   useConfigStore.getState().resetToDefault();
                 }
               }}
               className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
               title="Reset to Default"
             >
               <RotateCw size={20} />
             </button>
             <ThemeToggle />
             <PublishDialog config={config} />
             <button 
               onClick={() => setShowGuide(true)}
               className="p-2 text-muted-foreground hover:text-primary transition-colors"
               title="Help & Guide"
             >
               <HelpCircle size={20} />
             </button>

             <div className="h-6 w-px bg-border mx-1" />

             <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={cn("p-2 rounded hover:bg-muted transition-colors", !showRightPanel && "text-muted-foreground")}
                title={showRightPanel ? "Hide Editor" : "Show Editor"}
             >
               <PanelRight size={20} />
             </button>
           </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-muted/50">
          <PreviewFrame
            width={getPreviewWidthValue()}
            className={`shadow-2xl transition-all duration-300 origin-top min-h-[500px] ${previewMode === 'desktop' ? 'max-w-[1280px]' : ''}`}
           >
              <div className="min-h-full bg-background text-foreground">
                <FrameThemeInjector />
                {config.sections.map((section) => (
                   <div 
                     key={section.id} 
                    onClick={() => {
                        setSelectedSectionId(section.id);
                        setRightPanelMode('settings');
                        setShowRightPanel(true);
                    }}
                    className={`relative ${selectedSectionId === section.id ? 'ring-2 ring-primary ring-inset' : 'hover:ring-1 hover:ring-primary/50 ring-inset'}`}
                  >
                    <SectionRenderer 
                      section={section} 
                      isEditing={true}
                      onUpdate={(updates) => updateSection(section.id, updates)}
                    />
                  </div>
                ))}
                <WhatsAppButton />
             </div>
          </PreviewFrame>
        </div>
      </div>

      {/* Right Panel: Editor */}
      {showRightPanel && (
        <div className="w-96 animate-in slide-in-from-right duration-200 border-l border-border bg-background">
          {rightPanelMode === 'ai' ? (
              <AiBuilder />
          ) : (
              <EditorPanel sectionId={selectedSectionId} />
          )}
        </div>
      )}
      
      <WelcomeGuide 
        isOpen={showGuide} 
        onClose={() => { 
          setShowGuide(false); 
          localStorage.setItem('has_seen_guide', 'true'); 
        }} 
      />
    </div>
  );
};
