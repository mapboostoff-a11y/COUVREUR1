# AGENTS.md

This file provides context and instructions for AI coding agents working on the **Landing Page Pas Cher - Base Template** project. It is the **primary reference** for understanding the project structure and **generating websites automatically**.

> **⚠️ IMPORTANT FOR AGENTS**: The source of truth for all data structures is `src/types/schema.ts`. If this documentation conflicts with the Zod schemas defined there, **follow the Zod schemas**.

## Project Overview

This is a **Landing Page Builder** powered by a JSON configuration.
- **Core Concept**: A single JSON object (`LandingPageConfig`) defines the entire website (theme, content, sections).
- **Stack**: React 19, Vite, Tailwind CSS v4, Zustand, Zod.
- **Backend**: Express.js (REST API), SQLite (better-sqlite3) for persistence.
- **Goal**: Enable AI agents to generate complete, high-quality landing pages by simply producing a valid JSON configuration.

## Setup Commands

- **Install**: `pnpm install`
- **Dev**: `pnpm dev` (Runs both Vite frontend and Express backend via middleware)
- **Build**: `pnpm build`
- **Start**: `pnpm start` (Production server)
- **Test**: `npx vitest`

---

## 🏗️ Backend Architecture (Express.js + SQLite)

The project now uses a robust backend architecture to handle data persistence and deployment.

### 1. Express.js Server
- **Entry Point**: `server/index.js` (starts the server).
- **App Config**: `server/app.js` (middleware, routes).
- **API Routes**: `server/routes/api.js` (handles config read/write).
- **Middleware**: `cors`, `helmet`, `body-parser`.

### 2. SQLite Database
- **Library**: `better-sqlite3`.
- **File**: `site-data.db` (created automatically in project root).
- **Schema**:
  - Table `site_config`:
    - `key` (TEXT PRIMARY KEY)
    - `value` (TEXT - JSON content)
    - `updated_at` (DATETIME)
- **Seeding**: Automatically seeds from `exempleenproduction.json` if the database is empty.

### 3. API Endpoints
- `GET /api/config`: Retrieves the current active configuration.
- `POST /api/config`: Updates the configuration (hot reload).
- `POST /api/publish`: Updates the configuration and optionally syncs to Git (if configured).

### 4. Deployment (Vercel)
The project is configured for Vercel Serverless Functions.
- **Config**: `vercel.json` rewrites `/api/*` to `api/index.js`.
- **Entry**: `api/index.js` wraps the Express app for Vercel.
- **Persistence**: Note that on Vercel, the local SQLite file is ephemeral. For permanent storage in production, consider an external DB or accept that changes reset on redeploy (unless using a VPS).

---

## 🚀 Automatic Site Generation Guide

To generate a website for a user (e.g., "Create a site for a Roofer"), follow these steps:

### 1. Analyze the Request
Extract key details from the user's prompt:
- **Industry/Niche**: (e.g., Roofer, Dentist, SaaS) -> determines images, icons, and copy.
- **Brand Name**: The name of the business.
- **Contact Info**: Phone, Email, Address (use placeholders if not provided).
- **Tone/Style**: Professional, Friendly, Luxury, Urgent, etc.

### 2. Construct the Root Configuration
Start with the root `LandingPageConfig` object. You **must** strictly follow this structure:

```json
{
  "meta": {
    "title": "Brand Name - Tagline",
    "description": "SEO optimized description of the business.",
    "favicon": "https://example.com/favicon.ico" // Optional
  },
  "theme": {
    "colors": {
      "primary": "#3b82f6",       // Main brand color (buttons, highlights)
      "secondary": "#1e293b",     // Secondary/Accent color
      "background": "#ffffff",    // Page background (usually white or very light)
      "text": "#0f172a"           // Body text color
    },
    "fonts": {
      "heading": "Inter",         // Options: Inter, Roboto, Open Sans, etc.
      "body": "Inter"
    }
  },
  "whatsapp": {                   // Optional: Floating WhatsApp button
    "enabled": true,
    "number": "1234567890",
    "message": "Hi, I need a quote.",
    "position": "bottom-right"
  },
  "sections": []                  // The array of sections (see below)
}
```

### 3. Section Strategy
Build the `sections` array using a standard high-converting structure.

> **⚠️ CRITICAL LAYOUT REQUIREMENT**:
> For **ALL** sections, the `settings.container` property **MUST be `true`** (or omitted, as it defaults to `true`).
> This ensures content is centered and bounded by the site's max-width, preventing elements from sticking to the screen edges.
> *Only set to `false` if a full-width background with edge-to-edge content is explicitly requested.*

**Recommended Layout:**
1.  **Header**: Navigation & Logo (Sticky).
2.  **Hero**: First impression. High quality image + Strong CTA.
3.  **Features**: 3-4 key selling points with icons.
4.  **Gallery** (or Video): Visual proof of work.
5.  **Testimonials**: Social proof.
6.  **Pricing** (if applicable): Clear packages.
7.  **Map** (for local businesses): Physical location.
8.  **Contact**: Essential contact details (No form).
9.  **Footer**: Copyright and links.

### 4. JSON Reference (Section Catalog)
Use these snippets to populate the `sections` array.
**Note**: `id` must be unique (e.g., `hero-1`, `features-1`).

#### **Header (`type: 'header'`)**
*Crucial for navigation. Usually the first section.*

**Attributes:**
- `title` (string): Brand name text.
- `logo` (string, optional): URL to logo image.
- `logoMode` ('text' | 'image' | 'both'): How to display the brand.
- `links` (Array): Navigation links `{ text, url, variant }`.
- `cta` (Object): Call to action button `{ text, url, variant }`.
- `sticky` (boolean): Keeps header fixed at top.

```json
{
  "id": "header-1",
  "type": "header",
  "content": {
    "title": "BrandName",
    "logo": "https://...",
    "logoMode": "text",
    "links": [
      { "text": "Services", "url": "#services" },
      { "text": "Contact", "url": "#contact" }
    ],
    "cta": { "text": "Call Now", "url": "tel:+1234567890", "variant": "primary" }
  },
  "settings": { "visible": true, "sticky": true }
}
```

#### **Hero (`type: 'hero'`)**
*First impression. High quality image + Strong CTA.*

**Attributes:**
- `headline` (string): Main value proposition.
- `subheadline` (string): Supporting text.
- `alignment` ('left' | 'center' | 'right'): Text alignment.
- `cta` (Array): Action buttons `{ text, url, variant }`.
- `image` (Object): Hero image `{ src, alt }`.
- `videoUrl` (string, optional): Background video URL.

```json
{
  "id": "hero-1",
  "type": "hero",
  "content": {
    "headline": "Expert Services in Your City",
    "subheadline": "Professional, reliable, and affordable solutions.",
    "alignment": "center",
    "cta": [
      { "text": "Get a Free Quote", "url": "#contact", "variant": "primary" }
    ],
    "image": {
      "src": "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80",
      "alt": "Hero Image"
    }
  },
  "settings": { "paddingTop": "xl", "paddingBottom": "xl" }
}
```

#### **Features (`type: 'features'`)**
*Key selling points with icons.*

**Attributes:**
- `title` (string): Section heading.
- `subtitle` (string, optional): Section sub-heading.
- `columns` (number): Number of columns (default: 3).
- `features` (Array): List of features.
  - `title`: Feature name.
  - `description`: Feature detail.
  - `icon`: **Lucide** icon name (e.g., 'Shield', 'Clock').

```json
{
  "id": "features-1",
  "type": "features",
  "content": {
    "title": "Why Choose Us?",
    "columns": 3,
    "features": [
      {
        "title": "24/7 Service",
        "description": "Always available when you need us.",
        "icon": "Clock"
      },
      {
        "title": "Certified Experts",
        "description": "Fully licensed and insured team.",
        "icon": "Award"
      }
    ]
  },
  "settings": { "backgroundColor": "gray" }
}
```

#### **Testimonials (`type: 'testimonials'`)**
*Social proof from clients.*

**Attributes:**
- `title` (string): Section heading.
- `testimonials` (Array): List of reviews.
  - `name`: Client name.
  - `role`: Client job/title.
  - `avatar`: URL to client photo.
  - `content`: The review text.
  - `rating`: 1-5 stars.

```json
{
  "id": "testimonials-1",
  "type": "testimonials",
  "content": {
    "title": "What Our Clients Say",
    "testimonials": [
      {
        "name": "John Doe",
        "role": "CEO, Tech Corp",
        "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
        "content": "Amazing service! Highly recommended.",
        "rating": 5
      }
    ]
  },
  "settings": { "backgroundColor": "white" }
}
```

#### **Pricing (`type: 'pricing'`)**
*Clear packages/plans.*

**Attributes:**
- `title` (string): Section heading.
- `description` (string, optional): Helper text.
- `plans` (Array): Pricing tiers.
  - `name`: Plan name (e.g., "Basic").
  - `price`: Cost string (e.g., "$29").
  - `period`: Billing period (e.g., "/month").
  - `features`: Array of strings.
  - `cta`: Button object.
  - `highlight`: Boolean to emphasize plan.

```json
{
  "id": "pricing-1",
  "type": "pricing",
  "content": {
    "title": "Simple Pricing",
    "description": "Choose the plan that fits you.",
    "plans": [
      {
        "name": "Basic",
        "price": "$29",
        "period": "/month",
        "features": ["Feature 1", "Feature 2"],
        "cta": { "text": "Get Started", "url": "#signup" },
        "highlight": false
      },
      {
        "name": "Pro",
        "price": "$99",
        "period": "/month",
        "features": ["Everything in Basic", "Priority Support"],
        "cta": { "text": "Go Pro", "url": "#signup" },
        "highlight": true
      }
    ]
  },
  "settings": { "backgroundColor": "white" }
}
```

#### **CTA (`type: 'cta'`)**
*Call to Action section.*

**Attributes:**
- `title` (string): Compelling header.
- `description` (string): Persuasive text.
- `buttons` (Array): Action buttons.

```json
{
  "id": "cta-1",
  "type": "cta",
  "content": {
    "title": "Ready to get started?",
    "description": "Join thousands of satisfied customers today.",
    "buttons": [
      { "text": "Sign Up Now", "url": "#signup", "variant": "primary" }
    ]
  },
  "settings": { "backgroundColor": "primary" }
}
```

#### **Gallery (`type: 'gallery'`)**
*Visual proof of work (Images).*

**Attributes:**
- `title` (string, optional): Section header.
- `columns` (number): Grid columns.
- `aspectRatio` ('square' | 'video' | 'portrait'): Image shape.
- `images` (Array): List of images `{ src, alt }`.

```json
{
  "id": "gallery-1",
  "type": "gallery",
  "content": {
    "title": "Our Recent Projects",
    "columns": 3,
    "aspectRatio": "square",
    "images": [
      { "src": "https://...", "alt": "Project 1" },
      { "src": "https://...", "alt": "Project 2" }
    ]
  },
  "settings": {}
}
```

#### **Video (`type: 'video'`)**
*Single featured video.*

**Attributes:**
- `videoUrl` (string): URL (YouTube, Vimeo, etc.).
- `title` (string, optional): Video title.
- `autoplay` (boolean): Auto start.
- `controls` (boolean): Show controls.
- `width`: CSS width.

```json
{
  "id": "video-1",
  "type": "video",
  "content": {
    "videoUrl": "https://www.youtube.com/watch?v=...",
    "title": "Product Demo",
    "autoplay": false,
    "controls": true,
    "width": "100%",
    "maxWidth": "800px"
  },
  "settings": {}
}
```

#### **Video Gallery (`type: 'video-gallery'`)**
*Collection of videos.*

**Attributes:**
- `title` (string, optional): Section header.
- `columns` (number): Grid columns.
- `aspectRatio` ('video' | 'square' | 'portrait').
- `videos` (Array): List of video objects `{ videoUrl, thumbnail, title }`.

```json
{
  "id": "video-gallery-1",
  "type": "video-gallery",
  "content": {
    "title": "Video Tutorials",
    "columns": 3,
    "aspectRatio": "video",
    "videos": [
      { "videoUrl": "https://...", "thumbnail": "https://...", "title": "Tutorial 1" }
    ]
  },
  "settings": {}
}
```

#### **Map (`type: 'map'`)**
*Physical location map.*

**Attributes:**
- `title` (string, optional): Map header.
- `address` (string): The location to show.
- `zoom` (number): Zoom level (1-20).
- `height` (string): CSS height.

```json
{
  "id": "map-1",
  "type": "map",
  "content": {
    "title": "Visit Our Office",
    "address": "123 Rue de la Paix, Paris, France",
    "zoom": 14,
    "height": "400px"
  },
  "settings": { "visible": true }
}
```

#### **Contact (`type: 'contact'`)**
*Essential contact details (Address, Phone, Email, Hours). No form.*

**Attributes:**
- `title` (string): Header text.
- `subtitle` (string, optional): Sub-header.
- `email` (string, optional): Contact email.
- `phone` (string, optional): Contact phone.
- `address` (string, optional): Physical address.
- `hours` (string, optional): Opening hours (can be multi-line).

```json
{
  "id": "contact-1",
  "type": "contact",
  "content": {
    "title": "Contact Us",
    "subtitle": "Get in touch with us.",
    "email": "contact@example.com",
    "phone": "+1 234 567 890",
    "address": "123 Main St, City, Country",
    "hours": "Mon-Fri: 9am - 6pm\nSat: 10am - 4pm"
  },
  "settings": { "backgroundColor": "gray" }
}
```

#### **Footer (`type: 'footer'`)**
*Simple footer with copyright and social links.*

**Attributes:**
- `copyright` (string): Copyright text.
- `socials` (Array): Social links `{ platform, url, enabled }`.

```json
{
  "id": "footer-1",
  "type": "footer",
  "content": {
    "copyright": "© 2024 Company Name. All rights reserved.",
    "socials": [
      { "platform": "facebook", "url": "https://facebook.com", "enabled": true },
      { "platform": "instagram", "url": "https://instagram.com", "enabled": true }
    ]
  },
  "settings": { "backgroundColor": "dark" }
}
```

---

## 🧪 Full Example: "Roofer Site" Generation

**User Input**: "Make a site for 'TopToit', a roofer in Bordeaux."

**Generated JSON**:
```json
{
  "meta": {
    "title": "TopToit - Expert Couvreur Bordeaux",
    "description": "Réparation et installation de toiture à Bordeaux. Devis gratuit.",
    "favicon": ""
  },
  "theme": {
    "colors": {
      "primary": "#e63946",       // Red/Orange for urgency/construction
      "secondary": "#1d3557",     // Navy Blue for trust
      "background": "#f1faee",    // Off-white
      "text": "#1d3557"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    }
  },
  "whatsapp": {
    "enabled": true,
    "number": "33612345678",
    "message": "Bonjour, je souhaite un devis.",
    "position": "bottom-right"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "content": {
        "title": "TopToit",
        "logoMode": "text",
        "links": [
          { "text": "Services", "url": "#services" },
          { "text": "Réalisations", "url": "#gallery" },
          { "text": "Contact", "url": "#contact" }
        ],
        "cta": { "text": "06 12 34 56 78", "url": "tel:+33612345678", "variant": "primary" }
      },
      "settings": { "visible": true }
    },
    {
      "id": "hero",
      "type": "hero",
      "content": {
        "headline": "Votre Toiture Entre de Bonnes Mains",
        "subheadline": "Spécialiste de la rénovation et de l'étanchéité à Bordeaux depuis 15 ans.",
        "alignment": "left",
        "cta": [{ "text": "Demander un Devis Gratuit", "url": "#contact", "variant": "primary" }],
        "image": {
          "src": "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80",
          "alt": "Toiture Bordeaux"
        }
      },
      "settings": { "paddingTop": "xl", "paddingBottom": "xl" }
    },
    {
      "id": "features",
      "type": "features",
      "content": {
        "title": "Nos Services",
        "columns": 3,
        "features": [
          { "title": "Rénovation Complète", "description": "Remise à neuf de tuiles et ardoises.", "icon": "Home" },
          { "title": "Fuites & Urgences", "description": "Intervention rapide 7j/7.", "icon": "Droplets" },
          { "title": "Isolation", "description": "Économisez de l'énergie.", "icon": "Thermometer" }
        ]
      },
      "settings": { "backgroundColor": "white" }
    },
    {
      "id": "map",
      "type": "map",
      "content": {
        "title": "Zone d'Intervention",
        "address": "Bordeaux, France",
        "zoom": 12,
        "height": "400px"
      },
      "settings": { "visible": true }
    },
    {
      "id": "contact",
      "type": "contact",
      "content": {
        "title": "Contactez-nous",
        "subtitle": "Réponse sous 24h.",
        "email": "contact@toptoit.fr",
        "phone": "06 12 34 56 78",
        "address": "Bordeaux Centre",
        "hours": "Lun-Ven: 8h-18h"
      },
      "settings": { "backgroundColor": "gray" }
    },
    {
      "id": "footer",
      "type": "footer",
      "content": {
        "copyright": "© 2024 TopToit.",
        "socials": [
          { "platform": "facebook", "url": "#", "enabled": true }
        ]
      },
      "settings": { "backgroundColor": "dark" }
    }
  ]
}
```

## 🖱️ Frontend Visual Editing & State Management

When a user modifies the website via the Visual Editor (Frontend), the following process occurs:

1.  **Interaction**: The user clicks on text, images, or adds/removes a section via the Admin Panel UI.
2.  **State Update**: These actions trigger updates in the **Zustand Store** (`src/store/website.ts`).
3.  **Real-time JSON**: The global `LandingPageConfig` JSON object is updated immediately in memory.
4.  **No Code Changes**: **Crucially, no React code is modified.** The site is a pure rendering engine of the JSON configuration.
    *   *Example*: Changing a headline updates `config.sections[1].content.headline`, causing the `Hero` component to re-render with new data.
    *   *Example*: Adding a "Testimonials" section simply pushes a new object to the `sections` array in the JSON.
5.  **Persistence**: The final JSON can be saved or exported to persist the changes.

## Adding New Sections (Developer Only)

To extend the capability of the builder:
1.  **Schema**: Update `src/types/schema.ts`.
2.  **Component**: Create `src/components/sections/NewSection.tsx`.
3.  **Register**: Update `src/components/renderer/SectionRenderer.tsx`.
4.  **UI**: Update `src/components/admin/SectionPicker.tsx`.
