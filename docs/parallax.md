# Parallax Hero Background

## Status
**Reverted** — removed from production on 2026-04-30.
Kept here for potential re-activation.

## What it does
Subtle vertical parallax on `ImageHero` background images.
The background moves at **0.15x** the speed of the scroll, creating a depth effect.

## Code

```tsx
// In ImageHero.tsx
"use client";
import { ReactNode, useEffect, useRef } from "react";

export default function ImageHero({ image, eyebrow, title, lead, children }: ImageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = window.scrollY;
      const sectionTop = scrolled + rect.top;
      const offset = (scrolled - sectionTop) * 0.15;
      section.style.backgroundPositionY = `${offset}px`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ ... }}>
      {/* ... */}
    </section>
  );
}
```

## Why it was removed
- User requested revert on 2026-04-30
- Can be re-activated by restoring the `useEffect` + `useRef` block

## Affected pages
- `/about`
- `/enterprise`
- `/of`
- `/solutions`
