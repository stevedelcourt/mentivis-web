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

## 12. TXT → JSON Editing System

### 12.1 Philosophy
All editable text content lives in human-readable `.txt` files. JSON files are **generated artifacts** — never edit them directly.

### 12.2 Site Messages
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

### 12.3 Insight Articles
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

### 12.4 Commands
```bash
# Convert all .txt → .json (with backup and validation)
npm run texts

# Validate without writing
npm run texts:check

# One-time: regenerate .txt from existing JSON
node scripts/json2txt.js
```

### 12.5 Backup
`txt2json.js` creates a timestamped backup in `.backup/YYYY-MM-DD_HH-mm/` before overwriting any JSON. Maximum 10 backups kept.

## 13. ImageHero Component

### 12.1 When to Use
Any page with a **full-bleed background image hero** (e.g. `/about`, `/enterprise`, `/of`, `/solutions`) must use the shared `ImageHero` component instead of inline `<section>` markup. This ensures consistent padding, text alignment, and responsive behavior across all pages.

### 12.2 Props
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

### 12.3 Critical CSS Rule — `width: 100%` on Container
The parent `<section>` uses `display: flex`. Without an explicit `width` on the inner `.container`, its width is determined by its **content** (the headline text). This causes the container to have a different width on every page, making `margin: 0 auto` center it at a different `left` position.

**Always include:**
```tsx
<div className="container" style={{ width: "100%", ... }}>
```

This forces the container to fill the viewport before being capped by `max-width: 1240px`, ensuring the hero text starts at the exact same pixel on every page regardless of headline length.

### 12.4 Title Formatting — No Line Breaks in JSX
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

## 13. Contact

For questions about this setup, check:
- `AGENTS.md` — coding conventions and component hierarchy
- `docs/hero-pattern.md` — hero layout patterns
- `memory.md` — Material Symbols usage
