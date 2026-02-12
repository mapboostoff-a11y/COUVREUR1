import { useConfigStore } from '../../store/use-config-store';
import { Palette, Type, MessageCircle, Globe, BarChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { EditableImage } from './EditableImage';

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Black', value: '#000000' },
];

const FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Playfair Display', value: 'Playfair Display' },
];

export const GlobalSettingsPanel = () => {
  const config = useConfigStore((state) => state.config);
  const updateTheme = useConfigStore((state) => state.updateTheme);
  const updateWhatsApp = useConfigStore((state) => state.updateWhatsApp);
  const updateMeta = useConfigStore((state) => state.updateMeta);

  const { colors, fonts } = config.theme;
  const meta = config.meta;
  const whatsapp = config.whatsapp || { enabled: false, number: '', position: 'bottom-right' };

  const renderColorInput = (label: string, colorKey: 'primary' | 'secondary') => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Palette size={16} />
        {label}
      </h4>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-7 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => updateTheme({ colors: { ...colors, [colorKey]: color.value } })}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                colors[colorKey] === color.value
                  ? "ring-2 ring-offset-2 ring-primary border-transparent"
                  : "hover:scale-110 border-transparent"
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-input cursor-pointer hover:scale-110 transition-transform">
             <input
              type="color"
              value={colors[colorKey]}
              onChange={(e) => updateTheme({ colors: { ...colors, [colorKey]: e.target.value } })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full h-full" style={{ backgroundColor: colors[colorKey] }} />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8 font-mono">HEX</span>
            <Input 
                value={colors[colorKey]}
                onChange={(e) => updateTheme({ colors: { ...colors, [colorKey]: e.target.value } })}
                className="h-8 font-mono"
                placeholder="#000000"
            />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {renderColorInput("Primary Color", "primary")}
      {renderColorInput("Secondary Color", "secondary")}

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Type size={16} />
          Heading Font
        </h4>
        <select
          value={fonts.heading}
          onChange={(e) => updateTheme({ fonts: { ...fonts, heading: e.target.value } })}
          className="w-full p-2 rounded-md border border-input bg-background text-foreground text-sm"
        >
          {FONTS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe size={16} />
            Site Identity (SEO)
        </h4>
        
        <div className="space-y-3">
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Site Title</label>
                <Input 
                    type="text" 
                    value={meta.title}
                    onChange={(e) => updateMeta({ title: e.target.value })}
                    className="h-8"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <Input 
                    type="text" 
                    value={meta.description}
                    onChange={(e) => updateMeta({ description: e.target.value })}
                    className="h-8"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Keywords (comma separated)</label>
                <Input 
                    type="text" 
                    value={meta.keywords || ''}
                    onChange={(e) => updateMeta({ keywords: e.target.value })}
                    placeholder="roofing, expert, city..."
                    className="h-8"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Author / Company Name</label>
                <Input 
                    type="text" 
                    value={meta.author || ''}
                    onChange={(e) => updateMeta({ author: e.target.value })}
                    className="h-8"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Robots</label>
                    <select 
                        value={meta.robots}
                        onChange={(e) => updateMeta({ robots: e.target.value })}
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="index, follow">Index, Follow</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Canonical URL (optional)</label>
                    <Input 
                        type="text" 
                        value={meta.canonicalUrl || ''}
                        onChange={(e) => updateMeta({ canonicalUrl: e.target.value })}
                        placeholder="https://example.com"
                        className="h-8"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Favicon <span className="text-[10px] text-muted-foreground/70">(32x32)</span>
                    </label>
                    <div className="w-16 h-16 relative border border-input rounded-md overflow-hidden bg-muted/20">
                         <EditableImage 
                            src={meta.favicon || "https://via.placeholder.com/32?text=ICO"}
                            alt="Favicon"
                            className="w-full h-full object-contain p-2"
                            isEditing={true}
                            onUpdate={(val) => updateMeta({ favicon: val })}
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        OG Image <span className="text-[10px] text-muted-foreground/70">(Social)</span>
                    </label>
                     <div className="w-full aspect-video relative border border-input rounded-md overflow-hidden bg-muted/20">
                         <EditableImage 
                            src={meta.ogImage || "https://via.placeholder.com/1200x630?text=OG"}
                            alt="OG Image"
                            className="w-full h-full object-cover"
                            isEditing={true}
                            onUpdate={(val) => updateMeta({ ogImage: val })}
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe size={16} />
            Structured Data (Local Business)
        </h4>
        <p className="text-[11px] text-muted-foreground">Helps Google understand your business type and location.</p>
        
        <div className="space-y-3">
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Business Name</label>
                <Input 
                    type="text" 
                    value={meta.businessName || ''}
                    onChange={(e) => updateMeta({ businessName: e.target.value })}
                    placeholder="E.g. TopToit Couvreur"
                    className="h-8"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Business Type</label>
                <select 
                    value={meta.businessType || 'LocalBusiness'}
                    onChange={(e) => updateMeta({ businessType: e.target.value })}
                    className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
                >
                    <option value="LocalBusiness">General Local Business</option>
                    <option value="RoofingContractor">Roofing Contractor</option>
                    <option value="HomeAndConstructionBusiness">Home & Construction</option>
                    <option value="ProfessionalService">Professional Service</option>
                    <option value="Organization">Organization</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Price Range</label>
                    <Input 
                        type="text" 
                        value={meta.priceRange || ''}
                        onChange={(e) => updateMeta({ priceRange: e.target.value })}
                        placeholder="E.g. $$ or 50€-200€"
                        className="h-8"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Rating (Value / Count)</label>
                    <div className="flex gap-2">
                        <Input 
                            type="number" 
                            step="0.1"
                            min="1"
                            max="5"
                            value={meta.ratingValue || ''}
                            onChange={(e) => updateMeta({ ratingValue: parseFloat(e.target.value) })}
                            placeholder="4.8"
                            className="h-8"
                        />
                        <Input 
                            type="number" 
                            value={meta.reviewCount || ''}
                            onChange={(e) => updateMeta({ reviewCount: parseInt(e.target.value) })}
                            placeholder="24"
                            className="h-8"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart size={16} />
            Tracking & Analytics
        </h4>
        
        <div className="space-y-3">
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Facebook Pixel ID</label>
                <Input 
                    type="text" 
                    value={meta.facebookPixelId || ''}
                    onChange={(e) => updateMeta({ facebookPixelId: e.target.value })}
                    placeholder="1234567890"
                    className="h-8"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Google Analytics ID (G- or UA-)</label>
                <Input 
                    type="text" 
                    value={meta.googleAnalyticsId || ''}
                    onChange={(e) => updateMeta({ googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                    className="h-8"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Google Tag Manager ID (GTM-)</label>
                <Input 
                    type="text" 
                    value={meta.googleTagManagerId || ''}
                    onChange={(e) => updateMeta({ googleTagManagerId: e.target.value })}
                    placeholder="GTM-XXXXXXX"
                    className="h-8"
                />
            </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageCircle size={16} />
            WhatsApp Button
        </h4>
        
        <div className="flex items-center gap-2 mb-4">
            <input 
                type="checkbox" 
                id="wa-enabled"
                checked={whatsapp.enabled}
                onChange={(e) => updateWhatsApp({ enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="wa-enabled" className="text-sm font-medium text-foreground cursor-pointer select-none">Enable WhatsApp Button</label>
        </div>

        {whatsapp.enabled && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pl-6 border-l-2 border-muted ml-2">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                    <Input 
                        type="text" 
                        value={whatsapp.number}
                        onChange={(e) => updateWhatsApp({ number: e.target.value })}
                        placeholder="+1 (234) 567-890"
                        className="h-8"
                    />
                </div>
                <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Default Message</label>
                        <Input 
                        type="text" 
                        value={whatsapp.message || ''}
                        onChange={(e) => updateWhatsApp({ message: e.target.value })}
                        placeholder="Hello! I have a question."
                        className="h-8"
                    />
                </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Position</label>
                        <select 
                        value={whatsapp.position}
                        onChange={(e) => updateWhatsApp({ position: e.target.value as any })}
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
                        >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                        </select>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
