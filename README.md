# Modern React Landing Page Builder

A professional, fully customizable landing page builder using React, TypeScript, Tailwind CSS, and JSON configuration.

## Features

- **Modular Architecture:** Section-based design (Hero, Features, Testimonials, etc.).
- **JSON Driven:** Entire page content and settings controlled by a strict JSON schema.
- **Admin Interface:**
  - Secure Login (Mock).
  - Drag-and-Drop Section Reordering.
  - Real-time JSON Properties Editor with Validation.
  - Live Preview (Desktop, Tablet, Mobile).
- **Performance:** Lazy loaded sections, optimized assets.
- **SEO Ready:** Dynamic meta tags and Open Graph support.

## Project Structure

```
src/
├── admin/           # Admin specific logic
├── components/
│   ├── admin/       # Admin UI components (Editor, List)
│   ├── renderer/    # Dynamic Section Renderer
│   ├── sections/    # Individual Section Components
│   └── ui/          # Generic UI components
├── data/            # Default Configuration
├── layouts/         # Layout wrappers (Public, Admin)
├── pages/           # Route Pages
├── store/           # Zustand State Management
├── types/           # TypeScript Types & Zod Schemas
└── lib/             # Utilities
```

## Getting Started

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Start Development Server:**
    ```bash
    pnpm dev
    ```

3.  **Run Tests:**
    ```bash
    pnpm test
    ```

## Usage

### Public View
Navigate to `http://localhost:5173/` to see the generated landing page.

### Admin Interface
1.  Navigate to `http://localhost:5173/login`.
2.  Login with any email and password: `password`.
3.  Use the **Drag Handle** on the left to reorder sections.
4.  Click a section to edit its JSON properties on the right.
5.  Toggle visibility with the **Eye** icon.
6.  Add new sections with the **+** button.

## Configuration

The core data model is defined in `src/types/schema.ts`.
The default configuration is in `src/data/default-config.ts`.

### Adding a New Section
1.  Create the component in `src/components/sections/`.
2.  Define its Zod schema in `src/types/schema.ts`.
3.  Add it to the `SectionSchema` discriminated union.
4.  Update `SectionRenderer` to handle the new type.

## Tech Stack
-   React 19
-   TypeScript
-   Tailwind CSS 4
-   Vite
-   Zustand
-   React Router DOM
-   dnd-kit
-   Zod
-   React Hook Form
# base-landing-page
# base-landing-page
# base-landing-page
