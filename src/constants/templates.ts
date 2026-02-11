import type { Section } from '../types/schema';

type SectionTemplate = Omit<Section, 'id'> & { name: string; icon?: string };

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    name: "Embedded Content (Iframe)",
    type: 'iframe',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      url: "https://www.wikipedia.org",
      title: "Embedded Content",
      width: "100%",
      height: "600px",
      maxWidth: "1200px",
      border: true,
      allowFullScreen: true
    }
  },
  {
    name: "Header Navigation",
    type: 'header',
    settings: { visible: true, paddingTop: 'none', paddingBottom: 'none', backgroundColor: 'white', container: false, animation: 'none', border: false, shadow: 'sm' },
    content: {
      logo: "MyBrand",
      title: "MyBrand",
      logoMode: "text",
      sticky: true,
      links: [
        { text: "Features", url: "#features", variant: "link", external: false },
        { text: "Pricing", url: "#pricing", variant: "link", external: false },
        { text: "About", url: "#about", variant: "link", external: false }
      ],
      cta: { text: "Get Started", url: "#signup", variant: "primary", external: false }
    }
  },
  {
    name: "Contact Form",
    type: 'contact',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you. Fill out the form below.",
      email: "hello@example.com",
      phone: "+1 (555) 000-0000",
      address: "123 Main St, San Francisco, CA"
    }
  },
  {
    name: "Hero (Split)",
    type: 'hero',
    settings: { visible: true, paddingTop: 'xl', paddingBottom: 'xl', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      headline: "Drive Growth Faster",
      subheadline: "All the tools you need to scale your business, in one platform.",
      alignment: "left",
      cta: [
        { text: "Get Started", url: "#", variant: "primary", external: false },
      ],
      image: {
        src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
        alt: "Growth",
        width: 1200,
        height: 600
      }
    }
  },
  {
    name: "Hero (Minimal)",
    type: 'hero',
    settings: { visible: true, paddingTop: 'xl', paddingBottom: 'xl', backgroundColor: 'gray', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      headline: "Less is More",
      subheadline: "Focus on what matters with our distraction-free interface.",
      alignment: "center",
      cta: [
        { text: "Try it Free", url: "#", variant: "primary", external: false },
        { text: "See Demo", url: "#", variant: "outline", external: false }
      ]
    }
  },
  {
    name: "Hero (Classic)",
    type: 'hero',
    settings: { visible: true, paddingTop: 'xl', paddingBottom: 'xl', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      headline: "Your Main Value Proposition",
      subheadline: "Describe what your product or service does in a short, catchy sentence.",
      alignment: "center",
      cta: [
        { text: "Get Started", url: "#", variant: "primary", external: false },
        { text: "Learn More", url: "#", variant: "secondary", external: false }
      ],
      image: {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
        alt: "Hero Image",
        width: 1200,
        height: 600
      }
    }
  },
  {
    name: "Hero (Video)",
    type: 'hero',
    settings: { visible: true, paddingTop: 'none', paddingBottom: 'none', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      headline: "Showcase Your Product",
      subheadline: "Watch the video to learn more about our amazing features.",
      alignment: "center",
      cta: [{ text: "Get Started", url: "#", variant: "primary", external: false }],
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  },
  {
    name: "Features Grid",
    type: 'features',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'gray', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Why Choose Us",
      subtitle: "Everything you need to succeed",
      columns: 3,
      features: [
        { title: "Fast Performance", description: "Optimized for speed and efficiency.", icon: "Zap" },
        { title: "Secure & Reliable", description: "Data protection you can trust.", icon: "Shield" },
        { title: "Easy Customization", description: "Tailor it to your needs effortlessly.", icon: "Settings" }
      ]
    }
  },
  {
    name: "Pricing Table",
    type: 'pricing',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Simple Pricing",
      description: "Choose the plan that fits your needs",
      plans: [
        {
          name: "Starter",
          price: "$29",
          period: "/mo",
          features: ["Basic Features", "5 Projects", "Community Support"],
          cta: { text: "Start Free", url: "#", variant: "outline", external: false },
          highlight: false
        },
        {
          name: "Pro",
          price: "$99",
          period: "/mo",
          highlight: true,
          features: ["All Features", "Unlimited Projects", "Priority Support"],
          cta: { text: "Get Started", url: "#", variant: "primary", external: false }
        },
        {
          name: "Enterprise",
          price: "Custom",
          features: ["Custom Solutions", "Dedicated Manager", "SLA"],
          cta: { text: "Contact Us", url: "#", variant: "outline", external: false },
          highlight: false
        }
      ]
    }
  },
  {
    name: "Testimonials",
    type: 'testimonials',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'gray', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Trusted by Developers",
      testimonials: [
        {
          content: "This tool has completely transformed our workflow. Highly recommended!",
          name: "Jane Doe",
          role: "CTO, TechCorp",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 5
        },
        {
          content: "The best landing page builder I've ever used. Simple yet powerful.",
          name: "John Smith",
          role: "Freelancer",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 5
        }
      ]
    }
  },
  {
    name: "Call to Action",
    type: 'cta',
    settings: { visible: true, paddingTop: 'xl', paddingBottom: 'xl', backgroundColor: 'primary', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Ready to Get Started?",
      description: "Join thousands of satisfied customers today.",
      buttons: [
        { text: "Get Started Now", url: "#", variant: "secondary", external: false }
      ]
    }
  },
  {
    name: "Footer",
    type: 'footer',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'dark', container: true, animation: 'none', border: false, shadow: 'none' },
    content: {
      copyright: "© 2024 Your Company. All rights reserved.",
      socials: [
        { platform: "twitter", url: "https://twitter.com", enabled: true },
        { platform: "github", url: "https://github.com", enabled: true }
      ],
      columns: [
        {
          title: "Product",
          links: [
            { text: "Features", url: "#", variant: "link", external: false },
            { text: "Pricing", url: "#", variant: "link", external: false }
          ]
        },
        {
          title: "Company",
          links: [
            { text: "About", url: "#", variant: "link", external: false },
            { text: "Contact", url: "#", variant: "link", external: false }
          ]
        }
      ]
    }
  },
  {
    name: "Video Player",
    type: 'video',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'dark', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Watch Our Story",
      autoplay: false,
      controls: true,
      width: "100%",
      maxWidth: "900px"
    }
  },
  {
    name: "Image Gallery",
    type: 'gallery',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Our Work",
      columns: 3,
      aspectRatio: "square",
      images: [
        { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", alt: "Work 1", width: 800, height: 800 },
        { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", alt: "Work 2", width: 800, height: 800 },
        { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", alt: "Work 3", width: 800, height: 800 },
        { src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", alt: "Work 4", width: 800, height: 800 },
        { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", alt: "Work 5", width: 800, height: 800 },
        { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", alt: "Work 6", width: 800, height: 800 }
      ]
    }
  },
  {
    name: "Header (Minimal)",
    type: 'header',
    settings: { visible: true, paddingTop: 'none', paddingBottom: 'none', backgroundColor: 'white', container: false, animation: 'none', border: false, shadow: 'sm' },
    content: {
      logo: "Startup",
      title: "Startup",
      logoMode: "text",
      sticky: true,
      links: [],
      cta: { text: "Sign Up", url: "#signup", variant: "primary", external: false }
    }
  },
  {
    name: "Header (Dark)",
    type: 'header',
    settings: { visible: true, paddingTop: 'none', paddingBottom: 'none', backgroundColor: 'dark', container: false, animation: 'none', border: false, shadow: 'sm' },
    content: {
      logo: "Enterprise",
      title: "Enterprise",
      logoMode: "text",
      sticky: true,
      links: [
        { text: "Product", url: "#product", variant: "link", external: false },
        { text: "Enterprise", url: "#enterprise", variant: "link", external: false }
      ],
      cta: { text: "Contact Sales", url: "#contact", variant: "secondary", external: false }
    }
  },
  {
    name: "Video (Startup)",
    type: 'video',
    settings: { visible: true, paddingTop: 'xl', paddingBottom: 'xl', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "How We Started",
      autoplay: false,
      controls: true,
      width: "100%",
      maxWidth: "900px"
    }
  },
  {
    name: "Map Location",
    type: 'map',
    settings: { visible: true, paddingTop: 'none', paddingBottom: 'none', backgroundColor: 'white', container: false, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Our Location",
      address: "Eiffel Tower, Paris",
      zoom: 15,
      height: "400px"
    }
  },
  {
    name: "Simple Footer",
    type: 'footer',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'dark', container: true, animation: 'none', border: false, shadow: 'none' },
    content: {
      copyright: "© 2024 Your Company. All rights reserved.",
      socials: [
        { platform: 'twitter', url: '#', enabled: true },
        { platform: 'facebook', url: '#', enabled: true },
        { platform: 'instagram', url: '#', enabled: true }
      ],
      ctaButton: { text: "Book a Demo", url: "#demo", variant: "primary", external: true }
    }
  },
  {
    name: "Video Gallery",
    type: 'video-gallery',
    settings: { visible: true, paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: 'white', container: true, animation: 'slide-up', border: false, shadow: 'none' },
    content: {
      title: "Watch Our Tutorials",
      columns: 3,
      aspectRatio: "video",
      videos: [
        { videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Introduction" },
        { videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Feature Overview" },
        { videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Advanced Tips" }
      ]
    }
  }
];
