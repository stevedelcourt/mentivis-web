<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mentivis Web — Project Documentation

## Architecture Overview

Static Next.js 16 export with bilingual routing (`/fr/` and `/en/`). No API routes, no database — pure static marketing site.

## Folder Structure

```
src/
  app/
    layout.tsx              # Root layout (minimal)
    globals.css             # Global styles, design tokens, responsive utilities
    [lang]/
      layout.tsx            # Locale layout — metadata, GTM, cookie consent
      page.tsx              # Home page
      about/page.tsx        # About page
      contact/page.tsx      # Contact form
      enterprise/page.tsx   # Enterprise solutions
      of/page.tsx           # Organismes de formation
      solutions/page.tsx    # Digital/AI solutions
      legal/page.tsx        # Mentions légales
      privacy/page.tsx      # Politique de confidentialité
      terms/page.tsx        # CGU
      cookies/page.tsx      # Politique de cookies
      resources/page.tsx    # Placeholder
      opco/page.tsx         # Placeholder
      score-formation/page.tsx      # Score Formation placeholder
      careers/page.tsx      # Placeholder
  components/
    layout/
      PageShell.tsx         # Wraps every page: TopNav + Footer + page-shell
    ui/
      PageHero.tsx          # Reusable page hero with eyebrow/title/lead
      SectionHeader.tsx     # Section eyebrow + title + lead
      PillarCard.tsx        # Card with number, title, body, items
      DualEntryCard.tsx     # Home entry card (3 tones)
      FinalCTA.tsx          # Final call-to-action section
      Reveal.tsx            # Scroll-reveal wrapper
      ComingSoon.tsx        # Placeholder page content
      LegalPageLayout.tsx   # Shared legal page structure
    TopNav.tsx              # Fixed header with nav pill + lang switcher
    Footer.tsx              # Full footer with newsletter + links
    Logo.tsx                # SVG logo
    CookieConsent.tsx       # vanilla-cookieconsent integration
  lib/
    messages.ts             # useMessages() hook, useLang() hook, getMessages()
    config.ts               # Site constants (email, phone, address, GTM_ID)
  messages/
    fr.json                 # French translations
    en.json                 # English translations
public/
  favicon.ico, favicon-*.png, apple-touch-icon.png, android-chrome-*.png
  logo-noir.svg
  mathias.costes.webp
  site.webmanifest
```

## i18n System

### How translations work

- All UI text lives in `src/messages/fr.json` and `src/messages/en.json`
- Both files share the **exact same structure** — only values differ
- Components consume translations via `useMessages()` from `src/lib/messages.ts`

```tsx
import { useMessages } from "@/lib/messages";

export default function MyPage() {
  const { t, lang } = useMessages();
  return <h1>{t.nav.home}</h1>;
}
```

### Adding a new translation key

1. Add the key to **both** `fr.json` and `en.json` with the same path
2. Use it in components via `t.your.new.key`

### Language switching

- TopNav has a FR/EN toggle that swaps the `/fr/` or `/en/` prefix in the current URL
- Static export generates both `/fr/*` and `/en/*` routes
- Default redirect middleware sends `/` → `/fr/`

## How to Add a New Page

### 1. Create the page file

```tsx
// src/app/[lang]/my-page/page.tsx
"use client";
import PageShell from "@/components/layout/PageShell";
import { useMessages } from "@/lib/messages";

export default function MyPage() {
  const { t, lang } = useMessages();
  return (
    <PageShell>
      <section className="section">
        <div className="container">
          <h1 className="t-display">{lang === "fr" ? "Ma page" : "My page"}</h1>
        </div>
      </section>
    </PageShell>
  );
}
```

### 2. Add translations (if needed)

Add keys to both `fr.json` and `en.json` under a new namespace:

```json
{
  "myPage": {
    "title": "Ma page"
  }
}
```

### 3. Add to navigation (optional)

Edit `src/components/TopNav.tsx` `links` array to include the new route.

## Adding a Placeholder Page

For pages that are not ready yet, use the shared `ComingSoon` component:

```tsx
"use client";
import PageShell from "@/components/layout/PageShell";
import ComingSoon from "@/components/ui/ComingSoon";
import Reveal from "@/components/Reveal";
import { useMessages } from "@/lib/messages";

export default function MyPlaceholderPage() {
  const { lang } = useMessages();
  return (
    <PageShell>
      <section style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <Reveal>
            <h1 className="t-display">My Page Title</h1>
          </Reveal>
          <ComingSoon />
        </div>
      </section>
    </PageShell>
  );
}
```

## Design Tokens (CSS Variables)

All design tokens are defined in `src/app/globals.css`:

| Token | Value |
|-------|-------|
| `--m-purple` | `#000776` |
| `--m-ink` | `#101114` |
| `--m-ink-2` | `#2a2c34` |
| `--m-ink-3` | `#686b82` |
| `--m-ink-4` | `#9497a9` |
| `--m-line` | `#dedee5` |
| `--m-bg-soft` | `#fafafd` |
| `--f-display` | IBM Plex Sans |
| `--f-mono` | JetBrains Mono |

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `max-width: 1000px` | 2-col grids collapse to 1-col, solution rows stack |
| `max-width: 900px` | Section padding reduces, gutter shrinks to 20px |
| `max-width: 720px` | Burger menu appears, contact CTA hides, grids go single column |

## Deployment

### Local build
```bash
npm run build
```

### FTP deploy
```bash
# Set env vars, then:
python3 scripts/ftp_sync.py
```

Or with env vars inline:
```bash
FTP_HOST=sc4bovu7233.universe.wf FTP_USER=sc4bovu7233 FTP_PASSWORD='...' FTP_ROOT=public_html LOCAL_ROOT=out python3 scripts/ftp_sync.py
```

### GitHub Actions
- `.github/workflows/deploy.yml` deploys to both Vercel and FTP on push to `main`

## Security Notes

- **No hardcoded secrets** in source code
- FTP credentials read from environment variables only
- GTM ID is client-side by design (cookie consent gated)
- `.env.local` and `.env.example` are gitignored

## Performance Notes

- Static export — all pages prerendered at build time
- `images.unoptimized: true` in `next.config.ts` (required for static export)
- Google Fonts loaded via `<link>` (not JS)
- Cookie consent loads asynchronously
