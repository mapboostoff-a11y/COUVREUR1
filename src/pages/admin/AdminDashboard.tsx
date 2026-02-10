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
import { Plus, Monitor, Smartphone, Tablet, HelpCircle, RotateCw, Settings, PanelLeft, PanelRight, Bot, Download, Save, Code, Loader2, CheckCircle, AlertCircle, Github } from 'lucide-react';
import { ThemeInjector } from '../../components/renderer/ThemeInjector';
import { WhatsAppButton } from '../../components/WhatsAppButton';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { getFileSha, updateFile } from '../../lib/github';
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

const JsonEditorDialog = ({ config, onUpdate }: { config: any, onUpdate: (newConfig: any) => void }) => {
  const [jsonContent, setJsonContent] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonContent(JSON.stringify(config, null, 2));
    }
  }, [isOpen, config]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      onUpdate(parsed);
      setError(null);
      setIsOpen(false);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 hover:bg-muted rounded-md transition-colors"
          title="Éditeur JSON"
        >
          <Code size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Éditeur JSON Avancé</DialogTitle>
          <DialogDescription>
            Modifiez directement la structure du site. Attention aux erreurs de syntaxe.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 py-4">
          <Textarea 
            value={jsonContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonContent(e.target.value)}
            className="font-mono text-sm h-full resize-none"
            spellCheck={false}
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button onClick={handleSave}>Appliquer les changements</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PublishDialog = ({ config }: { config: any }) => {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [saveToken, setSaveToken] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const copyToClipboard = () => {
    const content = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(content);
    alert("Configuration copiée ! Remplacez le contenu de src/data/config.json");
  };

  const handlePublish = async () => {
    if (!token) {
      setStatus('error');
      setErrorMessage("Token GitHub manquant");
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      if (saveToken) {
        localStorage.setItem('github_token', token);
      }

      const ghConfig = {
        owner: 'mapboostoff-a11y',
        repo: 'COUVREUR1',
        path: 'src/data/config.json',
        token: token
      };

      // 1. Get current SHA
      const sha = await getFileSha(ghConfig);

      // 2. Update file
      await updateFile(ghConfig, JSON.stringify(config, null, 2), sha, "Update config via Admin");

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage((error as Error).message);
    }
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
            Choisissez une méthode pour mettre à jour votre site en production.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Method 1: Automatic */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Github size={20} />
              <h3>Méthode Automatique (Recommandée)</h3>
            </div>
            
            {status === 'success' ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} />
                <div>
                  <p className="font-bold">Mise à jour réussie !</p>
                  <p className="text-sm">Le site sera à jour sur Vercel dans quelques minutes.</p>
                  <Button variant="link" className="p-0 h-auto text-green-800" onClick={() => setStatus('idle')}>
                    Faire une autre modification
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Publiez directement sur GitHub. Nécessite un Personal Access Token (Classic) avec les droits 'repo'.
                </p>
                <div className="space-y-2">
                  <Label>GitHub Token</Label>
                  <Input 
                    type="password" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)} 
                    placeholder="ghp_..."
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="saveToken" 
                      checked={saveToken} 
                      onChange={(e) => setSaveToken(e.target.checked)} 
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="saveToken" className="text-sm text-muted-foreground">Se souvenir du token</label>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="text-destructive text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errorMessage}
                  </div>
                )}

                <Button onClick={handlePublish} disabled={status === 'loading'} className="w-full">
                  {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publier sur Vercel
                </Button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou manuellement</span>
            </div>
          </div>

          {/* Method 2: Manual */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Téléchargement Manuel</h3>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2">
                  Copier
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
                  <Download size={14} />
                  Télécharger
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Téléchargez config.json, remplacez-le dans src/data/, et faites un git push.
            </p>
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
             <JsonEditorDialog config={config} onUpdate={(newConfig) => useConfigStore.getState().setConfig(newConfig)} />
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
