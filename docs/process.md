# Mentivis — Process & Architecture Documentation

## 1. Overview

Dual-host architecture: static frontend on o2switch, serverless backend on Vercel.

## 2. Dual-Host Architecture

### 2.1 Frontend (Static) — o2switch
- **Dev**: `sc4bovu7233.universe.wf`
- **Prod**: `sc3bovu7233.universe.wf`
- **Future**: `mentivis.com`, `www.mentivis.com`
- Built with `npm run build:ftp` (static export, API routes stripped, `trailingSlash: true`)
- Deployed via `scripts/ftp_sync.py`

### 2.2 Backend (Serverless) — Vercel
- **URL**: `https://mentivis-web.vercel.app`
- **Purpose**: API routes + middleware (Edge runtime)
- **Visibility**: Hidden from public (see Section 3)
- Deployed via Git push (GitHub integration)

## 3. Hiding Vercel Domain

### 3.1 Why
We do not want `mentivis-web.vercel.app` to be indexed by Google or accessible to visitors. The Vercel deployment exists solely to host serverless functions.

### 3.2 How
1. **`public/robots.txt`** — `Disallow: /` blocks all crawlers
2. **`X-Robots-Tag: noindex`** header — added via `next.config.ts` on all routes
3. **`src/middleware.ts`** — returns `403 Forbidden` for any `*.vercel.app` request that is NOT `/api/*`
4. **API routes remain public by design** — they are protected by other means (see Section 4)

### 3.3 Testing
```bash
curl -I https://mentivis-web.vercel.app/fr         # Expect 403
curl https://mentivis-web.vercel.app/api/health    # Expect 200 { status: "ok" }
```

## 4. API Security

### 4.1 Authentication
All API routes (except `/api/health`) require:
```
Authorization: Bearer <INTERNAL_TOKEN>
```

The token is:
- **Server-side**: stored in `process.env.INTERNAL_TOKEN` (Vercel env var)
- **Client-side**: hardcoded in `src/lib/hubspot.ts` (public by design, since the browser must send it)

The token is public by necessity (the client must authenticate to Vercel), but the API is protected by:
1. CORS (only allowed origins)
2. Rate limiting (5 req/min/IP)
3. Hidden Vercel domain (403 for all pages)

### 4.2 CORS
Allowed origins (hardcoded in API routes):
- `http://sc4bovu7233.universe.wf`
- `https://sc4bovu7233.universe.wf`
- `http://sc3bovu7233.universe.wf`
- `https://sc3bovu7233.universe.wf`
- `http://mentivis.com`
- `https://mentivis.com`
- `http://www.mentivis.com`
- `https://www.mentivis.com`

### 4.3 Rate Limiting
- In-memory per-instance rate limiter
- Window: 1 minute
- Max: 5 requests per IP per window
- **Limitation**: resets when Vercel spins up a new instance. For persistent rate limiting, use Vercel KV.

## 5. GTM by Environment

### 5.1 Why
The GTM container `GTM-PM93CCQL` contains tags from the old WordPress site (Brevo, WonderPush, gtranslate). We do NOT want these injected on the dev environment.

### 5.2 How
GTM is conditionally loaded based on `NEXT_PUBLIC_GTM_ID`:
- **Dev / FTP builds**: `NEXT_PUBLIC_GTM_ID` is NOT set → GTM script is omitted from the HTML
- **Vercel builds**: `NEXT_PUBLIC_GTM_ID` is set via GitHub Actions secret → GTM script is included

In `src/app/[lang]/layout.tsx`:
```tsx
{process.env.NEXT_PUBLIC_GTM_ID && (
  <Script id="gtm-script" strategy="afterInteractive">...</Script>
)}
```

### 5.3 Prod Transition
When switching `mentivis.com` to the Next.js site, set `NEXT_PUBLIC_GTM_ID=GTM-PM93CCQL` in the Vercel dashboard (or create a new clean container).

## 6. Apache / o2switch Configuration

### 6.1 `.htaccess`
Key directives:
- `DirectoryIndex index.html` — serves `index.html` for directory requests
- `Options -MultiViews` — prevents Apache from serving `fr.html` instead of `fr/index.html`
- `RewriteRule` for directory → `index.html` (optional, DirectoryIndex handles it)
- Cache headers for static assets (1 year) and no-cache for index files

### 6.2 FTP Cleanup (Required After Structural Changes)
**Our FTP script does NOT delete old files.** After any structural change (e.g. moving from `fr.html` to `fr/index.html`), you MUST manually clean the server:

1. Connect to FTP:
```bash
FTP_HOST=sc4bovu7233.universe.wf FTP_USER=sc4bovu7233 FTP_PASSWORD=... python3 scripts/ftp_sync.py
```

2. Delete conflicting files at the root:
```
fr.html
en.html
index.html   (if it was manually copied from an old build)
```

3. Verify `fr/` and `en/` directories contain the latest `index.html`

4. Clear browser cache / hard refresh after deploy

## 7. Forms & HubSpot Integration

### 7.1 Contact Form (`/contact`) — Vercel Relay
The contact form uses our custom React form. Submissions go through Vercel before reaching HubSpot.

**Flow:**
```
Visitor (o2switch) → POST /api/submit-to-hubspot (Vercel) → POST api.hsforms.com (HubSpot)
```

**Benefits:**
- HubSpot Portal ID is private (server-side only)
- Rate limiting and validation at the Vercel layer
- Honeypot anti-spam check
- CORS protection

### 7.2 Careers Form (`/careers`) — HubSpot Embed
The careers form uses the **native HubSpot iframe embed** (`hbspt.forms.create`). This is required because:
- File upload (CV) is not supported by the HubSpot Forms API v3
- The iframe handles file storage and virus scan natively

### 7.3 Request Format (Contact Relay)
```bash
curl -X POST https://mentivis-web.vercel.app/api/submit-to-hubspot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <INTERNAL_TOKEN>" \
  -H "Origin: https://mentivis.com" \
  -d '{
    "formId": "71a2e6a5-1ebe-46ea-9cdf-fe793b95e935",
    "fields": {
      "firstname": "Jean",
      "lastname": "Dupont",
      "email": "jean@example.com",
      "phone": "+33 1 23 45 67 89",
      "message": "Mon projet..."
    },
    "context": {
      "pageUri": "https://mentivis.com/fr/contact",
      "pageName": "Contact"
    },
    "honeypot": ""
  }'
```

### 7.4 Response
Success:
```json
{ "success": true, "hubspot": { ... } }
```

Error:
```json
{ "success": false, "error": "..." }
```

## 8. Health Check (`/api/health`)

No auth required. Returns:
```json
{ "status": "ok", "timestamp": 1234567890 }
```

Use this from the o2switch frontend to verify Vercel API connectivity.

## 9. Environment Variables

### 9.1 Local (`mentivis-web/.env.local`)
```
# --- FTP Dev (o2switch) ---
FTP_HOST=sc4bovu7233.universe.wf
FTP_USER=sc4bovu7233
FTP_PASSWORD=...

# --- FTP Prod (o2switch) ---
FTP_HOST_PROD=sc3bovu7233.universe.wf
FTP_USER_PROD=sc3bovu7233
FTP_PASSWORD_PROD=...

# --- HubSpot (public, used by frontend for careers iframe) ---
NEXT_PUBLIC_HUBSPOT_FORM_ID=71a2e6a5-1ebe-46ea-9cdf-fe793b95e935
NEXT_PUBLIC_HUBSPOT_CAREERS_FORM_ID=78954872-9038-4a85-8420-ae295c46f90b

# --- Vercel API Security (server-side only) ---
INTERNAL_TOKEN=...

# --- HubSpot (private, server-side only, Vercel only) ---
HUBSPOT_PORTAL_ID=49558612
```

### 9.2 Vercel Dashboard (Production)
Must be set manually in the dashboard:
- `INTERNAL_TOKEN` — server-side auth token (used by `/api/submit-to-hubspot`)
- `HUBSPOT_PORTAL_ID` — private, server-side only (e.g., `49558612`)
- `NEXT_PUBLIC_HUBSPOT_FORM_ID` — public, used by frontend
- `NEXT_PUBLIC_HUBSPOT_CAREERS_FORM_ID` — public, used by frontend
- `NEXT_PUBLIC_GTM_ID` — public, GTM container ID (e.g., `GTM-PM93CCQL` for prod)

## 10. Deployment Workflow

### 10.1 Local → o2switch (Dev)
```bash
cd mentivis-web
npm run build:ftp
python3 scripts/ftp_sync.py
```

**After deploy:**
1. Check that `fr/` and `en/` directories exist on the server
2. Delete any `fr.html`, `en.html` at the root if they exist from old builds
3. Test `/fr/` and `/en/` in browser (hard refresh)

### 10.2 Git → Vercel
```bash
git add -A
git commit -m "..."
git push origin main
```
Vercel auto-deploys from GitHub.

### 10.3 Prod (o2switch)
Same as dev but use prod FTP credentials. Ensure `NEXT_PUBLIC_GTM_ID` is set in Vercel for the prod domain.

### 10.4 All-in-One Deploy Script (`scripts/deploy.sh`)
Combines git commit/push + optional Vercel CLI + FTP upload in one command.

**Usage:**
```bash
./scripts/deploy.sh              # git push + FTP sc4 (dev)
./scripts/deploy.sh --prod      # git push + FTP sc3 (prod)
./scripts/deploy.sh --vercel    # git push + manual Vercel deploy
./scripts/deploy.sh --prod --vercel  # git push + FTP sc3 + Vercel
```

Or via npm:
```bash
npm run deploy              # same as ./scripts/deploy.sh
```

### 10.5 Test Result (2026-05-02)

**Executed:** `./scripts/deploy.sh` (default: git push + FTP sc4)

**Result:**
- Git commit: `b5d5cc7` — "Deploy 2026-05-02 21:55"
- Git push: successful to `origin main`
- FTP build: `npm run build:ftp` — success (866 files generated)
- FTP upload: `866/866 files uploaded successfully` to `sc4bovu7233.universe.wf`
- Verification: `http://sc4bovu7233.universe.wf/fr` returns `200 OK`

**Conclusion:** Script works as expected. Git → FTP sc4 flow is fully functional.

**What it does:**
1. `git add -A` + auto commit (`"Deploy YYYY-MM-DD HH:MM"`) + `git push origin main`
2. GitHub push triggers Vercel auto-deploy (if connected)
3. Optional `vercel --prod` if `--vercel` flag passed
4. `npm run build:ftp` + upload to FTP (sc4 default, sc3 if `--prod`)

**FTP credentials** are hardcoded in the script (`FTP_PASSWORD=RoxanStevenMathias2024`).

## 11. FTP Sync Script (`scripts/ftp_sync.py`)

### 11.1 Robustness Features
The FTP sync script includes multiple safeguards against silent failures:

- **Retry logic**: each file gets 2 attempts initially; failed files get a second pass with 3 retries
- **Error reporting**: every failed upload prints to stderr with the exact error message — no more silent skips
- **Progress tracking**: shows `current/total` for every file uploaded
- **CSS verification**: after upload, scans all HTML files for `_next/static/chunks/*.css` references and checks they exist on the server; warns by name if any are missing
- **Exit code 1** if any files still fail after all retries

### 11.2 Common Issue — Missing CSS After Deploy
If the site loads without styles (console shows `404` on `.css` chunks), the most likely cause is a transient FTP failure during upload. The script now detects and reports this, but you can also verify manually:

```bash
# Check that referenced CSS files exist on server
curl -I https://sc4bovu7233.universe.wf/_next/static/chunks/0b77fyp3h9pug.css
```

If missing, re-run `python3 scripts/ftp_sync.py` — the retry logic will re-upload them.

### 11.3 FTP Cleanup (Required After Structural Changes)
**Our FTP script does NOT delete old files.** After any structural change (e.g. moving from `fr.html` to `fr/index.html`), you MUST manually clean the server:

1. Connect to FTP:
```bash
FTP_HOST=sc4bovu7233.universe.wf FTP_USER=sc4bovu7233 FTP_PASSWORD=... python3 scripts/ftp_sync.py
```

2. Delete conflicting files at the root:
```
fr.html
en.html
index.html   (if it was manually copied from an old build)
```

3. Verify `fr/` and `en/` directories contain the latest `index.html`

4. Clear browser cache / hard refresh after deploy

## 11. Image Organization

All images go in `public/images/` with sub-folders:

```
public/images/
  insights/     # Article hero images
  team/         # Team portraits (Mathias, Marie, etc.)
  heroes/       # Page hero backgrounds
  guides/       # Guide illustrations (BPF, CPF, POEI, etc.)
  ui/           # Logo, favicons, interface elements
```

**Format**: AVIF primary, webp/jpg fallback in the same folder.
**Reference in code**: `/images/team/mathias.costes.avif`

## 12. Standalone Iframe Pages (`mentivis-solutions`)

### 12.1 Pattern
Some sub-sites (e.g. the Mentivis Solutions Vercel app) are deployed independently but need to appear under the same domain and header. Instead of integrating them as Next.js pages, we embed them as full-screen iframes inside a minimal static HTML page.

### 12.2 File Locations
```
public/mentivis-solutions/index.html          # root redirector / fallback
public/fr/mentivis-solutions/index.html       # French version
public/en/mentivis-solutions/index.html       # English version
```

These directories are static assets (not Next.js routes). They are copied verbatim into the `out/` folder during `npm run build:ftp` and uploaded via `ftp_sync.py`.

### 12.3 Source Template
`iframe-embed.html` (project root) is the reference template. It provides:
- Full-viewport iframe (`width: 100%; height: 100%`)
- Dark loader overlay with spinner
- `allow="fullscreen"` attribute
- 5-second loader fallback

Copy this template to create new embedded sub-sites.

### 12.4 Linking from Next.js Pages
Internal links should use the dynamic `lang` prefix:
```tsx
<Link href={`/${lang}/mentivis-solutions`}>...</Link>
```

**Example change (2026-05-02):**
`/solutions` hero secondary CTA updated:
- Text: `"Nos approches"` → `"Voir plus"` (FR), `"Our approaches"` → `"Explore"` (EN)
- Link: `/${lang}/solutions#solutions-pillars` → `/${lang}/mentivis-solutions`

### 12.5 Deployment Notes
- The iframe pages are included automatically in every `build:ftp` because they live under `public/`.
- They persist on the o2switch server since `ftp_sync.py` never deletes files.
- No API routes or server-side logic required.

---

## 13. TXT → JSON Editing System

### 13.1 Philosophy
All editable text content lives in human-readable `.txt` files. JSON files are **generated artifacts** — never edit them directly.

### 13.2 Site Messages
**Source files:**
- `src/messages/site-fr.txt`
- `src/messages/site-en.txt`

**Generated files:**
- `src/messages/fr.json`
- `src/messages/en.json`

**Format:**
```
# section.subsection
key: value
arrayKey[0]: first item
arrayKey[1]: second item

# section.array[0]
nestedKey: value
```

**Rules:**
- Both languages must have identical key structure (validated automatically)
- Arrays use indexed notation: `key[0]: value`, `key[1]: value`
- Sections start with `# sectionName` or `# section.array[index]`

### 13.3 Insight Articles
**Source files:**
- `src/content/insights/{slug}.txt` — body + translated titles/excerpts
- `src/content/insights/{slug}.tech.json` — metadata (slug, date, category, etc.)

**Generated file:**
- `src/content/insights/{slug}.json`

**Format:**
```
# metadata
titleFr: Titre français
titleEn: English title
excerptFr: Résumé...
excerptEn: Excerpt...

# bodyFr
##### Heading
Paragraph one.
///
Paragraph two.

# bodyEn
##### English heading
English paragraph one.
///
English paragraph two.
```

**Rules:**
- `///` separates paragraphs
- Markdown headings inside body are preserved (only `# metadata`, `# bodyFr`, `# bodyEn` are treated as section boundaries)
- Missing `bodyEn` defaults to empty string in generated JSON

### 13.4 Commands
```bash
# Convert all .txt → .json (with backup and validation)
npm run texts

# Validate without writing
npm run texts:check

# One-time: regenerate .txt from existing JSON
node scripts/json2txt.js
```

### 13.5 Backup
`txt2json.js` creates a timestamped backup in `.backup/YYYY-MM-DD_HH-mm/` before overwriting any JSON. Maximum 10 backups kept.

## 14. ImageHero Component

### 14.1 When to Use
Any page with a **full-bleed background image hero** (e.g. `/about`, `/enterprise`, `/of`, `/solutions`) must use the shared `ImageHero` component instead of inline `<section>` markup. This ensures consistent padding, text alignment, and responsive behavior across all pages.

### 14.2 Props
```tsx
<ImageHero
  image="/images/heroes/photo.avif"
  eyebrow={t.section.eyebrow}
  title={<>...title markup...</>}
  lead={t.section.lead}
>
  {/* CTA buttons as children */}
  <Link href={`/${lang}/contact`}>...</Link>
</ImageHero>
```

### 14.3 Critical CSS Rule — `width: 100%` on Container
The parent `<section>` uses `display: flex`. Without an explicit `width` on the inner `.container`, its width is determined by its **content** (the headline text). This causes the container to have a different width on every page, making `margin: 0 auto` center it at a different `left` position.

**Always include:**
```tsx
<div className="container" style={{ width: "100%", ... }}>
```

This forces the container to fill the viewport before being capped by `max-width: 1240px`, ensuring the hero text starts at the exact same pixel on every page regardless of headline length.

### 14.4 Title Formatting — No Line Breaks in JSX
The `title` prop should be a single-line JSX expression to avoid whitespace text nodes that create invisible padding:

```tsx
// ✅ Correct — single line, no leading space
<>
  <span>{title[0]}</span>{" "}
  <em>{title[1]}</em>
</>

// ❌ Wrong — multi-line creates a text node before the first element
<>
  <span>{title[0]}</span>
  ...
</>
```

## 15. Contact

For questions about this setup, check:
- `AGENTS.md` — coding conventions and component hierarchy
- `docs/hero-pattern.md` — hero layout patterns
- `memory.md` — Material Symbols usage

---

## 16. Videos Page

### 16.1 Overview
The `/videos` page displays all Mentivis video content in a responsive grid. It uses the shared `ImageHero` component (like `/enterprise`) with a full-bleed background image.

**Features:**
- 2-column grid (collapses to 1-col on mobile ≤720px)
- Native HTML5 video player for local MP4 files
- YouTube iframe embeds (privacy mode, minimal interface)
- Play-one-at-a-time logic (clicking play pauses all others)
- Hover-only controls (Safari CSS hides overlay play button)
- Staggered entrance animation via `Reveal` component
- Max 24 videos (enforced in `useVideos()` hook)

### 16.2 Video Content Management
**Source files:**
- `src/content/videos/videos-fr.txt`
- `src/content/videos/videos-en.txt`

**Generated files:**
- `src/content/videos/videos-fr.json`
- `src/content/videos/videos-en.json`

**Format:**
```
# video[0]
title: Video title
description: Short description under the video.
filepath: videos/media/filename.mp4
poster: videos/media/filename.jpg
youtube: YOUTUBE_ID  # (optional - if present, ignores filepath/poster)

# video[1]
...
```

**Rules:**
- Each video uses indexed notation: `video[0]`, `video[1]`, etc.
- Either `filepath` (local MP4) OR `youtube` (YouTube ID) — not both
- Posters are auto-generated JPG thumbnails (see Section 16.3)
- Both languages must have identical structure (validated by `txt2json.js`)

### 16.3 Video Thumbnail Generation
**Script:** `scripts/generate-video-posters.js`

**What it does:**
- Scans `public/videos/media/*.mp4` for files without matching `.jpg` poster
- Extracts frame at 5 seconds using ffmpeg (`-ss 5 -frames:v 1`)
- Outputs JPG to same directory as source MP4

**Run manually after adding new videos:**
```bash
node scripts/generate-video-posters.js
```

### 16.4 Video Data Hook
**File:** `src/lib/videos.ts`

**Usage:**
```tsx
const { data } = useVideos();
const videos = data.videos || [];
```

Loads `videos-{lang}.json` based on current language. Returns `{ data: { videos: [...] } }`.

### 16.5 Player Features
**Native HTML5 video (local files):**
- `controls` enabled, `preload="metadata"`
- `aspectRatio: 16/9`, `borderRadius: var(--r-lg)`
- Safari: hides overlay play button via `::-webkit-media-controls-overlay-play-button { display: none !important }`
- Controls appear on hover via `::-webkit-media-controls { opacity: 0; transition }`

**YouTube embeds:**
- Privacy mode: `youtube-nocookie.com`
- Minimal interface: `modestbranding=1&rel=0&iv_load_policy=3`
- Lazy loading: `loading="lazy"`

**Play-one-at-a-time:**
Clicking play on any video automatically pauses all other `<video>` elements using a shared `videoRefs` array and `play` event listener.

### 16.6 Site Messages
The `videosPage` section in `src/messages/site-fr.txt` and `src/messages/site-en.txt`:

```
# videosPage
eyebrow: Videos
title: Consulting in motion
lead: Project videos, behind the scenes...
noVideos: No videos available at the moment.
contactCta: Contact us
metaDescription: ...
```

After editing, run `npm run texts` to regenerate JSON.

### 16.7 Commands
```bash
# Generate missing video thumbnails
node scripts/generate-video-posters.js

# Convert videos txt → json (after editing videos-*.txt)
npm run texts

# Convert all txt → json (site messages + insights + videos)
npm run texts
```

### 16.8 File Structure
```
public/videos/media/
  ├── 1-cyber-text.mp4
  ├── 1-cyber-text.jpg   # auto-generated poster
  ├── 2-Mentivis-Strategy-Rap.mp4
  ├── 2-Mentivis-Strategy-Rap.jpg
  └── ...

src/content/videos/
  ├── videos-fr.txt
  ├── videos-en.txt
  ├── videos-fr.json    # generated
  └── videos-en.json    # generated

src/app/[lang]/videos/
  └── page.tsx          # videos page component
```
