import React, { useState, useEffect, useRef } from 'react';
import { useConfigStore } from '../../store/use-config-store';
import { useAiStore } from '../../store/use-ai-store';
import { 
  Bot, 
  Send, 
  Loader2, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Briefcase,
  User,
  Mail,
  Code,
  Sparkles,
  FileJson,
  Check,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import type { LandingPageConfig } from '../../types/schema';

// --- Helper Functions (Mock AI Logic) ---

const getColorsForIndustry = (industry: string) => {
  const term = industry.toLowerCase();
  if (term.includes('health') || term.includes('medical') || term.includes('spa')) {
      return { primary: '#2a9d8f', secondary: '#264653', background: '#f0fdfa', text: '#264653' };
  }
  if (term.includes('construction') || term.includes('roof') || term.includes('build')) {
      return { primary: '#e76f51', secondary: '#264653', background: '#fff7ed', text: '#1f2937' };
  }
  if (term.includes('law') || term.includes('finance') || term.includes('tech')) {
      return { primary: '#2563eb', secondary: '#1e3a8a', background: '#f8fafc', text: '#0f172a' };
  }
  if (term.includes('food') || term.includes('restaurant')) {
      return { primary: '#d00000', secondary: '#ffba08', background: '#fff8f0', text: '#370617' };
  }
  // Default
  return { primary: '#3b82f6', secondary: '#1e293b', background: '#ffffff', text: '#0f172a' };
};

const getImagesForIndustry = (industry: string) => {
  const term = industry.toLowerCase();
  if (term.includes('roof')) return {
      hero: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80",
      gallery: [
          "https://images.unsplash.com/photo-1593456073767-73d7675f6399?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1598415729864-75470d024647?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1599706788879-11267db9d36e?auto=format&fit=crop&q=80"
      ]
  };
  if (term.includes('food') || term.includes('restaurant')) return {
      hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
      gallery: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80"
      ]
  };
  // Default generic business
  return {
      hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
      gallery: [
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80"
      ]
  };
};

// --- Components ---

const WizardStep = ({ 
  current, 
  total, 
  title, 
  description, 
  children,
  onNext,
  onBack,
  canNext
}: { 
  current: number; 
  total: number; 
  title: string; 
  description: string; 
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  canNext: boolean;
}) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors", 
                i <= current - 1 ? "bg-primary" : "bg-muted"
              )} 
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-medium">Step {current} of {total}</span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1 -mx-1">
        {children}
      </div>

      <div className="pt-6 mt-4 border-t flex justify-between items-center bg-background">
        {onBack ? (
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ChevronLeft size={16} /> Back
          </Button>
        ) : (
          <div /> 
        )}
        <Button onClick={onNext} disabled={!canNext} className="gap-2 px-6">
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

const ChatMessage = ({ role, content }: { role: 'user' | 'assistant', content: string }) => {
  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2",
      role === 'user' ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
        role === 'assistant' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div className={cn(
        "max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm",
        role === 'assistant' 
          ? "bg-background border border-border rounded-tl-none" 
          : "bg-primary text-primary-foreground rounded-tr-none"
      )}>
        {content}
      </div>
    </div>
  );
};

const JsonEditor = () => {
    const { config, setConfig } = useConfigStore();
    const [json, setJson] = useState(JSON.stringify(config, null, 2));
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
  
    // Update local state when global config changes (unless user is editing)
    useEffect(() => {
        // Only update if we haven't modified it locally yet or if we just saved
        if (isSaved) {
            setJson(JSON.stringify(config, null, 2));
            setIsSaved(false);
        }
    }, [config, isSaved]);

    const handleSave = () => {
      try {
        const parsed = JSON.parse(json);
        // Basic validation
        if (!parsed.sections || !Array.isArray(parsed.sections)) {
          throw new Error("Invalid config: 'sections' array is missing.");
        }
        setConfig(parsed);
        setError(null);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (e: any) {
        setError(e.message);
      }
    };
  
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-4 p-1">
           <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2">
                    <FileJson size={18} className="text-primary" />
                    Advanced Editor
                </h3>
                <p className="text-xs text-muted-foreground">Directly edit the site configuration.</p>
           </div>
           <Tooltip content="Save and apply changes to the site">
                <Button onClick={handleSave} size="sm" className="gap-2">
                    {isSaved ? <Check size={14} /> : <Sparkles size={14} />}
                    {isSaved ? 'Applied' : 'Apply Changes'}
                </Button>
           </Tooltip>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <span className="font-bold">Error:</span> {error}
            </div>
        )}

        <textarea 
          className="flex-1 font-mono text-xs p-4 border rounded-xl resize-none focus:ring-2 focus:ring-primary/20 outline-none bg-muted/30 leading-relaxed"
          value={json}
          onChange={(e) => {
              setJson(e.target.value);
              setIsSaved(false);
          }}
          spellCheck={false}
        />
      </div>
    );
  };

export const AiBuilder: React.FC = () => {
  const { config, setConfig, updateSection, updateSectionSettings } = useConfigStore();
  const { 
    step, 
    setStep, 
    mode,
    setMode,
    formData, 
    updateFormData, 
    messages, 
    addMessage, 
    isTyping, 
    setTyping, 
    reset 
  } = useAiStore();

  const [wizardStep, setWizardStep] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleGenerate = async () => {
    setStep('processing');
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 2500));

    const colors = getColorsForIndustry(formData.industry);
    const images = getImagesForIndustry(formData.industry);
    
    const newConfig: LandingPageConfig = {
      meta: {
        title: `${formData.name} - ${formData.industry}`,
        description: formData.description || `Professional ${formData.industry} services.`,
        favicon: formData.logo || ''
      },
      theme: {
        colors: colors,
        fonts: { heading: 'Inter', body: 'Inter' }
      },
      whatsapp: {
        enabled: !!formData.phone,
        number: formData.phone.replace(/\D/g, ''),
        message: "Hello, I would like more information.",
        position: "bottom-right"
      },
      sections: [
        {
          id: 'header',
          type: 'header',
          content: {
            title: formData.name,
            logo: formData.logo || '',
            logoMode: formData.logo ? 'image' : 'text',
            sticky: true,
            links: [
              { text: 'Services', url: '#services', variant: 'link', external: false },
              { text: 'Contact', url: '#contact', variant: 'link', external: false }
            ],
            cta: { text: 'Call Us', url: `tel:${formData.phone}`, variant: 'primary', external: false }
          },
          settings: { visible: true, paddingBottom: 'md', paddingTop: 'md', backgroundColor: 'white', container: true, animation: 'none', border: false, shadow: 'sm' }
        },
        {
          id: 'hero',
          type: 'hero',
          content: {
            headline: `Expert ${formData.industry} Services`,
            subheadline: formData.description || "Quality services you can trust. Contact us today for a free quote.",
            alignment: 'left',
            cta: [{ text: "Get a Quote", url: "#contact", variant: "primary", external: false }],
            image: { src: images.hero, alt: formData.industry }
          },
          settings: { paddingTop: 'xl', paddingBottom: 'xl', visible: true, backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' }
        },
        {
          id: 'features',
          type: 'features',
          content: {
            title: "Why Choose Us?",
            columns: 3,
            features: [
              ...(formData.differentiation ? [{ title: "Unique Advantage", description: formData.differentiation, icon: "Star" }] : []),
              { title: "Professional Team", description: "Highly skilled and experienced.", icon: "Award" },
              { title: "Quality Service", description: "We guarantee satisfaction.", icon: "Check" },
              { title: "Affordable Prices", description: "Best value for your money.", icon: "DollarSign" }
            ].slice(0, 3)
          },
          settings: { backgroundColor: "gray", visible: true, paddingBottom: 'lg', paddingTop: 'lg', container: true, animation: 'slide-up', border: false, shadow: 'none' }
        },
        {
            id: 'gallery',
            type: 'gallery',
            content: {
                title: "Our Work",
                columns: 3,
                aspectRatio: "square",
                images: images.gallery.map((src, i) => ({ src, alt: `Project ${i+1}` }))
            },
            settings: { visible: true, paddingBottom: 'lg', paddingTop: 'lg', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' }
        },
        {
          id: 'contact',
          type: 'contact',
          content: {
            title: "Contact Us",
            subtitle: "Get in touch for a free consultation.",
            email: formData.email,
            phone: formData.phone,
            address: "123 Main St"
          },
          settings: { backgroundColor: "gray", visible: true, paddingBottom: 'lg', paddingTop: 'lg', container: true, animation: 'slide-up', border: false, shadow: 'none' }
        },
        {
          id: 'footer',
          type: 'footer',
          content: {
            copyright: `© ${new Date().getFullYear()} ${formData.name}. All rights reserved.`,
            socials: [
              { platform: 'facebook', url: '#', enabled: true },
              { platform: 'instagram', url: '#', enabled: true }
            ]
          },
          settings: { backgroundColor: "dark", visible: true, paddingBottom: 'md', paddingTop: 'md', container: true, animation: 'none', border: false, shadow: 'none' }
        }
      ]
    };

    setConfig(newConfig);
    setStep('chat');
    addMessage({ role: 'assistant', content: `I've built your ${formData.industry} site! What do you think? You can ask me to change colors, texts, or layout.` });
  };

  const processChatCommand = async (input: string) => {
    addMessage({ role: 'user', content: input });
    setInputValue('');
    setTyping(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();
    let reply = "I'm not sure how to do that yet. Try asking to change colors or text.";

    // --- MOCK AI LOGIC ---
    
    // 1. Change Colors
    if (lowerInput.includes('color') || lowerInput.includes('blue') || lowerInput.includes('red') || lowerInput.includes('green') || lowerInput.includes('dark')) {
        const newTheme = { ...config.theme };
        if (lowerInput.includes('blue')) newTheme.colors.primary = '#3b82f6';
        else if (lowerInput.includes('red')) newTheme.colors.primary = '#ef4444';
        else if (lowerInput.includes('green')) newTheme.colors.primary = '#22c55e';
        else if (lowerInput.includes('purple')) newTheme.colors.primary = '#a855f7';
        else if (lowerInput.includes('orange')) newTheme.colors.primary = '#f97316';
        else if (lowerInput.includes('dark')) newTheme.colors.primary = '#0f172a';
        
        setConfig({ ...config, theme: newTheme });
        reply = "I've updated the primary color for you.";
    }
    
    // 2. Change Headline
    else if (lowerInput.includes('headline') || lowerInput.includes('title')) {
        const heroSection = config.sections.find(s => s.type === 'hero');
        if (heroSection && heroSection.type === 'hero') {
            const newContent = { ...heroSection.content, headline: "Welcome to our Premium Service" };
            updateSection(heroSection.id, { content: newContent });
            reply = "I've updated the hero headline.";
        }
    }

    // 3. Make it modern
    else if (lowerInput.includes('modern')) {
        const newTheme = { ...config.theme };
        newTheme.fonts.heading = 'Inter';
        newTheme.colors.primary = '#000000';
        newTheme.colors.background = '#ffffff';
        setConfig({ ...config, theme: newTheme });
        reply = "I've applied a modern, minimalist black & white theme.";
    }

    // 4. Change Padding
    else if (lowerInput.includes('padding') || lowerInput.includes('space')) {
        config.sections.forEach(section => {
            updateSectionSettings(section.id, { paddingTop: 'xl', paddingBottom: 'xl' });
        });
        reply = "I've increased the spacing (padding) for all sections to make it look more airy.";
    }

    setTyping(false);
    addMessage({ role: 'assistant', content: reply });
  };

  // --- RENDER ---

  const renderContent = () => {
    if (mode === 'json') {
      return <JsonEditor />;
    }

    if (step === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Building your site...</h3>
            <p className="text-muted-foreground">Analyzing {formData.industry} trends and picking the perfect palette.</p>
          </div>
        </div>
      );
    }

    if (step === 'chat') {
      return (
        <div className="flex flex-col h-full bg-muted/10">
          {/* Chat Header */}
          <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold text-sm">AI Architect</span>
            </div>
            <Tooltip content="Reset conversation and start over">
                <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-foreground">
                    <RefreshCw size={14} />
                </Button>
            </Tooltip>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isTyping && (
              <div className="flex gap-3 mb-4 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-background border border-border p-3.5 rounded-2xl rounded-tl-none text-sm shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); if (inputValue.trim()) processChatCommand(inputValue); }}
              className="flex gap-2"
            >
              <input 
                className="flex-1 bg-muted/50 border-0 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all outline-none"
                placeholder="Ask me to change colors, text, or layout..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping} className="rounded-lg shrink-0">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      );
    }

    // --- WIZARD STEPS ---
    return (
      <div className="p-6 h-full overflow-hidden flex flex-col">
        {wizardStep === 1 && (
          <WizardStep 
            current={1} 
            total={3} 
            title="What's your industry?" 
            description="We'll tailor the design and images to your niche."
            canNext={!!formData.industry}
            onNext={() => setWizardStep(2)}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {['Construction', 'Health', 'Restaurant', 'Law', 'Tech', 'Services'].map((ind) => (
                  <button
                    key={ind}
                    onClick={() => updateFormData({ industry: ind })}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]",
                      formData.industry === ind 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span className="block font-medium text-sm">{ind}</span>
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  <Briefcase size={16} />
                </span>
                <input 
                  className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Or type your own niche..."
                  value={formData.industry}
                  onChange={(e) => updateFormData({ industry: e.target.value })}
                />
              </div>
            </div>
          </WizardStep>
        )}

        {wizardStep === 2 && (
          <WizardStep 
            current={2} 
            total={3} 
            title="Brand Identity" 
            description="Tell us about your business."
            canNext={!!formData.name}
            onNext={() => setWizardStep(3)}
            onBack={() => setWizardStep(1)}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Business Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    <User size={16} />
                  </span>
                  <input 
                    className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. TopToit"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Logo</label>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">
                      <ImageIcon size={16} />
                    </span>
                    <input 
                      className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="https://example.com/logo.png"
                      value={formData.logo}
                      onChange={(e) => updateFormData({ logo: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateFormData({ logo: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="text-xs"
                      >
                        Upload Image
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">or paste URL above</span>
                  </div>

                  {formData.logo && (
                    <div className="mt-2 p-2 border rounded-lg bg-muted/30 w-fit">
                      <img src={formData.logo} alt="Logo preview" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Short Description</label>
                <textarea 
                  className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[80px] resize-none"
                  placeholder="What do you offer? e.g. 'We provide expert roofing services...'"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">What makes you different?</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">
                        <Star size={16} />
                    </span>
                    <textarea 
                        className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[80px] resize-none"
                        placeholder="e.g. '24/7 Emergency Service', 'Best Price Guarantee', 'Eco-friendly materials'"
                        value={formData.differentiation}
                        onChange={(e) => updateFormData({ differentiation: e.target.value })}
                    />
                </div>
              </div>
            </div>
          </WizardStep>
        )}

        {wizardStep === 3 && (
          <WizardStep 
            current={3} 
            total={3} 
            title="Contact Info" 
            description="How should customers reach you?"
            canNext={true}
            onNext={handleGenerate}
            onBack={() => setWizardStep(2)}
          >
            <div className="space-y-4">
               <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    <Mail size={16} />
                  </span>
                  <input 
                    className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="contact@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Phone</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    <Bot size={16} /> 
                  </span>
                  <input 
                    className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </WizardStep>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background border-r shadow-xl">
      {/* Top Toggle Bar */}
      <div className="p-3 border-b flex items-center justify-between bg-background">
         <div className="flex bg-muted p-1 rounded-lg">
            <Tooltip content="Use the Visual Assistant to build your site step-by-step">
                <button
                    onClick={() => setMode('visual')}
                    className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                        mode === 'visual' 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                >
                    <Sparkles size={14} />
                    Assistant
                </button>
            </Tooltip>
            <Tooltip content="Edit the raw JSON configuration directly">
                <button
                    onClick={() => setMode('json')}
                    className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                        mode === 'json' 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                >
                    <Code size={14} />
                    Advanced
                </button>
            </Tooltip>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
    </div>
  );
};
