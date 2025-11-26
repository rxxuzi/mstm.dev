# Project Structure

Comprehensive guide to the mstm.dev codebase structure and architecture.

## Repository Overview

```
mstm.dev/
├── .github/              # GitHub workflows and configurations
├── .next/                # Next.js build output (gitignored)
├── data/                 # Generated project registry
│   └── projects.json    # Compiled metadata (generated)
├── docs/                 # Developer documentation (this directory)
├── node_modules/         # Dependencies (gitignored)
├── public/               # Static assets
├── scripts/              # Build and utility scripts
│   └── collect-metadata.ts
├── src/                  # Source code
│   ├── app/             # Next.js app directory
│   ├── components/      # Shared React components
│   ├── lib/             # Utilities and types
│   └── middleware.ts    # Next.js middleware
├── .gitignore
├── commitlint.config.js
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Source Structure

### `/src/app/`

Next.js 16 App Router directory containing all pages and routes.

```
src/app/
├── (pages)/              # Static pages with layout
│   ├── about/
│   ├── browse/
│   ├── contribute/
│   ├── docs/
│   ├── explore/
│   └── privacy/
├── content/              # User-contributed projects
│   ├── project-name-1/
│   │   ├── meta.json
│   │   └── page.tsx
│   ├── project-name-2/
│   └── ...
├── favicon.ico
├── globals.css
├── layout.tsx            # Root layout
├── loading.tsx           # Global loading state
├── not-found.tsx         # 404 page
├── opengraph-image.tsx   # OG image generator
├── page.tsx              # Homepage
├── robots.ts             # Robots.txt
└── sitemap.ts            # Sitemap generator
```

#### Route Groups

**`(pages)/`** - Route group for static pages

Routes without the group name in URL:
- `/about` → `(pages)/about/page.tsx`
- `/browse` → `(pages)/browse/page.tsx`

Shares layout from `(pages)/layout.tsx`

#### Content Directory

**`content/`** - Dynamic project routes

Each subdirectory becomes a route:
- `/content/project-name` → `content/project-name/page.tsx`

**Required files per project:**
- `meta.json` - Project metadata
- `page.tsx` - Project component

**Optional files:**
- `components/` - Project-specific components
- `utils/` - Project-specific utilities
- `styles/` - Project-specific styles

---

### `/src/components/`

Shared React components used across the application.

```
src/components/
├── ui/                   # UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── ContentToolbar.tsx    # Project page toolbar
├── Footer.tsx            # Site footer
├── Header.tsx            # Site header
├── ProjectCard.tsx       # Project display card
└── ...
```

**Component categories:**

**UI Primitives** (`ui/`) - Basic, reusable components
- Based on Radix UI
- Styled with Tailwind
- Fully accessible

**Layout Components** - Page structure
- Header, Footer, Navigation
- Consistent across site

**Feature Components** - Specific functionality
- ProjectCard, ContentToolbar
- Domain-specific logic

---

### `/src/lib/`

Utilities, types, and shared logic.

```
src/lib/
├── mstm/
│   ├── types.ts          # Project metadata types
│   ├── metadata.ts       # Metadata utilities
│   └── slugs.ts          # Reserved slugs
├── utils.ts              # General utilities
└── ...
```

**Type definitions:**
- `ProjectMetadata` - Project metadata schema
- `ProjectType` - Valid project types
- `ProjectWithPath` - Extended metadata with routing

**Utilities:**
- Metadata helpers
- String formatting
- Date handling
- Validation functions

---

### `/src/middleware.ts`

Next.js middleware for request handling.

Currently minimal - can be extended for:
- Redirects
- Rewrites
- Header manipulation
- Authentication (if needed)

---

## Configuration Files

### TypeScript Configuration

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@data/*": ["./data/*"]
    }
  }
}
```

**Path aliases:**
- `@/` - src root
- `@components/` - components directory
- `@lib/` - lib directory
- `@data/` - data directory

---

### ESLint Configuration

**`eslint.config.mjs`**

Strict ESLint configuration enforcing:
- TypeScript strict mode
- React hooks rules
- Next.js best practices
- Import organization
- No unused variables

See [CODING-STANDARDS.md](./CODING-STANDARDS.md) for details.

---

### Next.js Configuration

**`next.config.ts`**

Configuration for:
- TypeScript strict mode
- Image optimization
- Build output
- Webpack customizations

---

### Package Configuration

**`package.json`**

**Scripts:**
- `dev` - Development server (auto-runs collect)
- `build` - Production build (auto-runs collect)
- `start` - Production server
- `lint` - ESLint check
- `collect` - Generate metadata registry

**Dependencies:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI components

---

## Build System

### Metadata Collection

**`scripts/collect-metadata.ts`**

**Purpose:** Generate project registry from meta.json files

**Process:**
1. Scan `src/app/content/` for project directories
2. Read each `meta.json` file
3. Validate metadata against schema
4. Compile into `data/projects.json`

**Validation checks:**
- Required fields present
- Valid project type
- Authors is non-empty array
- Date format correct (yyyy-mm-dd)

**Output:** `data/projects.json`

```json
[
  {
    "slug": "project-name",
    "title": "...",
    "description": "...",
    "type": "tool|art|game|other",
    "category": "...",
    "tags": ["..."],
    "authors": ["..."],
    "mobile": boolean,
    "createdAt": "yyyy-mm-dd",
    "path": "/project-name",
    ...
  }
]
```

---

## Routing Architecture

### Static Routes

Defined by directory structure in `(pages)/`:

- `/` - Homepage
- `/about` - About page
- `/browse` - Browse all projects
- `/explore` - Search and filter
- `/contribute` - Contribution guide
- `/docs` - Documentation
- `/privacy` - Privacy policy

### Dynamic Routes

Projects in `content/` directory:

- `/content/[slug]` - Individual project pages
- Slug determined by directory name
- Metadata loaded from `meta.json`

### Reserved Slugs

**Cannot be used for projects:**

See `src/lib/mstm/slugs.ts` for complete list:

```typescript
export const RESERVED_SLUGS = [
  'about',
  'browse',
  'contribute',
  'docs',
  'explore',
  'privacy',
  // ... and more
]
```

**Why reserved:**
- Prevents routing conflicts
- Protects system routes
- Maintains URL stability

**Before creating a project:** Check if slug is reserved

---

## Data Flow

### Metadata Registry Flow

```
meta.json files
    ↓
collect-metadata.ts (validation)
    ↓
data/projects.json
    ↓
Browse/Explore pages (import)
    ↓
Display to users
```

### Project Loading Flow

```
User visits /content/project-name
    ↓
Next.js routes to content/project-name/page.tsx
    ↓
Page component renders
    ↓
ContentToolbar loads meta.json dynamically
    ↓
Project displays with metadata
```

---

## Component Architecture

### Page Components

**Static pages:**
```tsx
// (pages)/about/page.tsx
export default function AboutPage() {
  return <div>...</div>
}
```

**Content projects:**
```tsx
// content/project-name/page.tsx
'use client'  // If needs interactivity

export default function ProjectPage() {
  return <div>...</div>
}
```

### Layout Hierarchy

```
layout.tsx (root)
    ↓
(pages)/layout.tsx (static pages)
    ↓
(pages)/*/page.tsx
```

Or:

```
layout.tsx (root)
    ↓
content/[slug]/page.tsx
```

---

## Styling System

### Tailwind CSS v4

**Global styles:** `src/app/globals.css`

**Theme configuration:**
- Dark mode enforced
- Custom color palette
- Geist font family
- Consistent spacing scale

**Usage:**
- Utility-first approach
- Component-scoped styles
- Responsive design
- Dark mode optimized

---

## Asset Management

### Public Directory

```
public/
├── mstm.svg              # Logo
└── ...                   # Other static assets
```

**Served at root:**
- `/mstm.svg` → `public/mstm.svg`

**Best practices:**
- Use for assets needing specific URLs
- Optimize images before adding
- Use meaningful filenames
- Keep directory clean

---

## Type System

### Core Types

**`src/lib/mstm/types.ts`**

```typescript
export type ProjectType = 'tool' | 'art' | 'game' | 'other'

export interface ProjectMetadata {
  slug: string
  title: string
  description: string
  type: ProjectType
  category: string
  tags: string[]
  authors: string[]
  featured?: boolean
  mobile: boolean
  createdAt: string
  updatedAt?: string
  license?: string
}

export interface ProjectWithPath extends ProjectMetadata {
  path: string
}
```

### Type Safety

**Strict mode enabled:**
- No implicit any
- Strict null checks
- No unchecked indexed access

**Import and use types:**
```typescript
import type { ProjectMetadata } from '@lib/mstm/types'
```

---

## Build Process

### Development Build

```bash
npm run dev
```

**Steps:**
1. Run `npm run collect` (pre-dev script)
2. Validate all meta.json files
3. Generate data/projects.json
4. Start Next.js dev server
5. Enable hot module replacement

### Production Build

```bash
npm run build
```

**Steps:**
1. Run `npm run collect` (pre-build script)
2. Validate all meta.json files
3. Generate data/projects.json
4. Run ESLint
5. Compile TypeScript
6. Build Next.js production bundle
7. Optimize assets
8. Generate static pages

### Output

```
.next/
├── cache/
├── server/
├── static/
└── ...
```

**Deployment:** `.next/` directory contains all build artifacts

---

## Environment

### No Environment Variables

The project runs entirely client-side with no environment variables needed for development.

**Configuration is in code:**
- Site metadata in `layout.tsx`
- Build config in `next.config.ts`
- No secrets or API keys

---

## Testing Structure

### Current Testing

**Manual testing required:**
- Run `npm run lint`
- Run `npm run collect`
- Test in browser
- Check console for errors

### Future Testing

Structure supports:
- Unit tests (utilities, components)
- Integration tests (page flows)
- E2E tests (user journeys)

---

## Documentation Structure

### Internal Documentation

**`docs/` directory:**
- Developer guides
- Specifications
- Conventions
- Workflows

**See:** [README.md](./README.md) for documentation index

### Code Documentation

**JSDoc comments for:**
- Complex functions
- Public APIs
- Non-obvious logic

---

## Extension Points

### Adding New Features

**New static page:**
1. Create `(pages)/new-page/page.tsx`
2. Add to navigation if needed

**New content project:**
1. Create `content/project-name/`
2. Add `meta.json`
3. Create `page.tsx`
4. Run `npm run collect`

**New component:**
1. Create in `src/components/`
2. Follow naming conventions
3. Use TypeScript strictly
4. Export for reuse

**New utility:**
1. Create in `src/lib/`
2. Define types
3. Write pure functions
4. Export for import

---

## File Naming Conventions

### React Components

- `PascalCase.tsx` for components
- `page.tsx` for routes
- `layout.tsx` for layouts

### Utilities

- `kebab-case.ts` for utilities
- `types.ts` for type definitions

### Configuration

- `kebab-case.config.ts` for configs
- `.json` for data files

---

## Import Organization

**Order:**
1. React/Next.js imports
2. Third-party libraries
3. Internal utilities (`@lib`)
4. Components (`@components`)
5. Relative imports
6. Styles

**Use path aliases:**
```typescript
import { ProjectMetadata } from '@lib/mstm/types'
import { ProjectCard } from '@components/ProjectCard'
```

---

## Security Considerations

### Client-Side Only

**All code runs in browser:**
- No server-side secrets
- No sensitive data in code
- All code visible to users

### Safe Practices

- Sanitize user input
- No `dangerouslySetInnerHTML`
- Validate all data
- Use TypeScript for safety

---

## Performance Considerations

### Bundle Size

**Keep small:**
- Avoid heavy dependencies
- Tree-shake imports
- Lazy load when appropriate

### Runtime Performance

**Optimize:**
- Minimize re-renders
- Use memoization judiciously
- Profile with React DevTools

---

## Deployment

### Automatic Deployment

**On merge to main:**
- Runs build
- Deploys to production
- Updates live site

**Platform:** Vercel (configured)

---

## Summary

**Key directories:**
- `src/app/` - Routes and pages
- `src/components/` - Shared components
- `src/lib/` - Utilities and types
- `scripts/` - Build scripts
- `docs/` - Documentation

**Key files:**
- `data/projects.json` - Project registry (generated)
- `meta.json` - Project metadata
- `tsconfig.json` - TypeScript config
- `eslint.config.mjs` - ESLint rules

**Follow this structure, and the codebase remains organized and maintainable.**

---

**Need to find something?** Use this guide as a reference for navigating the codebase.
