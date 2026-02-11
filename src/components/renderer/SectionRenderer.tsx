import React, { Suspense } from 'react';
import type { Section } from '../../types/schema';
import { SectionWrapper } from './SectionWrapper';
import { SectionToolbar } from '../admin/SectionToolbar';

// Lazy load sections for performance
const Hero = React.lazy(() => import('../sections/Hero'));
const Features = React.lazy(() => import('../sections/Features'));
const Testimonials = React.lazy(() => import('../sections/Testimonials'));
const Pricing = React.lazy(() => import('../sections/Pricing'));
const Cta = React.lazy(() => import('../sections/Cta'));
const Footer = React.lazy(() => import('../sections/Footer'));
const Header = React.lazy(() => import('../sections/Header'));
const Contact = React.lazy(() => import('../sections/Contact'));
const Video = React.lazy(() => import('../sections/Video'));
const Gallery = React.lazy(() => import('../sections/Gallery'));
const MapSection = React.lazy(() => import('../sections/Map'));
const VideoGallery = React.lazy(() => import('../sections/VideoGallery'));
const Iframe = React.lazy(() => import('../sections/Iframe'));

interface SectionRendererProps {
  section: Section;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Section>) => void;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, isEditing, onUpdate }) => {
  const handleContentUpdate = (contentUpdates: Partial<Section['content']>) => {
    if (onUpdate) {
      onUpdate({ content: { ...section.content, ...contentUpdates } } as any);
    }
  };

  const handleSettingsUpdate = (settingsUpdates: Partial<Section['settings']>) => {
    if (onUpdate) {
      onUpdate({ settings: { ...section.settings, ...settingsUpdates } });
    }
  };

  const renderContent = () => {
    switch (section.type) {
      case 'header':
        return <Header content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'hero':
        return <Hero content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'features':
        return <Features content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'testimonials':
        return <Testimonials content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'pricing':
        return <Pricing content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'cta':
        return <Cta content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'contact':
        return <Contact content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'footer':
        return <Footer content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'video':
        return <Video content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'gallery':
        return <Gallery content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'map':
        return <MapSection content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'video-gallery':
        return <VideoGallery content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      case 'iframe':
        return <Iframe content={section.content} isEditing={isEditing} onUpdate={handleContentUpdate} />;
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <SectionWrapper 
      settings={section.settings} 
      id={section.id}
      toolbar={isEditing ? (
        <SectionToolbar settings={section.settings} onUpdate={handleSettingsUpdate} />
      ) : undefined}
    >
      <Suspense fallback={<div className="h-32 w-full animate-pulse bg-gray-100 rounded-lg" />}>
        {renderContent()}
      </Suspense>
    </SectionWrapper>
  );
};
