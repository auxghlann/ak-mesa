# Project specific rules

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4.
- **Backend/Data**: Supabase.
- **AI/Agent**: Langchain (`@langchain/core`, `@langchain/groq`), Upstash.
- **Code Quality**: Oxlint.
- **Deployment**: Vercel (with `@vercel/analytics`).
- **Testing**: vitest

## Design System (Prism Portfolio)
- **Aesthetics**: Google's Material You inspired. Focus on high legibility, generous whitespace, and friendly, rounded interactions.
- **Colors**: Use semantic Tailwind classes (e.g., `bg-primary`, `text-on-surface`, `bg-surface-container`).
  - *Primary*: `#4285f4` (Google Blue)
  - *Secondary*: `#34a853` (Google Green)
  - *Tertiary*: `#ea4335` (Google Red)
  - *Quaternary*: `#fbbc05` (Google Yellow)
  - *Surface*: `#f8f9fa`, *Surface Container*: `#ffffff`.
- **Typography**: `Manrope` font. Use defined text styles like `font-headline-xl`, `font-body-lg`, `font-label-md`.
- **Shapes**: `24px` border-radius for cards and large elements. Pill-shaped buttons (`rounded-full`). Flat elevation (`shadow-sm` or `shadow-md`).

## Architecture & Code Conventions
- **Components**: Use React Functional Components. Stick to modern React patterns (Hooks).
- **Styling**: Exclusively use TailwindCSS. Follow the existing custom utility classes defined in the design system (e.g., `max-w-container-max`, `py-section-gap`, `px-margin-mobile`).
- **API & Agents**: All backend logic, AI services, and Langchain tools belong in the `api/` directory. Use `zod` for schema validation when defining Langchain tools (e.g., in `api/services/agent/`). For testing, use vitest and add it on the `api/tests/`.
- **Supabase**: Use the singleton client from `src/lib/supabase.ts` for all database interactions.
- **Markdown Rendering**: Use `react-markdown` with `remark-gfm` and `rehype-raw` to display rich content (e.g., in project details).

## General Development Rules
- Strictly type all components, props, and API responses using TypeScript.
- Follow the `DESIGN.md` guidelines strictly for any new UI element or page to maintain visual consistency.
