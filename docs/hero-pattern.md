# Hero with Background Image — Pattern

## The Golden Reference: `/solutions`

All image heroes must use the shared **`ImageHero`** component. Do NOT write inline `<section>` markup — it leads to alignment drift between pages.

### Rules

1. **NO overlays.** Never add a gradient, blur, or tint over the image. The image must be shown exactly as-is.
2. **Text is white.** No exceptions. The image must be chosen so white text is readable.
3. **Left-aligned.** `textAlign: "left"`, `alignItems: "center"` (vertical center), default horizontal start.
4. **Single primary CTA button.** Mentivis blue background (`var(--m-purple)`), white text, rounded pill.
5. **No secondary ghost button** on image heroes (ghost buttons are for light backgrounds only).

### Code Template

```tsx
import ImageHero from "@/components/ImageHero";

<ImageHero
  image="/images/heroes/your-photo.avif"
  eyebrow={t.section.eyebrow}
  title={<>...title markup...</>}
  lead={t.section.lead}
>
  <Link href={`/${lang}/contact`}>...</Link>
</ImageHero>
```

### Critical CSS Rule — `width: 100%` on Container

The `<section>` uses `display: flex`. Without `width: "100%"` on the inner `.container`, its width is determined by its **content** (the headline). This causes `margin: 0 auto` to center it at a different pixel position on every page, creating visible misalignment between heros.

**The `ImageHero` component already includes this fix.** Do not remove it.

### Title Formatting — Single-Line JSX

Keep the `title` prop on a single JSX line to avoid whitespace text nodes that shift the text right by a few pixels:

```tsx
// ✅ Correct
<>
  <span>{title[0]}</span>{" "}
  <em>{title[1]}</em>
</>

// ❌ Wrong — multi-line JSX creates a leading text node
<>
  <span>{title[0]}</span>
  ...
</>
```

### What NOT to do

| Wrong | Right |
|-------|-------|
| `background: "linear-gradient(...)"` overlay | Nothing. Image is naked. |
| `textAlign: "center"` | `textAlign: "left"` |
| `justifyContent: "center"` | Default (flex-start) or `alignItems: "center"` only |
| `color: "var(--m-purple)"` on text | `color: "white"` |
| White bg button with purple text | Purple bg button with white text |
| Multiple buttons on image hero | One primary CTA only |
| `aspectRatio: "16/9"` with maxHeight | `minHeight: 560` (lets content breathe) |

### Pages using this pattern

- `/solutions` — Reference implementation (uses `ImageHero`)
- `/about` — Uses `ImageHero`
- `/enterprise` — Uses `ImageHero`
- `/of` — Uses `ImageHero`
- `/careers` — Image hero but adds `aspectRatio: "16/9"` (image is very wide)

### Pages that must NOT use this pattern

- `/meeting` — Uses `aspectRatio: "16/9"` with centered text; acceptable but prefer `/solutions` style
