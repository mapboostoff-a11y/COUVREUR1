import React, { useState } from 'react';
import { FooterContentSchema } from '../../types/schema';
import { z } from 'zod';
import * as Icons from 'lucide-react';
import { InlineText } from '../admin/InlineText';
import { Link } from 'react-router-dom';
import { LinkEditor } from '../admin/LinkEditor';
import { Settings } from 'lucide-react';

type Content = z.infer<typeof FooterContentSchema>;

interface FooterProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Footer: React.FC<FooterProps> = ({ content, isEditing, onUpdate }) => {
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Icons.Facebook;
      case 'twitter': return Icons.Twitter;
      case 'instagram': return Icons.Instagram;
      case 'linkedin': return Icons.Linkedin;
      case 'github': return Icons.Github;
      case 'youtube': return Icons.Youtube;
      default: return Icons.Link;
    }
  };

  const handleLegalLinkUpdate = (index: number, updates: any) => {
    if (!onUpdate || !content.legalLinks) return;
    const newLinks = [...content.legalLinks];
    newLinks[index] = { ...newLinks[index], ...updates };
    onUpdate({ legalLinks: newLinks });
  };

  const handleLegalTextUpdate = (index: number, value: string) => {
    if (!onUpdate || !content.legalLinks) return;
    const newLinks = [...content.legalLinks];
    newLinks[index] = { ...newLinks[index], text: value };
    onUpdate({ legalLinks: newLinks });
  };

  return (
    <footer className="w-full border-t bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        
        {/* Colonne 1 : Marque & Infos */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight">
            <InlineText
              tagName="span"
              value={content.copyright}
              isEditing={isEditing}
              onUpdate={(val) => onUpdate?.({ copyright: val })}
            />
          </h2>
          {content.legal && (
            <div className="text-sm text-muted-foreground/80 leading-relaxed flex flex-col gap-2">
              <InlineText
                tagName="p"
                className="font-medium"
                value={content.legal.publisher || ''}
                isEditing={isEditing}
                onUpdate={(val) => onUpdate?.({ legal: { ...content.legal, publisher: val } })}
                placeholder="Nom de l'entreprise"
              />
              <InlineText
                tagName="div"
                className="whitespace-pre-line"
                value={content.legal.publisherContact || ''}
                isEditing={isEditing}
                onUpdate={(val) => onUpdate?.({ legal: { ...content.legal, publisherContact: val } })}
                placeholder="Adresse, Téléphone, Email"
              />
            </div>
          )}
        </div>

        {/* Colonne 2 : Liens Légaux */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">Informations Légales</h3>
          <nav className="flex flex-col gap-2">
            {content.legalLinks && content.legalLinks.map((link, idx) => (
              <div key={idx} className="relative group">
                {link.variant === 'link' ? (
                  <Link 
                    to={link.url} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                    onClick={(e) => isEditing && e.preventDefault()}
                  >
                    <InlineText
                      tagName="span"
                      value={link.text}
                      isEditing={isEditing}
                      onUpdate={(val) => handleLegalTextUpdate(idx, val)}
                    />
                  </Link>
                ) : (
                  <a 
                    href={link.url} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={(e) => isEditing && e.preventDefault()}
                  >
                    <InlineText
                      tagName="span"
                      value={link.text}
                      isEditing={isEditing}
                      onUpdate={(val) => handleLegalTextUpdate(idx, val)}
                    />
                  </a>
                )}

                {isEditing && (
                  <>
                    <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        className="p-1 bg-background border border-border rounded-full hover:text-primary shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingLinkIndex(editingLinkIndex === idx ? null : idx);
                        }}
                      >
                        <Settings size={12} />
                      </button>
                      <button
                        className="p-1 bg-destructive/10 border border-destructive/20 text-destructive rounded-full hover:bg-destructive hover:text-destructive-foreground shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newLinks = [...(content.legalLinks || [])];
                          newLinks.splice(idx, 1);
                          onUpdate?.({ legalLinks: newLinks });
                        }}
                      >
                        <Icons.Trash2 size={12} />
                      </button>
                    </div>
                    
                    {editingLinkIndex === idx && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in zoom-in-95 w-64">
                        <LinkEditor 
                          link={link} 
                          onUpdate={(updates) => handleLegalLinkUpdate(idx, updates)} 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                className="text-xs text-muted-foreground hover:text-primary border border-dashed border-muted-foreground/50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 bg-muted/20 w-fit"
                onClick={() => {
                  const newLinks = content.legalLinks ? [...content.legalLinks] : [];
                  newLinks.push({ text: "Nouveau lien", url: "#", variant: "link", external: false });
                  onUpdate?.({ legalLinks: newLinks });
                }}
              >
                <Icons.PlusCircle size={14} /> Ajouter un lien
              </button>
            )}
            {!content.legalLinks && !isEditing && (
               <div className="text-sm text-muted-foreground italic">Aucun lien légal configuré.</div>
            )}
          </nav>
        </div>

        {/* Colonne 3 : Placeholder ou Navigation (Future) */}
        <div className="flex flex-col gap-4">
           {/* Empty for now, or could be used for other links */}
        </div>

        {/* Colonne 4 : Réseaux Sociaux */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">Suivez-nous</h3>
          {content.socials && (
            <div className="flex gap-3 items-center flex-wrap">
              {content.socials.filter(s => s.enabled !== false).map((social, idx) => {
                const Icon = getIcon(social.platform);
                return (
                  <div key={idx} className="relative group">
                      <a 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-background border text-muted-foreground hover:text-primary hover:border-primary transition-all block"
                          onClick={(e) => isEditing && e.preventDefault()}
                      >
                          <Icon size={18} />
                      </a>
                      {isEditing && (
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex bg-popover p-2 rounded border shadow-lg z-50 flex-col gap-2 min-w-[150px]">
                            <input 
                                className="bg-background border rounded px-2 py-1 text-xs w-full" 
                                value={social.url}
                                onChange={(e) => {
                                    const newSocials = [...content.socials!];
                                    const realIdx = content.socials!.indexOf(social);
                                    newSocials[realIdx] = { ...social, url: e.target.value };
                                    onUpdate?.({ socials: newSocials });
                                }}
                                placeholder="URL"
                            />
                            <button 
                                className="flex items-center gap-1 text-xs text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                                onClick={() => {
                                    const newSocials = [...content.socials!];
                                    const realIdx = content.socials!.indexOf(social);
                                    newSocials[realIdx] = { ...social, enabled: false };
                                    onUpdate?.({ socials: newSocials });
                                }}
                            >
                                <Icons.Trash2 size={12} /> Remove
                            </button>
                        </div>
                    )}
                  </div>
                );
              })}
              
              {/* Add Social Button */}
              {isEditing && (
                  <div className="relative group ml-2">
                      <button className="p-2 rounded-full border border-dashed text-muted-foreground/50 hover:text-primary hover:border-primary transition-colors">
                          <Icons.PlusCircle size={20} />
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex bg-popover p-2 rounded border shadow-lg z-50 flex-col gap-1 min-w-[120px]">
                          <div className="text-xs font-semibold mb-1 px-2">Add Social</div>
                          {['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'GitHub', 'YouTube'].map(platform => (
                              <button
                                  key={platform}
                                  className="text-xs text-left px-2 py-1 hover:bg-muted rounded transition-colors"
                                  onClick={() => {
                                      const newSocials = content.socials ? [...content.socials] : [];
                                      const existing = newSocials.find(s => s.platform.toLowerCase() === platform.toLowerCase());
                                      if (existing) {
                                          existing.enabled = true;
                                      } else {
                                          newSocials.push({
                                              platform: platform.toLowerCase() as any,
                                              url: '#',
                                              enabled: true
                                          });
                                      }
                                      onUpdate?.({ socials: newSocials });
                                  }}
                              >
                                  {platform}
                              </button>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          )}
        </div>
</div>

      <div className="border-t pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {content.copyright}. Tous droits réservés.</p>
        <p className="mt-2 md:mt-0">Site réalisé avec passion.</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
