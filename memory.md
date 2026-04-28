# Icons — Material Symbols

**Source:** https://fonts.google.com/icons

## How it works

We load Google **Material Symbols Outlined** as a variable font via Google Fonts:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
```

Icons are rendered as **ligatures** — you write the icon name as text inside a `<span>`:

```tsx
<span className="material-symbols-outlined">chevron_right</span>
```

The font swaps the text for the actual icon glyph. This is the standard Material Symbols approach.

## Critical rule

**Always use `display=block`** in the Google Fonts URL.  
With `display=optional`, large font files may not load within the browser's 100 ms block window, causing the literal text (e.g. "chevron_right") to render instead of the icon.

## CSS fallback

`globals.css` defines `.material-symbols-outlined` with explicit `font-feature-settings: 'liga'` and `font-variation-settings` to guarantee ligature rendering even if the Google Fonts CSS has issues.

## Where icons are used

| Location | Icon | Code |
|----------|------|------|
| All CTA buttons | `chevron_right` | `<span className="material-symbols-outlined">chevron_right</span>` |
| Header contact button | `chevron_right` | same |
| Footer newsletter submit | `chevron_right` | same |
| Mobile menu CTA | `chevron_right` | same |
| `/fr/of` — 01 Acquisition | `person_search` | `<span className="material-symbols-outlined">person_search</span>` |
| `/fr/of` — 02 Alternance | `school` | `<span className="material-symbols-outlined">school</span>` |
| `/fr/of` — 03 Marketing | `campaign` | `<span className="material-symbols-outlined">campaign</span>` |
| `/fr/of` — 04 Administratif | `folder_open` | `<span className="material-symbols-outlined">folder_open</span>` |
| `/fr/of` — 05 BPF & Qualiopi | `verified` | `<span className="material-symbols-outlined">verified</span>` |
| `/fr/of` — 06 Sur mesure | `build` | `<span className="material-symbols-outlined">build</span>` |

## Adding a new icon

1. Find the icon name on https://fonts.google.com/icons (use the exact name, underscores not hyphens).
2. Add the `<span className="material-symbols-outlined">icon_name</span>` in the component.
3. **No URL change needed** — we load the full font (all icons included).

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Icon text shows literally (e.g. "chevron_right") | `display=optional` + large font file | Change to `display=block` |
| Icon text shows literally | `icon_names` param has an invalid name | Remove `icon_names`, load full font |
| Icon text shows literally | Missing `.material-symbols-outlined` class | Add the class |
| Icon text shows literally | Google Fonts CSS 400 error | Check icon names; use full font instead of `icon_names` |
