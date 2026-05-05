const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');

const PRECONNECT_TAGS = `
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.google-analytics.com" />
<link rel="preconnect" href="https://api.hsforms.com" />
<link rel="dns-prefetch" href="https://meetings.hubspot.com" />
<link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />`;

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.name.endsWith('.html')) cb(full);
  }
}

let count = 0;
walk(OUT_DIR, (file) => {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('rel="preconnect"')) return;
  html = html.replace('<head>', '<head>' + PRECONNECT_TAGS);
  fs.writeFileSync(file, html, 'utf8');
  count++;
});

console.log(`✓ Injected preconnect links into ${count} HTML files`);
