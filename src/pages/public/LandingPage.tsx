import { useConfigStore } from '../../store/use-config-store';
import { SectionRenderer } from '../../components/renderer/SectionRenderer';
import { WhatsAppButton } from '../../components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';

export const LandingPage = () => {
  const config = useConfigStore((state) => state.config);
  const { meta, sections } = config;

  // Enrichissement automatique du SEO à partir des données disponibles
  const heroSection = sections.find(s => s.type === 'hero');
  const headerSection = sections.find(s => s.type === 'header');
  
  const pageTitle = meta.title || heroSection?.content.headline || headerSection?.content.title || 'Landing Page';
  const pageDescription = meta.description || heroSection?.content.subheadline || 'Expertise et services professionnels.';
  const pageImage = meta.ogImage || heroSection?.content.image?.src || '';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {pageImage && <meta property="og:image" content={pageImage} />}
        <meta property="og:url" content={window.location.href} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {pageImage && <meta name="twitter:image" content={pageImage} />}

        {/* Canonical Link */}
        <link rel="canonical" href={window.location.href} />

        {meta.favicon && <link rel="icon" href={meta.favicon} />}
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        {config.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
      <WhatsAppButton />
    </>
  );
};
