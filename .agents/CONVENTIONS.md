# Coding Conventions & Best Practices

## General
- Use **TypeScript** for all code. Strict mode is enabled.
- Use **functional components** with hooks.
- Prefer **named exports** over default exports.

## Styling
- Use **Tailwind CSS** exclusively.
- Use `clsx` and `tailwind-merge` for conditional classes (via `cn` utility).
- Follow Mobile-First approach.

## State Management
- Use **Zustand** for global client state.
- Use **React Query** (if needed) or native `fetch` with custom hooks for API.

## Accessibility (WCAG 2.1)
- All interactive elements must have `aria-label` or visible label.
- Images must have `alt` text.
- Color contrast must meet AA standard.
- Keyboard navigation must be fully supported (focus management).

## SEO
- Use Semantic HTML (`<section>`, `<article>`, `<nav>`, `<footer>`).
- All pages must have unique `title` and `meta description`.
- Implement Open Graph tags.

## Architecture
- `src/components/ui`: Primitive generic components (Button, Input).
- `src/components/sections`: Business logic sections (Hero, Features).
- `src/components/admin`: Admin-specific components.
- `src/layouts`: Page layouts (PublicLayout, AdminLayout).
- `src/lib`: Utilities and helpers.
- `src/types`: TypeScript definitions and Zod schemas.
