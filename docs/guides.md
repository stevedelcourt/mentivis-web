$ cat /home/user/menticode/guide/server.js

const express = require('express'); const crypto = require('crypto'); const path = require('path'); const fs = require('fs'); const app = express(); app.use(express.json()); app.use(express.static(path.join(__dirname, 'public'))); const content = require('./data/fr.json'); // token -> { email, prenom, nom, telephone, entreprise, expiresAt } const tokens = new Map(); const TOKEN_TTL = 10 * 60 * 1000; setInterval(() => {  const now = Date.now();  for (const [token, data] of tokens) {    if (data.expiresAt < now) tokens.delete(token);  } }, 60 * 1000); app.get('/api/content', (_req, res) => {  res.json(content); }); app.post('/api/submit', (req, res) => {  const { prenom, nom, email, telephone, entreprise } = req.body || {};   if (!prenom || !nom || !email || !telephone || !entreprise) {    return res.status(400).json({ error: content.form.errors.required });  }  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {    return res.status(400).json({ error: content.form.errors.email });  }   const token = crypto.randomBytes(32).toString('hex');  const expiresAt = Date.now() + TOKEN_TTL;  tokens.set(token, { prenom, nom, email, telephone, entreprise, expiresAt });   // TODO: forward lead data via your email/CRM service here   res.json({ token, expiresAt }); }); app.get('/download/:token/:filename', (req, res) => {  const { token, filename } = req.params;   // Only allow safe filenames  if (!/^[\w-]+\.pdf$/i.test(filename)) {    return res.status(400).send('Fichier invalide.');  }   const entry = tokens.get(token);  if (!entry || entry.expiresAt < Date.now()) {    return res.status(403).json({ expired: true });  }   // Verify the requested PDF is in our guide list  const guide = content.guides.find(g => g.pdf === filename);  if (!guide) {    return res.status(404).send('Guide introuvable.');  }   const filePath = path.resolve(__dirname, 'pdfs', filename);  // Guard against path traversal  if (!filePath.startsWith(path.resolve(__dirname, 'pdfs'))) {    return res.status(400).send('Chemin invalide.');  }   if (!fs.existsSync(filePath)) {    return res.status(404).send('Ce PDF n\'est pas encore disponible.');  }   res.setHeader('Content-Type', 'application/pdf');  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);  fs.createReadStream(filePath).pipe(res); }); const PORT = process.env.PORT || 3000; app.listen(PORT, () => {  console.log(`Mentivis Guides running → http://localhost:${PORT}`); });



Bash

$ cat /home/user/menticode/guide/package.json

{  "name": "mentivis-guides",  "version": "1.0.0",  "main": "server.js",  "scripts": {    "start": "node server.js",    "dev": "node --watch server.js"  },  "dependencies": {    "express": "^4.18.2"  } }




$ cat /home/user/menticode/guide/data/fr.json

{  "page": {    "title": "Les Guides de Référence Mentivis",    "subtitle": "Les repères essentiels pour piloter, structurer et développer efficacement vos projets éducatifs"  },  "form": {    "heading": "Accédez aux guides gratuitement",    "subheading": "Renseignez vos coordonnées pour débloquer les téléchargements",    "fields": {      "prenom": "Prénom",      "nom": "Nom",      "email": "Email professionnel",      "telephone": "Téléphone",      "entreprise": "Entreprise"    },    "submit": "Accéder aux guides",    "errors": {      "required": "Tous les champs sont obligatoires.",      "email": "Veuillez saisir un email valide.",      "server": "Une erreur est survenue. Veuillez réessayer."    },    "thanks": {      "title": "Merci !",      "message": "Vos guides sont maintenant disponibles. Cliquez sur un bouton ci-dessous pour ouvrir le PDF correspondant dans un nouvel onglet.",      "expiry": "Votre accès est valable <strong>10 minutes</strong>. Passé ce délai, vous devrez saisir vos coordonnées à nouveau.",      "tokenLabel": "Code d'accès :",      "expired": "Votre accès a expiré. Veuillez saisir à nouveau vos coordonnées pour télécharger les guides."    }  },  "guides": [    {      "id": "bpf",      "title": "Le guide BPF 2026 pour les organismes de formation",      "description": "20 pages de référence opérationnelle pour déposer votre Bilan Pédagogique et Financier en toute conformité – cadre légal complet, loi anti-fraude 2025 intégrée, guide étape par étape.",      "button": "Télécharger le PDF gratuit",      "pdf": "bpf-2026.pdf",      "image": "bpf_mock_woman2-1300x1300.webp"    },    {      "id": "fse",      "title": "Le guide FSE+ Fonds Social Européen Plus",      "description": "35 pages de référence opérationnelle pour mobiliser le FSE+ en toute conformité – cadre légal 2021-2027, guide pour les organismes de formation, guide pour les entreprises, lexique complet.",      "button": "Télécharger le PDF gratuit",      "pdf": "fse-plus.pdf",      "image": "fse_mockup-1300x1300.webp"    },    {      "id": "poei",      "title": "Le guide POEI Préparation Opérationnelle à l'Emploi",      "description": "22 pages de référence opérationnelle pour mettre en œuvre la POEI en toute conformité – cadre légal à jour (loi Plein emploi 2023), guide pour les organismes de formation, lexique et interlocuteurs.",      "button": "Télécharger le PDF gratuit",      "pdf": "poei.pdf",      "image": "poei-mock-woamn-1300x1300.webp"    },    {      "id": "cpf",      "title": "Le guide CPF — Réduire sa dépendance au CPF 2026",      "description": "38 pages pour préparer votre organisme de formation au nouveau régime CPF 2026 – plafonds RS, carence bilans, reste à charge à 150 € : tout ce que vous devez savoir, et comment vous adapter.",      "button": "Télécharger le PDF gratuit",      "pdf": "cpf-2026.pdf",      "image": "cpf-guide-woman-1300x1300.webp"    },    {      "id": "conventions",      "title": "Le guide Conventions de Formation",      "description": "Les conventions de formation de A à Z, le cadre légal, les obligations et les différences entre convention et contrat. Vous y trouverez une méthode en 7 étapes pour rédiger, signer et suivre vos actions de formation, ainsi que les mentions obligatoires, les impacts des financements.",      "button": "Télécharger le PDF gratuit",      "pdf": "conventions-formation.pdf",      "image": "conventions-guide-woman-1300x1300.webp"    },    {      "id": "taxe",      "title": "Le guide Taxe d'Apprentissage",      "description": "Il détaille le cadre légal, les critères d'éligibilité, les démarches via SOLTéA et les obligations associées. Vous y trouverez un décryptage du circuit de financement, les étapes pour être habilité, sécuriser les versements et utiliser les fonds dans le respect de la réglementation.",      "button": "Télécharger le PDF gratuit",      "pdf": "taxe-apprentissage.pdf",      "image": "taxe-app-group-1-1300x1300.webp"    }  ] }



$ cat /home/user/menticode/guide/public/index.html

<!DOCTYPE html> <html lang="fr"> <head>   <meta charset="UTF-8">   <meta name="viewport" content="width=device-width, initial-scale=1.0">   <title>Les Guides de Référence Mentivis</title>   <link rel="preconnect" href="https://fonts.googleapis.com">   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">   <link rel="stylesheet" href="style.css"> </head> <body>    <!-- ── FORM SECTION ─────────────────────────────────────── -->   <section class="form-section" id="form-section">     <div class="container">       <div class="form-box">         <div class="form-header">           <h2 id="form-heading"></h2>           <p id="form-subheading"></p>         </div>          <form id="access-form" novalidate>           <div class="form-row">             <div class="field">               <label for="prenom" id="label-prenom"></label>               <input type="text" id="prenom" name="prenom" autocomplete="given-name" required>             </div>             <div class="field">               <label for="nom" id="label-nom"></label>               <input type="text" id="nom" name="nom" autocomplete="family-name" required>             </div>           </div>           <div class="form-row">             <div class="field">               <label for="email" id="label-email"></label>               <input type="email" id="email" name="email" autocomplete="email" required>             </div>             <div class="field">               <label for="telephone" id="label-telephone"></label>               <input type="tel" id="telephone" name="telephone" autocomplete="tel" required>             </div>           </div>           <div class="field">             <label for="entreprise" id="label-entreprise"></label>             <input type="text" id="entreprise" name="entreprise" autocomplete="organization" required>           </div>           <p class="form-error" id="form-error" hidden></p>           <button type="submit" id="form-submit" class="btn btn-primary btn-lg">             <span class="btn-text" id="submit-label"></span>             <span class="btn-spinner" hidden></span>           </button>         </form>       </div>        <!-- Thanks state -->       <div class="thanks-box" id="thanks-box" hidden>         <div class="thanks-icon">✓</div>         <h2 id="thanks-title"></h2>         <p id="thanks-message"></p>         <p id="thanks-expiry"></p>         <div class="token-row">           <span id="token-label-text"></span>           <code id="token-value"></code>         </div>         <div class="expiry-bar-wrap">           <div class="expiry-bar" id="expiry-bar"></div>         </div>         <p class="expiry-countdown" id="expiry-countdown"></p>       </div>     </div>   </section>    <!-- ── PAGE HERO ─────────────────────────────────────────── -->   <section class="hero">     <div class="container">       <h1 id="page-title"></h1>       <p id="page-subtitle"></p>     </div>   </section>    <!-- ── GUIDES ────────────────────────────────────────────── -->   <section class="guides-section">     <div class="container">       <div class="guides-list" id="guides-list"></div>     </div>   </section>    <!-- ── EXPIRED OVERLAY ───────────────────────────────────── -->   <div class="expired-banner" id="expired-banner" hidden>     <p id="expired-message"></p>   </div>    <script src="main.js"></script> </body> </html>


$ cat /home/user/menticode/guide/public/style.css
/* ── Variables ─────────────────────────────────────────── */
:root {
  --primary:    #0f2d5c;
  --primary-hover: #1a4a8a;
  --accent:     #e8541e;
  --accent-hover: #c94414;
  --text:       #1a1a2e;
  --muted:      #6b7280;
  --bg:         #f4f6fa;
  --white:      #ffffff;
  --border:     #dde1e9;
  --locked-bg:  #f0f0f0;
  --locked-text:#aaa;
  --success:    #0f7b41;
  --radius:     10px;
  --shadow:     0 4px 24px rgba(15,45,92,.10);
  --shadow-card:0 2px 12px rgba(15,45,92,.08);
}

/* ── Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.65;
  color: var(--text);
  background: var(--bg);
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }

/* ── Container ─────────────────────────────────────────── */
.container {
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Form Section ──────────────────────────────────────── */
.form-section {
  background: var(--primary);
  padding: 56px 0 64px;
}

.form-box {
  background: var(--white);
  border-radius: var(--radius);
  padding: 44px 48px;
  max-width: 760px;
  margin: 0 auto;
  box-shadow: var(--shadow);
}

.form-header {
  margin-bottom: 32px;
  text-align: center;
}
.form-header h2 {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}
.form-header p {
  color: var(--muted);
  font-size: .95rem;
}

/* Fields */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.form-row .field { margin-bottom: 0; }

label {
  font-size: .85rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: .02em;
}
input[type="text"],
input[type="email"],
input[type="tel"] {
  border: 1.5px solid var(--border);
  border-radius: 6px;
  padding: 11px 14px;
  font-size: .95rem;
  font-family: inherit;
  color: var(--text);
  transition: border-color .2s;
  background: var(--white);
}
input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(15,45,92,.1);
}
input.input-error { border-color: #dc2626; }

.form-error {
  color: #dc2626;
  font-size: .875rem;
  margin-bottom: 16px;
  background: #fef2f2;
  padding: 10px 14px;
  border-radius: 6px;
  border-left: 3px solid #dc2626;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 7px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s, opacity .2s, transform .1s;
}
.btn:active { transform: scale(.98); }
.btn-primary {
  background: var(--accent);
  color: var(--white);
}
.btn-primary:hover { background: var(--accent-hover); }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-lg {
  width: 100%;
  padding: 14px 24px;
  font-size: 1rem;
  margin-top: 8px;
}

/* Spinner */
.btn-spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Thanks box */
.thanks-box {
  background: var(--white);
  border-radius: var(--radius);
  padding: 44px 48px;
  max-width: 760px;
  margin: 0 auto;
  box-shadow: var(--shadow);
  text-align: center;
}
.thanks-icon {
  width: 56px; height: 56px;
  background: var(--success);
  color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 auto 20px;
}
.thanks-box h2 {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
}
.thanks-box p {
  color: var(--muted);
  margin-bottom: 10px;
  font-size: .95rem;
}
.thanks-box p strong { color: var(--text); }

.token-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 16px;
  margin: 16px 0;
  font-size: .85rem;
  color: var(--muted);
}
.token-row code {
  font-family: 'Courier New', monospace;
  font-size: .8rem;
  color: var(--primary);
  word-break: break-all;
  max-width: 320px;
}

/* Expiry bar */
.expiry-bar-wrap {
  height: 6px;
  background: var(--border);
  border-radius: 99px;
  overflow: hidden;
  margin: 12px 0 8px;
}
.expiry-bar {
  height: 100%;
  width: 100%;
  background: var(--success);
  border-radius: 99px;
  transition: width 1s linear, background .5s;
}
.expiry-bar.warning { background: #f59e0b; }
.expiry-bar.danger  { background: #dc2626; }

.expiry-countdown {
  font-size: .82rem;
  color: var(--muted);
  margin-bottom: 0 !important;
}

/* Expired banner */
.expired-banner {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 7px;
  padding: 14px 20px;
  max-width: 760px;
  margin: 20px auto 0;
  text-align: center;
  color: #991b1b;
  font-size: .9rem;
}

/* ── Hero ──────────────────────────────────────────────── */
.hero {
  background: var(--primary);
  padding: 0 0 56px;
  text-align: center;
  color: var(--white);
}
.hero h1 {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  margin-bottom: 14px;
  line-height: 1.25;
}
.hero p {
  font-size: 1.05rem;
  opacity: .82;
  max-width: 680px;
  margin: 0 auto;
}

/* ── Guides ────────────────────────────────────────────── */
.guides-section { padding: 64px 0 80px; }

.guides-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.guide-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  display: grid;
  grid-template-columns: 1fr 280px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: box-shadow .2s;
}
.guide-card:hover { box-shadow: var(--shadow); }
.guide-card:nth-child(even) { grid-template-columns: 280px 1fr; }
.guide-card:nth-child(even) .guide-body { order: 2; }
.guide-card:nth-child(even) .guide-image { order: 1; }

.guide-body {
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.guide-body h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 14px;
  line-height: 1.35;
}
.guide-body p {
  color: var(--muted);
  font-size: .93rem;
  line-height: 1.7;
  margin-bottom: 28px;
}

.guide-image {
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 240px;
}
.guide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.guide-image .img-placeholder {
  width: 80px; height: 80px;
  background: var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 2rem;
}

/* Download button */
.btn-download {
  align-self: flex-start;
  background: var(--primary);
  color: var(--white);
  padding: 12px 22px;
  font-size: .9rem;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-download:hover { background: var(--primary-hover); }

/* Locked state */
.btn-download.locked {
  background: var(--locked-bg);
  color: var(--locked-text);
  cursor: not-allowed;
  pointer-events: none;
  border: 1.5px dashed var(--border);
}
.lock-icon { font-size: .85em; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 768px) {
  .form-box, .thanks-box { padding: 32px 24px; }
  .form-row { grid-template-columns: 1fr; gap: 0; }

  .guide-card,
  .guide-card:nth-child(even) {
    grid-template-columns: 1fr;
  }
  .guide-card:nth-child(even) .guide-body { order: 1; }
  .guide-card:nth-child(even) .guide-image { order: 2; }
  .guide-image { min-height: 200px; }
  .guide-body { padding: 28px 24px; }
  .token-row { flex-direction: column; text-align: center; }
  .token-row code { max-width: 100%; }
}


$ cat /home/user/menticode/guide/public/main.js
const SESSION_KEY = 'mv_access';
const TOKEN_TTL   = 10 * 60 * 1000;

let content    = null;
let expiryTime = null;
let timerInterval = null;

// ── Bootstrap ────────────────────────────────────────────
async function init() {
  const res = await fetch('/api/content');
  content = await res.json();
  renderStatic();
  renderGuides();

  const saved = loadSession();
  if (saved && saved.expiresAt > Date.now()) {
    showThanks(saved.token, saved.expiresAt);
  } else {
    clearSession();
    showForm();
  }
}

// ── Static text ──────────────────────────────────────────
function renderStatic() {
  const { page, form } = content;
  setText('page-title',      page.title);
  setText('page-subtitle',   page.subtitle);
  setText('form-heading',    form.heading);
  setText('form-subheading', form.subheading);
  setText('label-prenom',    form.fields.prenom);
  setText('label-nom',       form.fields.nom);
  setText('label-email',     form.fields.email);
  setText('label-telephone', form.fields.telephone);
  setText('label-entreprise',form.fields.entreprise);
  setText('submit-label',    form.submit);
  setText('thanks-title',    form.thanks.title);
  setText('thanks-message',  form.thanks.message);
  setHTML('thanks-expiry',   form.thanks.expiry);
  setText('token-label-text',form.thanks.tokenLabel);
  setText('expired-message', form.thanks.expired);
}

// ── Guides grid ──────────────────────────────────────────
function renderGuides() {
  const list = document.getElementById('guides-list');
  list.innerHTML = content.guides.map((g, i) => `
    <div class="guide-card" id="card-${g.id}">
      <div class="guide-body">
        <h2>${g.title}</h2>
        <p>${g.description}</p>
        <button
          class="btn btn-download locked"
          id="btn-${g.id}"
          data-pdf="${g.pdf}"
          disabled
          aria-label="Télécharger ${g.title}"
        >
          <span class="lock-icon">🔒</span>
          ${g.button}
        </button>
      </div>
      <div class="guide-image">
        <img
          src="images/${g.image}"
          alt="${g.title}"
          onerror="this.parentElement.innerHTML='<div class=\'img-placeholder\'>📄</div>'"
          loading="${i === 0 ? 'eager' : 'lazy'}"
        >
      </div>
    </div>
  `).join('');
}

// ── Form submit ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('access-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form   = e.target;
    const btn    = document.getElementById('form-submit');
    const errEl  = document.getElementById('form-error');
    const spinner = btn.querySelector('.btn-spinner');
    const label   = btn.querySelector('.btn-text');

    clearErrors();
    btn.disabled = true;
    spinner.hidden = false;
    label.hidden   = true;

    const body = {
      prenom:     form.prenom.value.trim(),
      nom:        form.nom.value.trim(),
      email:      form.email.value.trim(),
      telephone:  form.telephone.value.trim(),
      entreprise: form.entreprise.value.trim(),
    };

    try {
      const res  = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        showError(errEl, data.error || content.form.errors.server);
        return;
      }

      saveSession(data.token, data.expiresAt);
      showThanks(data.token, data.expiresAt);

    } catch (_) {
      showError(errEl, content.form.errors.server);
    } finally {
      btn.disabled   = false;
      spinner.hidden = true;
      label.hidden   = false;
    }
  });

  init();
});

// ── UI states ────────────────────────────────────────────
function showForm() {
  document.getElementById('form-section').hidden  = false;
  document.getElementById('form-box') && (document.getElementById('form-box').hidden = false);
  document.getElementById('access-form').hidden   = false;
  document.getElementById('thanks-box').hidden    = true;
  document.getElementById('expired-banner').hidden = true;
  lockAllButtons();
}

function showThanks(token, expiresAt) {
  document.getElementById('access-form').hidden = true;
  document.getElementById('thanks-box').hidden  = false;
  document.getElementById('token-value').textContent = token;
  document.getElementById('expired-banner').hidden = true;

  expiryTime = expiresAt;
  unlockAllButtons(token);
  startCountdown(expiresAt);

  document.getElementById('guides-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showExpired() {
  stopCountdown();
  clearSession();
  document.getElementById('thanks-box').hidden   = true;
  document.getElementById('access-form').hidden  = false;
  document.getElementById('expired-banner').hidden = false;
  lockAllButtons();
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

// ── Buttons ──────────────────────────────────────────────
function unlockAllButtons(token) {
  content.guides.forEach(g => {
    const btn = document.getElementById(`btn-${g.id}`);
    if (!btn) return;
    btn.classList.remove('locked');
    btn.disabled = false;
    btn.innerHTML = `📄 ${g.button}`;
    btn.onclick = () => openPdf(token, g.pdf);
  });
}

function lockAllButtons() {
  content?.guides.forEach(g => {
    const btn = document.getElementById(`btn-${g.id}`);
    if (!btn) return;
    btn.classList.add('locked');
    btn.disabled = true;
    btn.innerHTML = `<span class="lock-icon">🔒</span> ${g.button}`;
    btn.onclick = null;
  });
}

function openPdf(token, filename) {
  if (expiryTime && Date.now() > expiryTime) {
    showExpired();
    return;
  }
  window.open(`/download/${token}/${filename}`, '_blank', 'noopener');
}

// ── Countdown ────────────────────────────────────────────
function startCountdown(expiresAt) {
  stopCountdown();
  const bar       = document.getElementById('expiry-bar');
  const countdown = document.getElementById('expiry-countdown');

  function tick() {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      showExpired();
      return;
    }
    const pct = (remaining / TOKEN_TTL) * 100;
    bar.style.width = `${pct}%`;
    bar.className   = 'expiry-bar' + (pct < 20 ? ' danger' : pct < 40 ? ' warning' : '');

    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    countdown.textContent = `Accès valable encore ${mins}:${String(secs).padStart(2, '0')}`;
  }

  tick();
  timerInterval = setInterval(tick, 1000);
}

function stopCountdown() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

// ── Session storage ──────────────────────────────────────
function saveSession(token, expiresAt) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, expiresAt }));
}
function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Helpers ──────────────────────────────────────────────
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function showError(el, msg) {
  el.textContent = msg;
  el.hidden = false;
}
function clearErrors() {
  const el = document.getElementById('form-error');
  el.hidden = true;
  el.textContent = '';
}