import type { LandingPageConfig } from '../types/schema';

export const defaultConfig: LandingPageConfig = {
  meta: {
    title: "My Awesome Landing Page",
    description: "Built with the ultimate Landing Page Builder",
  },
  theme: {
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  whatsapp: {
    enabled: false,
    number: "",
    message: "Hello! I would like more information.",
    position: "bottom-right"
  },
  sections: [
    {
      id: "hero-1",
      type: "hero",
      settings: {
        visible: true,
        paddingTop: "xl",
        paddingBottom: "xl",
        backgroundColor: "white",
        container: true,
        animation: "none",
        border: false,
        shadow: "none"
      },
      content: {
        headline: "Build Faster with Our Tool",
        subheadline: "The most powerful landing page builder for modern businesses. Drag, drop, and publish in minutes.",
        alignment: "center",
        cta: [
          { text: "Get Started", url: "#", variant: "primary", external: false },
          { text: "Learn More", url: "#", variant: "outline", external: false }
        ]
      }
    },
    {
      id: "features-1",
      type: "features",
      settings: {
        visible: true,
        paddingTop: "lg",
        paddingBottom: "lg",
        backgroundColor: "gray",
        container: true,
        animation: "none",
        border: false,
        shadow: "none"
      },
      content: {
        title: "Why Choose Us?",
        subtitle: "Everything you need to launch your next project.",
        columns: 3,
        features: [
          { title: "Blazing Fast", description: "Optimized for speed and performance.", icon: "Zap" },
          { title: "Secure", description: "Enterprise-grade security out of the box.", icon: "Shield" },
          { title: "Customizable", description: "Fully flexible design system.", icon: "Layout" }
        ]
      }
    },
    {
      id: "cta-1",
      type: "cta",
      settings: {
        visible: true,
        paddingTop: "lg",
        paddingBottom: "lg",
        backgroundColor: "primary",
        container: true,
        animation: "none",
        border: false,
        shadow: "none"
      },
      content: {
        title: "Ready to Dive In?",
        description: "Join thousands of satisfied users today.",
        buttons: [
          { text: "Start Free Trial", url: "#", variant: "secondary", external: false }
        ]
      }
    },
    {
      id: "footer-1",
      type: "footer",
      settings: {
        visible: true,
        paddingTop: "md",
        paddingBottom: "md",
        backgroundColor: "dark",
        container: true,
        animation: "none",
        border: false,
        shadow: "none"
      },
      content: {
        copyright: "© 2024 LandingPage Inc. All rights reserved.",
        socials: [
          { platform: "twitter", url: "https://twitter.com", enabled: true },
          { platform: "github", url: "https://github.com", enabled: true }
        ]
      }
    }
  ]
};
