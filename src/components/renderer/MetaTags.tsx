import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useConfigStore } from '../../store/use-config-store';

export const MetaTags: React.FC = () => {
  const { config } = useConfigStore();
  
  if (!config || !config.meta) return null;

  const { meta, sections } = config;
  const heroSection = sections.find(s => s.type === 'hero');
  const headerSection = sections.find(s => s.type === 'header');

  const title = meta.title || heroSection?.content?.headline || headerSection?.content?.title || 'Landing Page';
  const description = meta.description || heroSection?.content?.subheadline || 'Expertise et services professionnels.';
  const keywords = meta.keywords || '';
  const ogImage = meta.ogImage || heroSection?.content?.image?.src || '';
  const favicon = meta.favicon || '/favicon.ico';
  const canonical = meta.canonicalUrl || window.location.href;
  const robots = meta.robots || 'index, follow';
  const author = meta.author || meta.businessName || title;

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
