# Mentivis Refactor - Skill

## Overview

This skill defines the complete refactor protocol for the Mentivis Next.js static site. Use this when performing codebase audits, cleanups, or structural improvements.

## Architecture

Static Next.js 16 export with bilingual routing (`/fr/` and `/en/`). No API routes, no database.

```
src/
  app/
    [lang]/           # All pages (dynamic route for FR/EN)
    globals.css       # Design tokens, responsive utilities
    layout.tsx        # Root layout
    not-found.tsx     # 404 page
  components/
    layout/           # PageShell, structural wrappers
    ui/               # Small reusable UI components
    *.tsx             # Page-level components
  lib/                # Utilities, hooks, config
  messages/           # fr.json + en.json (identical keys)
public/               # Static assets
```

## Refactor Rules

### 1. Code Quality
- **No inline style duplication**: Extract repeated button/link patterns to `<ButtonLink>` component
- **No duplicated functions**: `encodeEntities`, `formatEuro` → `src/lib/utils.ts`
- **No dead code**: Remove unused components (`ComingSoon`), unused assets, dead CSS
- **Consistent naming**: PascalCase for components, camelCase for functions/variables, kebab-case for files

### 2. Components Hierarchy
```
layout/
  PageShell.tsx       # TopNav + children + PreFooterCTA + Footer
  TopNav.tsx          # Fixed header with nav pill + lang switcher
  Footer.tsx          # Full footer (gradient animated bg)
ui/
  ButtonLink.tsx      # Primary + outline + ghost variants
  ContactSidebar.tsx  # Mathias Costes card (reused on contact + meeting)
  PageHero.tsx        # Standard hero with eyebrow/title/lead
  SectionHeader.tsx   # Eyebrow + title + lead
  PillarCard.tsx      # Numbered pillar card
  DualEntryCard.tsx   # Home entry cards (3 tones)
  FinalCTA.tsx        # Dark CTA section
  PreFooterCTA.tsx    # Light CTA before footer
  Reveal.tsx          # Scroll-reveal wrapper
```

### 3. Routing & Links
- All internal links use `/${lang}/` prefix
- Footer logo links to `/${lang}/`
- No hardcoded `/fr/` or `/en/` in components (use `lang` prop)
- Cookie consent privacy links point to `/${lang}/privacy`

### 4. Bilingual (FR/EN)
- All UI strings live in `src/messages/fr.json` and `src/messages/en.json`
- Both files share **exact same structure** — only values differ
- No hardcoded strings in components
- To add a page: create `[lang]/page.tsx`, add keys to both JSON files

### 5. Security
- GTM ID and HubSpot IDs are client-side by design (no secrets)
- No hardcoded passwords, API keys, or credentials in source
- FTP credentials only in `.env.local` (gitignored)

### 6. Calculator Components (Score + OPCO)
- Shared CTA logic extracted to `useCalculatorCTA()` hook
- Shared PDF export to `exportCalculatorPDF()` utility
- Shared dark card styles consolidated in `globals.css`
- Component-specific styles in `.css` files, shared styles in `globals.css`

### 7. Performance
- Images: use `next/image` with proper width/height
- Static export: `images.unoptimized: true` in `next.config.ts`
- Lazy load heavy components (calculators)
- Minimize render-blocking resources

### 8. Mobile
- Breakpoint: 950px (mobile menu)
- Grids collapse: 1000px → 2-col, 720px → 1-col
- All pages tested on mobile viewport

## Build & Deploy
```bash
npm run build
FTP_HOST=... FTP_USER=... FTP_PASSWORD=... FTP_ROOT=public_html LOCAL_ROOT=out python3 scripts/ftp_sync.py
```

## Common Fixes Checklist
- [ ] `encodeEntities()` → import from `lib/utils.ts`
- [ ] `formatEuro()` → import from `lib/utils.ts`
- [ ] Footer logo `href="/"` → `href={\`/${lang}/\`}`
- [ ] Cookie consent privacy link → `/${lang}/privacy`
- [ ] Button styles → use `<ButtonLink>` component
- [ ] Contact sidebar → use `<ContactSidebar>` component
- [ ] Delete unused assets: `score2.webp`, unused `site-images/`
- [ ] Remove `ComingSoon.tsx` if unused
