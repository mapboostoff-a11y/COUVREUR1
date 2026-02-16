import { z } from 'zod';

// Basic Types
export const ImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const LinkSchema = z.object({
  text: z.string(),
  url: z.string(),
  variant: z.enum(['primary', 'secondary', 'outline', 'link']).default('primary'),
  external: z.boolean().default(false),
});

// Section Settings
export const SectionSettingsSchema = z.object({
  visible: z.boolean().default(true),
  paddingTop: z.union([z.enum(['none', 'sm', 'md', 'lg', 'xl']), z.string()]).default('md'),
  paddingBottom: z.union([z.enum(['none', 'sm', 'md', 'lg', 'xl']), z.string()]).default('md'),
  backgroundColor: z.union([z.enum(['white', 'gray', 'primary', 'dark']), z.string()]).default('white'),
  container: z.boolean().default(true), // Centered container
  animation: z.enum(['none', 'fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in']).default('slide-up'),
  border: z.boolean().default(false),
  shadow: z.enum(['none', 'sm', 'md', 'lg']).default('none'),
});

// Section Content Schemas
export const HeroContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta: z.array(LinkSchema).optional(),
  image: ImageSchema.optional(),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  logo: z.string().optional(),
  videoUrl: z.string().url().optional(),
});

export const FeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(), // Lucide icon name
});

export const FeaturesContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  features: z.array(FeatureItemSchema),
  columns: z.number().min(1).max(4).default(3),
});

export const TestimonialItemSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  avatar: z.string().url().optional(),
  content: z.string(),
  rating: z.number().min(1).max(5).default(5),
});

export const TestimonialsContentSchema = z.object({
  title: z.string(),
  testimonials: z.array(TestimonialItemSchema),
});

export const PricingPlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  period: z.string().optional(), // /month, /year
  features: z.array(z.string()),
  cta: LinkSchema,
  highlight: z.boolean().default(false),
});

export const PricingContentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  plans: z.array(PricingPlanSchema),
});

export const CtaContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  buttons: z.array(LinkSchema),
});

export const FooterLinkGroupSchema = z.object({
  title: z.string(),
  links: z.array(LinkSchema),
});

export const FooterContentSchema = z.object({
  copyright: z.string(),
  socials: z.array(z.object({
    platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'github', 'youtube']),
    url: z.string().url(),
    enabled: z.boolean().default(true),
  })).optional(),
  ctaButton: LinkSchema.optional(),
  columns: z.array(FooterLinkGroupSchema).optional(),
  legalLinks: z.array(LinkSchema).optional(),
  legal: z.object({
    publisher: z.string().optional(),
    publisherContact: z.string().optional(),
    siret: z.string().optional(),
    rcs: z.string().optional(),
    capital: z.string().optional(),
    tva: z.string().optional(),
    host: z.string().optional(),
    hostAddress: z.string().optional(),
    intellectualProperty: z.string().optional(),
  }).optional(),
});

export const MapContentSchema = z.object({
  title: z.string().optional(),
  address: z.string(),
  zoom: z.number().min(1).max(20).default(15),
  height: z.string().default('400px'),
});

export const HeaderContentSchema = z.object({
  logo: z.string().optional(), // Text logo or image URL
  title: z.string().optional(), // Brand Name text
  logoMode: z.enum(['text', 'image', 'both']).default('text'),
  links: z.array(LinkSchema),
  cta: LinkSchema.optional(),
  sticky: z.boolean().default(true),
});

export const ContactContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  hours: z.string().optional(),
});

export const VideoContentSchema = z.object({
  videoUrl: z.string().url(),
  title: z.string().optional(),
  autoplay: z.boolean().default(false),
  controls: z.boolean().default(true),
  width: z.string().default('100%'),
  maxWidth: z.string().default('800px'),
});

export const GalleryContentSchema = z.object({
  title: z.string().optional(),
  images: z.array(ImageSchema),
  columns: z.number().min(1).max(6).default(3),
  aspectRatio: z.enum(['square', 'video', 'portrait', 'none']).default('square'),
});

export const VideoItemSchema = z.object({
  videoUrl: z.string().url(),
  thumbnail: z.string().url().optional(),
  title: z.string().optional(),
});

export const VideoGalleryContentSchema = z.object({
  title: z.string().optional(),
  videos: z.array(VideoItemSchema),
  columns: z.number().min(1).max(4).default(3),
  aspectRatio: z.enum(['video', 'square', 'portrait']).default('video'),
});

export const IframeContentSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  width: z.string().default('100%'),
  height: z.string().default('500px'),
  maxWidth: z.string().default('1200px'),
  border: z.boolean().default(false),
  allowFullScreen: z.boolean().default(true),
});

// Discriminated Union for Sections
export const SectionSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('header'), content: HeaderContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('hero'), content: HeroContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('features'), content: FeaturesContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('testimonials'), content: TestimonialsContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('pricing'), content: PricingContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('cta'), content: CtaContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('contact'), content: ContactContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('footer'), content: FooterContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('video'), content: VideoContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('gallery'), content: GalleryContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('video-gallery'), content: VideoGalleryContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('map'), content: MapContentSchema, settings: SectionSettingsSchema }),
  z.object({ id: z.string(), name: z.string().optional(), type: z.literal('iframe'), content: IframeContentSchema, settings: SectionSettingsSchema }),
]);

// Global Theme Schema
export const ThemeSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
});

// WhatsApp Config Schema
export const WhatsAppConfigSchema = z.object({
  enabled: z.boolean().default(false),
  number: z.string().default(''),
  message: z.string().optional(),
  position: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']).default('bottom-right'),
});

// SEO / Meta Schema
export const MetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.string().optional(), // Comma separated keywords
  ogImage: z.string().url().optional(),
  favicon: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().default('index, follow'),
  author: z.string().optional(),
  facebookPixelId: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  // Local Business Structured Data (Schema.org)
  businessName: z.string().optional(),
  businessType: z.string().default('LocalBusiness'), // e.g., RoofingContractor
  priceRange: z.string().optional(),
  ratingValue: z.number().optional(),
  reviewCount: z.number().optional(),
});

// Root Configuration Schema
export const LandingPageConfigSchema = z.object({
  meta: MetaSchema,
  theme: ThemeSchema,
  whatsapp: WhatsAppConfigSchema.optional(),
  sections: z.array(SectionSchema),
});

export type LandingPageConfig = z.infer<typeof LandingPageConfigSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type SectionType = Section['type'];
