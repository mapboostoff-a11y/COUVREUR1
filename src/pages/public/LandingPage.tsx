import { useConfigStore } from '../../store/use-config-store';
import { SectionRenderer } from '../../components/renderer/SectionRenderer';
import { WhatsAppButton } from '../../components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';

export const LandingPage = () => {
  const config = useConfigStore((state) => state.config);
  const { meta } = config;

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {meta.ogImage && <meta name="twitter:image" content={meta.ogImage} />}

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
