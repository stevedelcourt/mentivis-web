const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const CSS_DIR = path.join(OUT_DIR, '_next', 'static', 'css');

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.name.endsWith('.html')) cb(full);
  }
}

function inlineCSS(html) {
  const cssLinks = [];
  const cssLinkRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s+data-precedence="next"\s*\/?>/g;
  let match;

  while ((match = cssLinkRegex.exec(html)) !== null) {
    cssLinks.push({ full: match[0], href: match[1] });
  }

  if (cssLinks.length === 0) return html;

  let combinedCSS = '';
  for (const link of cssLinks) {
    const cssPath = path.join(OUT_DIR, link.href);
    if (fs.existsSync(cssPath)) {
      combinedCSS += fs.readFileSync(cssPath, 'utf8');
    }
  }

  if (!combinedCSS) return html;

  let newHtml = html;
  for (const link of cssLinks) {
    newHtml = newHtml.replace(link.full, '');
  }

  const styleTag = `<style>${combinedCSS}</style>`;
  newHtml = newHtml.replace('<head>', '<head>' + styleTag);

  return newHtml;
}

let count = 0;
walk(OUT_DIR, (file) => {
  const html = fs.readFileSync(file, 'utf8');
  const newHtml = inlineCSS(html);
  if (newHtml !== html) {
    fs.writeFileSync(file, newHtml, 'utf8');
    count++;
  }
});

console.log(`✓ Inlined CSS into ${count} HTML files`);
