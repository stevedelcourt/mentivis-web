# Scroll-Resize Demo — Anthropic Glasswing Effect

This file contains the full source code for the scroll-driven resize demo page replicating Anthropic's Project Glasswing card effect.

## File: `scroll-resize-demo.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Glasswing Demo — Mentivis</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

  <style>
    :root {
      --m-purple: #000776;
      --m-purple-mid: #1a2294;
      --m-purple-deep: #00054d;
      --m-ink: #101114;
      --m-ink-2: #2a2c34;
      --m-ink-3: #686b82;
      --m-line: #dedee5;
      --m-bg: #ffffff;
      --m-bg-soft: #fafafd;
      --container: 1240px;
      --r-lg: 12px;
      --r-xl: 16px;
      --f-display: 'IBM Plex Sans', Arial, sans-serif;
      --f-sans: 'IBM Plex Sans', Arial, sans-serif;
      --f-mono: 'JetBrains Mono', monospace;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--f-sans);
      color: var(--m-ink);
      background: var(--m-bg);
      line-height: 1.38;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: var(--container);
      margin: 0 auto;
      padding: 0 32px;
    }

    .section-padding { padding: 96px 0; }

    .t-eyebrow {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--m-ink-3);
      margin-bottom: 16px;
    }

    .t-display {
      font-family: var(--f-display);
      font-weight: 700;
      font-size: clamp(32px, 5vw, 68px);
      line-height: 1.17;
      letter-spacing: -1px;
    }

    .t-display em {
      font-style: italic;
      color: var(--m-purple);
    }

    .t-lead {
      font-size: 18px;
      color: var(--m-ink-3);
      line-height: 1.5;
      max-width: 560px;
      margin-top: 28px;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--m-purple);
      color: #ffffff;
      font-family: var(--f-sans);
      font-size: 14px;
      font-weight: 600;
      padding: 13px 20px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.18s ease;
    }

    .btn-primary:hover { background: var(--m-purple-mid); }

    /* Spacer for scroll */
    .scroll-spacer { height: 40vh; }

    /* ========== GLASSWING CARD ========== */
    .glasswing-section {
      position: relative;
      padding: 80px 0;
      background: var(--m-bg-soft);
      overflow: hidden;
    }

    .glasswing-card-wrapper {
      position: relative;
      width: 100%;
    }

    .glasswing-card {
      position: relative;
      background: var(--m-purple);
      border-radius: var(--r-xl);
      overflow: hidden;
      min-height: 420px;
      display: flex;
      align-items: center;
      cursor: pointer;
      /* Initial state: constrained in container */
      max-width: var(--container);
      margin: 0 auto;
      padding: 0 32px;
    }

    .glasswing-card-inner {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 64px 56px;
      position: relative;
      z-index: 2;
    }

    .glasswing-content {
      max-width: 600px;
    }

    .glasswing-content .t-eyebrow { color: rgba(255,255,255,0.7); }
    .glasswing-content .t-display { color: #ffffff; }
    .glasswing-content .t-display em { color: #ffffff; }
    .glasswing-content .t-lead { color: rgba(255,255,255,0.85); }

    .glasswing-cta {
      margin-top: 36px;
      display: flex;
      gap: 12px;
    }

    .btn-white {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ffffff;
      color: var(--m-purple);
      font-family: var(--f-sans);
      font-size: 14px;
      font-weight: 600;
      padding: 13px 20px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.18s ease, color 0.18s ease;
    }

    .btn-white:hover { background: var(--m-purple-deep); color: #ffffff; }

    .btn-ghost-light {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: #ffffff;
      font-family: var(--f-sans);
      font-size: 14px;
      font-weight: 600;
      padding: 13px 20px;
      border-radius: 999px;
      border: 1.5px solid rgba(255,255,255,0.35);
      cursor: pointer;
      text-decoration: none;
      transition: border-color 0.18s ease, background 0.18s ease;
    }

    .btn-ghost-light:hover {
      border-color: rgba(255,255,255,0.6);
      background: rgba(255,255,255,0.1);
    }

    /* Background image inside card */
    .glasswing-bg {
      position: absolute;
      inset: 0;
      background-image: url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80');
      background-size: cover;
      background-position: center;
      opacity: 0.25;
      z-index: 1;
    }

    /* Full-area clickable pattern */
    .g_clickable_wrap {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
    }

    .g_clickable_link {
      display: block;
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      text-decoration: none;
      z-index: 3;
    }

    .u-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    /* ========== DEMO INFO BAR ========== */
    .demo-info {
      background: var(--m-ink);
      color: rgba(255,255,255,0.6);
      font-family: var(--f-mono);
      font-size: 12px;
      padding: 12px 0;
      text-align: center;
    }

    .demo-info span { color: rgba(255,255,255,0.9); }

    /* ========== CONTENT SECTIONS ========== */
    .content-section { padding: 96px 0; }
    .content-section.alt { background: var(--m-bg-soft); }

    .section-header { max-width: 760px; margin-bottom: 48px; }
    .section-header.centered { text-align: center; margin-left: auto; margin-right: auto; }

    .t-mono {
      font-family: var(--f-mono);
      font-size: 12px;
      letter-spacing: 0.04em;
      color: var(--m-ink-4);
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .info-card {
      padding: 36px 32px;
      border-radius: var(--r-lg);
      border: 1px solid var(--m-line);
      background: var(--m-bg);
      transition: border-color 0.18s ease, transform 0.18s ease;
    }

    .info-card:hover {
      border-color: var(--m-purple);
      transform: translateY(-2px);
    }

    .info-card h3 {
      font-family: var(--f-display);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--m-ink);
    }

    .info-card p {
      font-size: 15px;
      color: var(--m-ink-3);
      line-height: 1.5;
    }

    /* ========== FOOTER ========== */
    .demo-footer {
      background: var(--m-ink);
      color: rgba(255,255,255,0.4);
      font-size: 13px;
      padding: 32px 0;
      text-align: center;
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 900px) {
      .glasswing-card-inner { padding: 48px 32px; }
      .card-grid { grid-template-columns: 1fr; }
      .section-padding { padding: 64px 0; }
    }

    @media (max-width: 720px) {
      .container { padding: 0 20px; }
      .glasswing-card { padding: 0 20px; }
      .glasswing-card-inner { padding: 36px 24px; }
    }
  </style>
</head>
<body>

  <!-- Demo Info Bar -->
  <div class="demo-info">
    <span>Anthropic Glasswing Effect Demo</span> &mdash;
    Scroll down to see the card expand from centered to <span>full edge-to-edge width</span>
  </div>

  <!-- Spacer -->
  <div class="scroll-spacer"></div>

  <!-- Glasswing Section -->
  <section class="glasswing-section">
    <div class="glasswing-card-wrapper">
      <div class="glasswing-card" id="glasswingCard">

        <!-- Full-area clickable pattern -->
        <div class="g_clickable_wrap">
          <a href="https://www.anthropic.com/glasswing" class="g_clickable_link" target="_blank" aria-label="Read the story - Project Glasswing">
            <span class="u-sr-only">Read the story - Project Glasswing</span>
          </a>
        </div>

        <div class="glasswing-bg"></div>

        <div class="glasswing-card-inner">
          <div class="glasswing-content">
            <div class="t-eyebrow">Project Glasswing</div>
            <h2 class="t-display">
              Securing critical software<br>
              for the <em>AI era</em>
            </h2>
            <p class="t-lead">
              Project Glasswing brings advanced security capabilities to Claude,
              protecting enterprises againstPrompt injection, data exfiltration, and other AI-specific threats.
            </p>
            <div class="glasswing-cta">
              <a href="https://www.anthropic.com/glasswing" class="btn-white" target="_blank">
                Continue reading
                <span style="font-size:18px;">→</span>
              </a>
              <a href="https://www.anthropic.com/glasswing" class="btn-ghost-light" target="_blank">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Content Below -->
  <section class="content-section">
    <div class="container">
      <div class="section-header centered">
        <div class="t-eyebrow">How it works</div>
        <h2 class="t-display" style="font-size:clamp(28px,4vw,48px);">
          Scroll-driven <em>resize</em> animation
        </h2>
        <p class="t-lead" style="margin-left:auto;margin-right:auto;text-align:center;">
          This demo replicates Anthropic's homepage effect using GSAP ScrollTrigger.
          The card starts constrained in the page container and expands to full viewport width on scroll.
        </p>
      </div>

      <div class="card-grid">
        <div class="info-card">
          <div class="t-mono" style="margin-bottom:12px;">STEP 01</div>
          <h3>Initial State</h3>
          <p>Card sits inside the 1240px container with margin: 0 auto. Standard centered layout like Anthropic's homepage.</p>
        </div>
        <div class="info-card">
          <div class="t-mono" style="margin-bottom:12px;">STEP 02</div>
          <h3>Scroll Trigger</h3>
          <p>GSAP ScrollTrigger detects scroll position. The card pins and animates width from container-max to 100vw edge-to-edge.</p>
        </div>
        <div class="info-card">
          <div class="t-mono" style="margin-bottom:12px;">STEP 03</div>
          <h3>Edge-to-Edge</h3>
          <p>Card fills full viewport width with no side padding. The clickable overlay (inset:0) automatically stretches to match.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="content-section alt">
    <div class="container">
      <div class="section-header">
        <div class="t-eyebrow">Technical pattern</div>
        <h2 class="t-display" style="font-size:clamp(24px,3.5vw,40px);">
          Full-area <em>clickable</em> wrapper
        </h2>
      </div>
      <div class="card-grid">
        <div class="info-card">
          <h3>.g_clickable_wrap</h3>
          <p>Parent wrapper with position:absolute + inset:0. Sits above all other elements (z-index:3).</p>
        </div>
        <div class="info-card">
          <h3>.g_clickable_link</h3>
          <p>The &lt;a&gt; tag with position:absolute + inset:0. Covers 100% of parent surface area.</p>
        </div>
        <div class="info-card">
          <h3>.u-sr-only</h3>
          <p>Screen-reader-only text. Visually hidden but accessible to assistive technologies.</p>
        </div>
      </div>
    </div>
  </section>

  <div class="scroll-spacer"></div>

  <div class="demo-footer">
    Mentivis &mdash; Design System Demo &mdash; Anthropic Glasswing Scroll Effect
  </div>

  <script>
    gsap.registerPlugin(ScrollTrigger);

    const card = document.getElementById('glasswingCard');
    const wrapper = card.closest('.glasswing-card-wrapper');

    // Set up the scroll-driven animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        pin: false,
      }
    });

    // Animate from constrained container to full edge-to-edge
    tl.fromTo(card,
      {
        maxWidth: '1240px',
        margin: '0 auto',
        borderRadius: '16px',
        padding: '0 32px',
      },
      {
        maxWidth: '100%',
        margin: '0',
        borderRadius: '0',
        padding: '0',
        duration: 1,
        ease: 'power2.inOut',
      }
    );

    // Update info bar on scroll
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top 50%',
      onEnter: () => {
        document.querySelector('.demo-info').innerHTML =
          '<span>Glasswing Card Expanded</span> &mdash; Now at full edge-to-edge width';
      },
      onLeaveBack: () => {
        document.querySelector('.demo-info').innerHTML =
          '<span>Anthropic Glasswing Effect Demo</span> &mdash; Scroll down to see the card expand from centered to <span>full edge-to-edge width</span>';
      }
    });
  </script>

</body>
</html>
```

## Script Sizes (CDN)

| Script | Size (minified) | Gzipped (est.) |
|--------|----------------|----------------|
| `gsap.min.js` | 72 KB | ~25 KB |
| `ScrollTrigger.min.js` | 43 KB | ~12 KB |
| **Total** | **115 KB** | **~37 KB** |

## How to Run Locally

1. Navigate to the landing folder:
   ```bash
   cd /Users/stv/Documents/zed/newsletter/landing/
   ```

2. Install dependencies (live-server):
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open in browser:
   ```
   http://127.0.0.1:3000/scroll-resize-demo.html
   ```

Live reload is enabled — any changes to the HTML file will automatically refresh the browser.

## Key Features

- **Scroll-driven resize**: Card starts at 1240px (Mentivis container width) and expands to full viewport width (100vw) on scroll.
- **Full-area clickable pattern**: Uses `.g_clickable_wrap` + `.g_clickable_link` with `inset: 0` for accessibility.
- **Mentivis design tokens**: IBM Plex Sans, `--m-purple: #000776`, proper spacing.
- **GSAP ScrollTrigger**: Handles the scroll animation with scrub for smooth follow.
- **Responsive**: Adapts to mobile with adjusted padding and single-column grids.
