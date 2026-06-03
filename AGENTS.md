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
- Lazy load heavy components (calculators, CookieConsent) via `next/dynamic`
- `lang="fr"` is hardcoded on `<html>` in `layout.tsx` with `suppressHydrationWarning` — this is an acceptable compromise to avoid a FOUC flash. EN pages have `hreflang` tags for Google. Do NOT add a `LANG_SCRIPT`; it causes hydration mismatches.
- **Always** use `dynamic()` for `CookieConsent` in `app/[lang]/layout.tsx` — it splits the bundle and prevents `vanilla-cookieconsent` from bloating the main chunk
- **Never** split message catalogs by language — fr.json + en.json = ~120KB total. Async loading would require async `useMessages()` changes across the entire codebase for negligible gain
- **Always** add new external domains to `scripts/inject-preconnect.js` AND `docs/process.md` Section 19 — the post-build script injects `<link rel="preconnect">` + cache-busting `<meta http-equiv>` tags into all HTML files
- **Inline critical CSS**: `scripts/inline-css.js` embeds all CSS files into HTML `<head>`, eliminating render-blocking requests on mobile. Runs automatically in `build:ftp`.
- `.visually-hidden` utility class exists in `globals.css` for SEO-only elements (screen-reader accessible, visually hidden)
- **o2switch CDN / FTP deploy rules**:
  - **Never** delete the `_next/` directory during FTP deploy. The CDN caches HTML referencing old chunks; deleting them causes 404s and React hydration error #418. Old chunks must remain on disk.
  - The post-build script injects `<meta http-equiv="Cache-Control" content="no-cache...">` into every HTML file as a fallback for CDNs that ignore Apache headers.
  - `layout.tsx` contains a client-side hydration recovery script: if React error #418 is detected, it hard-reloads the page with `?__nc=<timestamp>` to bypass stale CDN cache.

### 8. Mobile
- Breakpoint: 950px (mobile menu)
- Grids collapse: 1000px → 2-col, 720px → 1-col
- All pages tested on mobile viewport

## Build & Deploy
```bash
# Dev build (Vercel)
npm run build

# Static export for o2switch FTP
npm run build:ftp

# Deploy to dev (sc4) via FTP
FTP_HOST=... FTP_USER=... FTP_PASSWORD=... FTP_ROOT=public_html LOCAL_ROOT=out python3 scripts/ftp_sync.py

# Deploy to prod (sc3) via SSH
./scripts/deploy_sc3_ssh.sh              # build + deploy
./scripts/deploy_sc3_ssh.sh --dry-run    # preview only
./scripts/deploy_sc3_ssh.sh --skip-build # skip build, use existing out/
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

## Le Référentiel — Content Feature

**Added:** June 2026  
**Purpose:** SEO content hub — 90 articles (in lots of 10) targeting long-tail queries around professional training regulation, funding, certification. French-only initially.

### Architecture

```
src/content/referentiel/   ← 10 JSON article files (one per article, lot 1)
src/data/
  referentiel-meta.json     ← auto-generated by build script (appears at build time)
  referentiel-meta.ts       ← lightweight type + REFERENTIEL_META array (used by listing page)
  referentiel.ts            ← static imports of all JSONs + REFERENTIEL array (used by detail page)
scripts/generate-referentiel-meta.js  ← strips content field, writes referentiel-meta.json
```

### Data model (per article)

```typescript
{
  slug: string;           // URL-safe, unique
  title: string;          // H1
  cible: string;          // e.g. "Organismes de formation"
  thematique: string;     // e.g. "Certification", "Financement"
  tags: string[];         // e.g. ["Qualiopi", "audit", "RNQ"]
  shortDescription: string; // 1-2 lines for listing sidebar
  metaDescription: string;  // ~155 chars for SEO
  content: string;        // full markdown body
  order: number;          // display order (ascending)
}
```

### Pages

| Path | Purpose |
|------|---------|
| `/fr/referentiel/` | Listing — search bar, cible/thématique dropdowns, tag pills, sidebar article list |
| `/fr/referentiel/[slug]/` | Detail — sidebar (same filters, current highlighted), markdown content, share buttons |
| `/admin` → Référentiel tab | CMS CRUD (dev only, API disabled in production) |

### Adding new articles (lot 2-9)

1. Create JSON files in `src/content/referentiel/`
2. Run `node scripts/generate-referentiel-meta.js` to regenerate the meta JSON
3. Manually update `src/data/referentiel.ts` — add import + add to REFERENTIEL array
4. Run `npm run build:ftp` to verify static export
5. Deploy

The API route at `src/app/api/referentiel/route.ts` can auto-regenerate the TS imports file when saving via CMS, but this only works in dev (checkDev guard).

### Filtering (client-side, via URL searchParams)

Filters persist across navigation via query params: `?cible=X&thematique=Y&tag=Z&q=search`. The detail page reads these and passes them to the shared `ReferentielSidebar` component so the filtered list follows the user.

### Build pipeline

`scripts/build-ftp.js` runs `generate-referentiel-meta.js` before `next build` (same pattern as insights).
