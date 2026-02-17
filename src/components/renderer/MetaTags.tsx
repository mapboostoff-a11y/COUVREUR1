import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useConfigStore } from '../../store/use-config-store';

export const MetaTags: React.FC = () => {
  const { config } = useConfigStore();
  
  if (!config || !config.meta) return null;

  const { meta, sections } = config;
  const heroSection = sections.find(s => s.type === 'hero');
  const headerSection = sections.find(s => s.type === 'header');
  const mapSection = sections.find(s => s.type === 'map');

  const location = mapSection?.content?.address;
  const businessName = meta.businessName || headerSection?.content?.title || 'Entreprise locale';

  let title = meta.title || heroSection?.content?.headline || headerSection?.content?.title || 'Landing Page';
  let description = meta.description || heroSection?.content?.subheadline || 'Expertise et services professionnels.';

  // Enrich title/description with location if available and not already present
  if (location) {
    if (!title.toLowerCase().includes(location.toLowerCase()) && !meta.title) {
      title = `${title} - ${location}`;
    }
    if (!description.toLowerCase().includes(location.toLowerCase()) && !meta.description) {
      description = `${description} Interventions à ${location} et alentours.`;
    }
  }

  const keywords = meta.keywords || (location ? `services, ${location}, expert` : '');
  const ogImage = meta.ogImage || heroSection?.content?.image?.src || '';
  const favicon = meta.favicon || '/favicon.ico';
  const canonical = meta.canonicalUrl || window.location.href;
  const robots = meta.robots || 'index, follow';
  const author = meta.author || businessName;

  return (
    <Helmet>
      {/* Basic Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <link rel="icon" href={favicon} />
      
      {/* Local SEO / Map Tags */}
      {location && <meta name="geo.placename" content={location} />}
      {location && <meta name="location" content={location} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};
