# Hero with Background Image — Pattern

## The Golden Reference: `/enterprise`

This is the **absolute pattern** for any hero section that sits on top of a background image.

### Rules

1. **NO overlays.** Never add a gradient, blur, or tint over the image. The image must be shown exactly as-is.
2. **Text is white.** No exceptions. The image must be chosen so white text is readable.
3. **Left-aligned.** `textAlign: "left"`, `alignItems: "center"` (vertical center), default horizontal start.
4. **Single primary CTA button.** Mentivis blue background (`var(--m-purple)`), white text, rounded pill.
5. **No secondary ghost button** on image heroes (ghost buttons are for light backgrounds only).

### Code Template

```tsx
<section
  style={{
    position: "relative",
    width: "100%",
    minHeight: 560,
    backgroundImage: "url(/PATH/TO/image.avif)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  }}
>
  <div
    className="container"
    style={{
      position: "relative",
      zIndex: 2,
      paddingTop: 140,
      paddingBottom: 100,
      textAlign: "left",
    }}
  >
    <div className="t-eyebrow" style={{ marginBottom: 28, color: "white" }}>
      {eyebrowText}
    </div>
    <h1
      className="t-display"
      style={{
        fontSize: "clamp(32px, 5vw, 68px)",
        maxWidth: 720,
        margin: 0,
        color: "white",
      }}
    >
      {titleLine1}<br />
      <em style={{ color: "white" }}>{titleLine2}</em>
    </h1>
    <p
      className="t-lead"
      style={{
        marginTop: 28,
        maxWidth: 560,
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {leadText}
    </p>
    <div style={{ marginTop: 36, textAlign: "left" }}>
      <Link
        href={`/${lang}/contact`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "13px 20px",
          fontSize: 14,
          fontWeight: 600,
          color: "white",
          background: "var(--m-purple)",
          borderRadius: 999,
          textDecoration: "none",
        }}
      >
        {ctaLabel}
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          chevron_right
        </span>
      </Link>
    </div>
  </div>
</section>
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

- `/enterprise` — Reference implementation
- `/of` — Same pattern
- `/careers` — Same pattern (adds `aspectRatio: "16/9"` because image is very wide)

### Pages that must NOT use this pattern

- `/about` — Uses `PageHero` component with grid-line background (no image)
- `/meeting` — Uses `aspectRatio: "16/9"` with centered text; acceptable but prefer `/enterprise` style
