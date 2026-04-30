# Mentivis — Design System & Visual Language

> **Reference**: This document is the single source of truth for all visual, typographic, and interaction patterns on the Mentivis website.

---

## 1. Design Philosophy

- **Clarity over decoration**: Every element serves a purpose. No gratuitous shadows, borders, or animations.
- **Restrained color palette**: One dominant brand color (navy) + a neutral grayscale. No gradients on UI elements except the footer background.
- **Generous whitespace**: Sections breathe with `96px` vertical padding (desktop), `64px` (mobile).
- **Pill-shaped CTAs**: All primary actions use `borderRadius: 999` (fully rounded).
- **Image honesty**: Background images are shown naked — no overlays, no tints, no blur. The image must be chosen so white text is readable naturally.
- **Bilingual parity**: FR and EN share identical layout, spacing, and component structure. Only content changes.

---

## 2. Design Tokens

### 2.1 Colors

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--m-purple` | `#000776` | Primary brand color. CTAs, links, selection, accents, cookie consent buttons. |
| `--m-purple-mid` | `#1a2294` | Hover states for purple elements. |
| `--m-purple-deep` | `#00054d` | Pressed / active states. |
| `--m-purple-soft` | `rgba(0,7,118,0.12)` | Subtle backgrounds, tags. |
| `--m-purple-bright` | `#1a2294` | Alternative bright accent. |
| `--m-purple-tint` | `rgba(0,7,118,0.06)` | Very subtle wash backgrounds. |
| `--m-ink` | `#101114` | Primary text, headings. |
| `--m-ink-2` | `#2a2c34` | Secondary text, labels. |
| `--m-ink-3` | `#686b82` | Tertiary text, eyebrows, metadata. |
| `--m-ink-4` | `#9497a9` | Disabled, captions, footer stats. |
| `--m-line` | `#dedee5` | Borders, dividers, separators. |
| `--m-line-2` | `#eef0f5` | Subtle borders (nav pill, cards). |
| `--m-bg` | `#ffffff` | Page background. |
| `--m-bg-soft` | `#fafafd` | Section alternating background, nav pill bg. |
| `--m-bg-warm` | `#f4f4f8` | Warm neutral background. |
| `--m-success` | `#149e61` | Success states. |
| `--m-success-soft` | `rgba(20,158,97,0.16)` | Success background wash. |
| `--m-success-text` | `#026b3f` | Success text. |

**Rules**:
- Never use `#7132f5` (old purple). Navy `#000776` is the only brand purple.
- White text (`#ffffff` or `rgba(255,255,255,0.9)`) is reserved for dark sections and image heroes.
- Footer uses white text on animated gradient background.

### 2.2 Typography

| Token | Font | Weight | Size | Letter-spacing | Line-height | Usage |
|-------|------|--------|------|----------------|-------------|-------|
| `--f-display` | IBM Plex Sans | 700 | varies | `-1px` | `1.17` | H1, H2, hero titles. `clamp(32px, 5vw, 68px)` for H1. |
| `--f-sans` | IBM Plex Sans | 400–600 | 16px base | normal | `1.38` | Body, UI, labels. |
| `--f-mono` | JetBrains Mono | 400–500 | 12px | `0.04em` | `1.4` | Stats, version numbers, technical metadata. |

**Utility classes**:

- `.t-display` — Bold display type. `em` inside is colored `--m-purple` by default.
- `.t-eyebrow` — `12px`, uppercase, `letter-spacing: 0.06em`, weight 600, color `--m-ink-3`. Used above headings.
- `.t-lead` — `18px` (desktop), `16px` (mobile), weight 400, color `--m-ink-3`, line-height `1.5`. Hero subheadings.
- `.t-mono` — Monospace utility for stats and metadata.

### 2.3 Spacing

| Token | Value |
|-------|-------|
| `--container` | `1240px` max-width, centered |
| `--gutter` | `32px` desktop → `20px` mobile (`< 900px`) |
| Section padding (desktop) | `96px 0` |
| Section padding (mobile) | `64px 0` |
| `.page-shell` padding-top | `80px` (clears fixed header) |

### 2.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--r-sm` | `6px` | Small UI elements, tags |
| `--r-md` | `10px` | Cards, inputs |
| `--r-lg` | `12px` | Images, form fields |
| `--r-xl` | `16px` | Header pill, mobile menu, image containers |
| Pill | `999px` | All buttons, nav pill, CTAs, lang toggle |

### 2.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-1` | `0 1px 4px rgba(16,24,40,0.04)` | Subtle elevation |
| `--shadow-2` | `0 4px 24px rgba(0,0,0,0.03)` | Cards, dropdowns |
| Header default | `0 2px 12px rgba(16,24,40,0.06)` | Header at top |
| Header scrolled | `0 12px 40px rgba(16,24,40,0.12)` | Header after scroll |
| Mobile menu | `0 12px 40px rgba(16,24,40,0.12)` | Mobile nav panel |

---

## 3. Layout System

### 3.1 Container

```tsx
<div className="container">
  {/* max-width: 1240px, padding: 0 32px (20px mobile) */}
</div>
```

### 3.2 Grid Patterns

| Class | Desktop | `<= 1000px` | `<= 720px` |
|-------|---------|-------------|------------|
| `.m-split-grid` | `1fr 1.4fr` | `1fr` | `1fr` |
| `.m-grid-2` | `1fr 1fr` | `1fr` | `1fr` |
| `.m-grid-3` | `1fr 1fr 1fr` | `1fr 1fr` | `1fr` |
| `.m-grid-4` | `1fr 1fr 1fr 1fr` | `1fr 1fr` | `1fr` |
| `.m-proof-grid` | `repeat(4, 1fr)` | `1fr 1fr` | `1fr` |
| `.m-diff-grid` | `1fr 1fr` | `1fr` | `1fr` |
| `.m-footer-cols` | `1.4fr 1fr 1fr 1fr` | `1fr 1fr` | `1fr` |

### 3.3 Responsive Breakpoints

| Breakpoint | Key Changes |
|------------|-------------|
| `<= 1000px` | Grids collapse to 1–2 columns. Footer columns halve. |
| `<= 950px` | Mobile burger appears. Desktop nav pill + CTA hidden. |
| `<= 900px` | Section padding reduces. Guide cards stack vertically. |
| `<= 720px` | All grids single column. Footer single column. Insight cards stack. |
| `<= 520px` | Guide modals reduce padding. Form fields tighten. |

---

## 4. Header & Navigation

### 4.1 Structure

The header is **fixed** at `top: 12px`, centered with `maxWidth: 1280px`, `borderRadius: 16px`. It contains:

1. **Left**: Logo (`Logo` component, `minWidth: 150`)
2. **Center**: Nav pill (`m-nav-pill`) — a rounded container with `background: var(--m-bg-soft)`, `border: 1px solid var(--m-line-2)`, `borderRadius: 999`. Holds 4 links.
3. **Right**: Lang toggle (`FR` / `EN`) + Contact CTA pill + Burger icon (mobile only)

### 4.2 Nav Links

- `fontSize: 14px`, `fontWeight: 500`, `color: var(--m-ink-2)`
- Active state: `color: var(--m-ink)`, `background: rgba(0,0,0,0.05)`, `borderRadius: 999`
- Hover: animated underline via `::after` pseudo-element (`scaleX(0) → scaleX(1)`, `transform-origin: left`)

### 4.3 Scroll Behavior

At `scrollY > 8px`, the header transitions to a "floating glass" state:

| Property | Default | Scrolled |
|----------|---------|----------|
| Background | `#ffffff` | `rgba(255,255,255,0.88)` |
| Box-shadow | `0 2px 12px rgba(16,24,40,0.06)` | `0 12px 40px rgba(16,24,40,0.12)` |
| Backdrop-filter | `none` | `blur(12px)` |
| Border | `none` | `none` |
| Transition | — | `0.35s ease` on shadow, bg, blur |

**No border** on the header container. The nav pill retains its `var(--m-line-2)` border.

### 4.4 Mobile Menu (`<= 950px`)

When burger is clicked:

1. **Overlay** (`zIndex: 40`): `position: fixed`, `inset: 0`, `background: rgba(16,24,40,0.35)`, `backdropFilter: blur(4px)`. Clicking closes menu.
2. **Menu panel** (`zIndex: 41`): `position: absolute`, `top: 64`, `left/right: 16`, `background: white`, `borderRadius: 16`, `border: 1px solid var(--m-line)`.
3. **Animations**:
   - Overlay: fade-in `0.25s ease`
   - Menu: `translateY(-8px) scale(0.98) → translateY(0) scale(1)`, `0.3s cubic-bezier(0.22, 1, 0.36, 1)`
4. **Content**: Primary links + collapsible sections (Resources, Corporate) + Contact CTA button at bottom.

### 4.5 Load Animation (Claude-style staggered entrance)

- Header container: `headerDropIn` — `translateY(-16px) → 0`, opacity `0 → 1`, `1.1s cubic-bezier(0.22, 1, 0.36, 1)`
- Children (`.m-nav-item`): `navItemFadeIn` — `translateY(-8px) → 0`, opacity `0 → 1`, `0.7s` with staggered delays:
  - `delay-0`: `0ms` (logo)
  - `delay-1`: `100ms` (nav pill)
  - `delay-2`: `200ms` (right side wrapper)
  - `delay-3`: `280ms` (lang toggle + burger)
  - `delay-4`: `360ms` (extra items)

---

## 5. Footer

### 5.1 Structure

The footer is wrapped in a light gray outer shell (`background: #fafafd`, `padding: 24px 24px 0`) containing a single inner card with animated gradient background.

**Inner card** (`maxWidth: 1280`, `borderRadius: 28`, `overflow: hidden`):
- Animated gradient: `linear-gradient(-45deg, #000721, #000776, #000721, #000776)`, `background-size: 400% 400%`, `animation: footerGradient 10s ease infinite`
- Padding: `48px 56px 40px`

### 5.2 Layout

4-column grid (`1.4fr 1fr 1fr 1fr`):

1. **Column 1**: Inverted logo (`filter: invert(1) brightness(100)`), tagline, contact info (email, phone, address with links)
2. **Column 2**: Navigation links (Home, About, Enterprise, OF, Solutions)
3. **Column 3**: Resources (Guides, Score Formation, Insights)
4. **Column 4**: Corporate (Careers, Book a meeting)

### 5.3 Footer Links (Dark Mode)

- Default: `color: rgba(255,255,255,0.85)`
- Hover: `color: white`, `fontWeight: 500`
- Chevron icon (`chevron_right`) appears on hover only (`opacity: 0 → 1`)
- Footer bar links (bottom): `color: rgba(255,255,255,0.4)` → hover `white`

### 5.4 Bottom Bar

- Copyright text left
- Legal links right: Mentions légales · Confidentialité · CGU · CGV · Cookies · version number + locale
- Separators: `·` with `color: rgba(255,255,255,0.2)`

### 5.5 Page Stats Bar

Below the footer gradient card, a thin white bar shows page load time in monospace:
- `background: #ffffff`, `borderTop: 1px solid var(--m-line)`
- `fontFamily: var(--f-mono)`, `fontSize: 12px`, `color: var(--m-ink-4)`

---

## 6. Hero Patterns

### 6.1 Hero WITH Background Image (The Golden Reference: `/enterprise`)

**Rules**:
1. **NO overlays.** No gradient, blur, or tint over the image.
2. **Text is white.** The image must be chosen so white text is readable.
3. **Left-aligned.** `textAlign: "left"`, `alignItems: "center"` (vertical center).
4. **Single primary CTA.** Navy pill button, white text.
5. **No secondary ghost button** on image heroes.

**Structure**:
```tsx
<section style={{
  position: "relative",
  width: "100%",
  minHeight: 560,
  backgroundImage: "url(/PATH/TO/image.avif)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
}}>
  <div className="container" style={{
    position: "relative",
    zIndex: 2,
    paddingTop: 140,
    paddingBottom: 100,
    textAlign: "left",
  }}>
    <div className="t-eyebrow" style={{ marginBottom: 28, color: "white" }}>
      {eyebrow}
    </div>
    <h1 className="t-display" style={{
      fontSize: "clamp(32px, 5vw, 68px)",
      maxWidth: 720,
      margin: 0,
      color: "white",
    }}>
      {titleLine1}<br />
      <em style={{ color: "white" }}>{titleLine2}</em>
    </h1>
    <p className="t-lead" style={{
      marginTop: 28,
      maxWidth: 560,
      color: "rgba(255,255,255,0.9)",
    }}>{lead}</p>
    <div style={{ marginTop: 36, textAlign: "left" }}>
      {/* Single navy CTA pill */}
    </div>
  </div>
</section>
```

**Pages using this pattern**: `/enterprise`, `/of`, `/careers`

### 6.2 Hero WITHOUT Background Image (Light Background)

Used on pages like `/about`, `/solutions`, `/guides`, `/insights`.

- Background: `var(--m-bg-soft)` or white
- Text: `var(--m-ink)` (dark)
- Eyebrow: `var(--m-ink-3)`
- CTA: Can include primary + ghost/outline button pair
- No `minHeight` constraint; padding defines height

---

## 7. Component Library

### 7.1 `ButtonLink`

Reusable link button with 3 variants:

| Variant | Background | Border | Text | Usage |
|---------|------------|--------|------|-------|
| `primary` | `var(--m-purple)` | none | white | Main CTAs |
| `outline` | transparent | `1.5px solid var(--m-purple)` | `var(--m-purple)` | Secondary actions on light bg |
| `ghost` | transparent | none | `var(--m-purple)` | Tertiary actions |

All variants: `borderRadius: 999`, `padding: 13px 20px`, `fontSize: 14`, `fontWeight: 600`, `gap: 8`, includes `chevron_right` icon by default.

### 7.2 `ContactSidebar`

Reusable contact card used on `/contact` and `/meeting` pages.

- Optional `title` (bold, `fontSize: 15`) + `eyebrow` (normal, `fontSize: 14`)
- Square portrait image (`aspectRatio: 1/1`, `borderRadius: 16`) linking to `/meeting`
- Name: `fontWeight: 700`, `fontSize: 18`
- Role: `fontSize: 13`, `color: var(--m-ink-3)`
- Contact rows: email, phone, address with Material Symbols icons (`mail`, `phone`, `location_on`)

### 7.3 `PillarCard`

Numbered intervention card used in `/enterprise`, `/solutions`.

- `padding: 36px 32px`, `borderRadius: 18`, `border: 1px solid var(--m-line)`
- Header row: optional Material Symbol icon + italic number (`var(--m-purple)`) + horizontal rule
- Title: `fontFamily: var(--f-display)`, `fontSize: 30`, `fontWeight: 400`, `letterSpacing: -0.015em`
- Optional body text (`color: var(--m-ink-3)`, `fontSize: 15.5`)
- Optional `.dot-list` of items
- `accent` prop toggles `background: var(--m-bg-soft)`
- Hover: `border-color` darkens, subtle `transform` lift

### 7.4 `SectionHeader`

Standard section title block.

- Props: `eyebrow`, `title`, `lead`, `align` (`left` | `center`), `kicker`
- Title: `t-display`, `fontSize: clamp(36px, 5vw, 60px)`
- Max-width: `760px` (center) / `880px` (left)
- Kicker: `fontFamily: var(--f-display)`, `color: var(--m-purple)`, `fontSize: 18`

### 7.5 `FinalCTA`

Dark full-width call-to-action section before footer.

- Background: `var(--m-purple)` or `var(--m-ink)`
- Padding: `120px 0 100px`
- Title: `t-display`, white, `clamp(32px, 4vw, 52px)`
- Optional lead: `rgba(255,255,255,0.75)`, `fontSize: 17`
- Two buttons:
  1. Primary: white bg, dark text (`var(--m-purple)` or `var(--m-ink)`)
  2. Secondary: transparent bg, white text, `border: 1.5px solid rgba(255,255,255,0.35)`

### 7.6 `PreFooterCTA`

Light CTA section that appears before the footer on most pages (can be hidden with `hidePreFooterCTA` on `PageShell`).

### 7.7 `PageShell`

Standard page wrapper:

```tsx
<main className="page-shell">
  <TopNav />
  {children}
  <PreFooterCTA /> {/* optional */}
  <Footer />
</main>
```

---

## 8. Animation & Motion

### 8.1 Easing Curve

The project uses a single primary easing curve: `cubic-bezier(0.22, 1, 0.36, 1)` — a smooth deceleration that feels premium and never bouncy.

### 8.2 Header Entrance

- Container: `translateY(-16px) → 0`, opacity `0 → 1`, `1.1s`
- Items: staggered `0–360ms`, `0.7s` each

### 8.3 Scroll Glassmorphism

- `box-shadow`, `background`, `backdrop-filter` transition: `0.35s ease`
- Trigger: `window.scrollY > 8`

### 8.4 Mobile Menu

- Overlay: fade `0.25s ease`
- Panel: `translateY(-8px) scale(0.98) → translateY(0) scale(1)`, `0.3s cubic-bezier(0.22, 1, 0.36, 1)`

### 8.5 Proof Stats Reveal

- `translateY(24px) scale(0.96) → translateY(0) scale(1)`, `0.7s`
- Triggered by IntersectionObserver when section enters viewport

### 8.6 Footer Gradient

- `linear-gradient(-45deg, #000721, #000776, ...)`
- `background-size: 400% 400%`
- `animation: footerGradient 10s ease infinite`
- Creates a slow, living background shift

---

## 9. Form Styling

### 9.1 Native Inputs

```css
.input, .textarea {
  width: 100%;
  padding: 13px 16px;
  border: 1px solid var(--m-line);
  border-radius: 12px;
  font-family: var(--f-sans);
  font-size: 16px;
  background: white;
  color: var(--m-ink);
  transition: border-color 0.18s ease;
}
.input:focus, .textarea:focus {
  outline: none;
  border-color: var(--m-purple);
}
```

Labels: `fontSize: 14`, `fontWeight: 600`, `color: var(--m-ink-2)`, `marginBottom: 8px`.

### 9.2 HubSpot Form Overrides

The Careers page embeds a HubSpot iframe. Extensive CSS overrides ensure it matches Mentivis styling:

- Inputs: `border-radius: 12px`, `border: 1.5px solid var(--m-line)`, focus → `var(--m-purple)`
- Labels: `fontSize: 14`, `fontWeight: 600`, `color: var(--m-ink-2)`
- Submit button: navy pill (`background: var(--m-purple)`, `borderRadius: 999`, white text)
- Error messages: `color: #c62828`, `fontSize: 13`
- Legal text: `color: var(--m-ink-3)`, `fontSize: 13`
- HubSpot branding / virality links: **hidden** (`display: none`)

---

## 10. Image Guidelines

### 10.1 Format

- **Preferred**: AVIF (`.avif`) for all photos, heroes, portraits, illustrations
- **Fallbacks**: `.webp` and `.jpg` kept in `public/` but not referenced in source code
- **MIME type**: `image/avif` configured in `.htaccess`

### 10.2 Hero Images

- Must work with **white text** — no overlay allowed
- Use `minHeight: 560` (not `maxHeight`)
- `backgroundSize: "cover"`, `backgroundPosition: "center"`
- `overflow: "hidden"`

### 10.3 Portrait Images

- `aspectRatio: "1/1"` for team portraits (ContactSidebar)
- `borderRadius: 16`, `overflow: hidden`
- `objectFit: "cover"`

### 10.4 Card / Content Images

- `borderRadius: var(--r-md)` or `var(--r-lg)`
- `width: "100%"`, `height: "auto"`, `display: "block"`

---

## 11. Content Typography (Insights)

Articles rendered from JSON/HTML use the `.insight-body` class:

| Element | Style |
|---------|-------|
| `h2` | `24px`, weight 700, `margin: 40px 0 16px` |
| `h3` | `20px`, weight 700, `margin: 32px 0 12px` |
| `h4` | `17px`, weight 600, `color: var(--m-ink-2)`, `margin: 28px 0 12px` |
| `p` | `margin: 0 0 16px`, `color: var(--m-ink-2)` |
| `a` | `color: var(--m-purple)`, underline, `text-underline-offset: 3px` |
| `img` | `max-width: 100%`, `borderRadius: var(--r-md)`, `margin: 20px 0` |
| `blockquote` | `border-left: 3px solid var(--m-purple)`, `background: var(--m-bg-soft)`, italic |
| `strong/b` | `color: var(--m-ink)`, weight 600 |

---

## 12. Iconography

- **System**: Google Material Symbols Outlined
- **Load**: `<link>` in layout with `display=block`
- **Default variation**: `FILL: 0`, `wght: 400`, `GRAD: 0`, `opsz: 24`
- **Usage**: Inline `<span className="material-symbols-outlined">icon_name</span>`
- **Common icons**: `chevron_right`, `mail`, `phone`, `location_on`, `lightbulb`, `engineering`, `folder_open`, `rocket_launch`

---

## 13. Cookie Consent Styling

- Accept All / Show Preferences buttons: `background: #000776`, `color: white`
- Hover: `background: #00054d`
- Category descriptions: hidden
- Privacy links point to `/${lang}/privacy`

---

## 14. SEO & Meta Patterns

- Each page sets `title`, `description`, Open Graph `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card`
- Insights detail pages include JSON-LD `Article` schema
- `canonical` URL always includes full `https://www.mentivis.com` prefix
- No index on Vercel domain (middleware blocks `*.vercel.app` with 403)

---

## 15. Accessibility Notes

- All interactive elements have `cursor: pointer`
- Buttons have `aria-label` where icon-only
- Links use semantic `<a>` or Next.js `<Link>`
- Color contrast: Navy on white passes WCAG AA. White on navy passes AAA.
- `::selection` background is `--m-purple` with white text

---

## 16. Anti-Patterns (What NOT to do)

| Don't | Do Instead |
|-------|------------|
| Add gradient overlay on hero images | Choose images where white text is naturally readable |
| Use `textAlign: "center"` on image heroes | Always `textAlign: "left"` |
| Use `#7132f5` (old purple) | Always `#000776` |
| Put borders on the header container | `border: none` on header, keep border on nav pill only |
| Multiple buttons on image heroes | Single primary CTA only |
| Center text vertically with `justifyContent: "center"` | Use `alignItems: "center"` only |
| Use `.webp` or `.jpg` in source code | Reference `.avif` files |
| Hardcode `/fr/` or `/en/` in components | Use `/${lang}/` prefix dynamically |
| Put `<html>` in `[lang]/layout.tsx` | Root `layout.tsx` only |

---

*Document version: 1.0*
*Last updated: 2026-04-29*
