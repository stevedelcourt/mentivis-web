# Video Migration & SEO — May 29, 2026

## What changed

### Video migration (local MP4 → YouTube embed)
- Replaced `filepath`+`poster` with `youtube` IDs for indices 0–15 in all data files (txt + json, FR + EN)
- Added `aspectRatio: 1/1` for Ecolearn videos (indices 14–15) — previously labeled `short: true` but actual format is square
- Removed `public/videos/media/` — 32 stale files (16 MP4 + 16 JPG) deleted from repo

### YouTubeEmbed component (`VideosClient.tsx`)
- **Click-to-play overlay**: YouTube thumbnail (`img.youtube.com/vi/{id}/hqdefault.jpg`) shown until user clicks
- **Glassmorphism play button**: Semi-transparent white circle with `backdropFilter: blur(6px)`, white play triangle, no grey overlay
- **postMessage playback control**: Instead of resetting iframe `src` on pause, sends `playVideo`/`pauseVideo` commands via `postMessage` — the iframe stays in the DOM, so re-clicking a thumbnail **resumes from the exact position** it was paused at
- **Auto-stop on switch**: When a new video is clicked, the previously playing one is sent `pauseVideo` and its thumbnail cover reappears

### SEO
- **VideoObject JSON-LD**: Each video now has structured data with `embedUrl` + `thumbnailUrl` on the listing page
- **Video sitemap extensions**: `sitemap.xml` includes video entries with `player_loc` (our page) + YouTube `thumbnail_loc` for all 16 videos × 2 languages

### Other changes from this session
- beta-questionnaire page (noindex, submits to sc4 API)
- ParallaxHero mobile freeze fix (IntersectionObserver)
- Contact link 404 on mentivisos page (buildContactUrl)
- Contact page Suspense blank fix (extracted useSearchParams)
- Removed ctaSecondaryLink from message files
- Removed stale video extension section from sitemap.ts

## Build output
- 99 pages, clean TypeScript, zero errors
- `out/` at commit `ef04274`

## Files modified
- `public/.htaccess` — catch-all path redirect
- `src/content/videos/videos-{fr,en}.{txt,json}` — YouTube IDs + aspect ratio
- `src/app/[lang]/videos/VideosClient.tsx` — YouTubeEmbed rewrite, JSON-LD, play-state tracking
- `src/app/sitemap.ts` — video extension entries
- `src/lib/videos.ts` — `Video` interface (aspectRatio field)
- `public/videos/media/` — deleted (32 files)
