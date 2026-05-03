# Manuel Opérationnel — Mentivis

> **Version** : 1.0  
> **Date** : 2026-05-03  
> **Projet** : mentivis-web (Next.js 16, export statique, i18n FR/EN)  
> **Hébergement** : o2switch (Apache, FTP) + Vercel (serverless) + HubSpot (CRM)

---

## Table des matières

1. [Checklist Pré-Production (SEO, Sécurité, o2switch)](#1-checklist-pré-production-seo-sécurité-o2switch)
2. [Pourquoi un accès complet au serveur et au tableau de bord o2switch est nécessaire](#2-pourquoi-un-accès-complet-au-serveur-et-au-tableau-de-bord-o2switch-est-nécessaire)
3. [L'écosystème complet](#3-lécosystème-complet)
4. [Comment le site est mis à jour](#4-comment-le-site-est-mis-à-jour)
5. [Comment ça marche en détail](#5-comment-ça-marche-en-détail)
6. [Résolution des problèmes](#6-résolution-des-problèmes)
7. [Procédures de maintenance](#7-procédures-de-maintenance)
8. [Transition de domaine : sc3 → mentivis.com (OVH)](#8-transition-de-domaine--sc3--mentiviscom-ovh)

---

## 1. Checklist Pré-Production (SEO, Sécurité, o2switch)

### 1.1 SEO

| # | Action | Où | Statut |
|---|--------|-----|--------|
| 1 | Activer HTTPS + certificat SSL sur `sc3` | o2switch cPanel → SSL/TLS | ⬜ |
| 2 | Pointer `mentivis.com` vers `sc3bovu7233.universe.wf` | OVH Manager → Domaine → DNS | ⬜ |
| 3 | Rediriger `www` vers non-www (ou inverse) | `.htaccess` ou cPanel | ⬜ |
| 4 | Mettre à jour `robots.txt` : `Allow: /` au lieu de `Disallow: /` | `public/robots.txt` | ⬜ |
| 5 | Supprimer `X-Robots-Tag: noindex` pour le domaine de prod | `next.config.ts` (conditionnel) | ⬜ |
| 6 | Créer un compte Google Search Console | search.google.com | ⬜ |
| 7 | Soumettre le sitemap (`/sitemap.xml`) | Google Search Console | ⬜ |
| 8 | Vérifier que toutes les balises `<link rel="alternate" hreflang="...">` sont présentes | Code source des pages | ✅ |
| 9 | Vérifier que chaque page a un `canonical` pointant vers `https://www.mentivis.com` | Code source des pages | ✅ |
| 10 | Vérifier le `BreadcrumbJsonLd` sur toutes les pages | Rendu côté client | ✅ |

### 1.2 Sécurité

| # | Action | Où | Statut |
|---|--------|-----|--------|
| 1 | Désactiver le **cache HTTPS CDN** d'o2switch | o2switch cPanel → Cache HTTPS | ⬜ |
| 2 | Ajouter les headers de sécurité dans `.htaccess` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) | `public/.htaccess` | ⬜ |
| 3 | Masquer la version Apache (`ServerTokens Prod`, `ServerSignature Off`) | `.htaccess` ou config serveur | ⬜ |
| 4 | Vérifier que `robots.txt` ne bloque pas les assets JS/CSS | `public/robots.txt` | ✅ |
| 5 | Vérifier que le token API Vercel est roté si exposé | Vercel Dashboard → Environment Variables | ⬜ |
| 6 | S'assurer que `.env.local` n'est jamais commité | `.gitignore` | ✅ |
| 7 | Bloquer l'accès à `/admin` ou supprimer la route du build | Code + build | ⬜ |

### 1.3 o2switch (Configuration serveur)

| # | Action | Où | Pourquoi |
|---|--------|-----|----------|
| 1 | Désactiver le cache HTTPS CDN | cPanel → Cache HTTPS | Empêche les `ChunkLoadError` après déploiement |
| 2 | Activer Let's Encrypt (SSL gratuit) | cPanel → SSL/TLS Status | HTTPS obligatoire pour SEO et sécurité |
| 3 | Vérifier que `DirectoryIndex index.html` fonctionne | `.htaccess` | Les routes Next.js génèrent des dossiers `fr/index.html` |
| 4 | Vérifier que PHP n'est pas requis | cPanel → Select PHP Version | Le site est 100 % statique (HTML/CSS/JS) |
| 5 | Configurer les emails si besoin (`contact@mentivis.com`) | cPanel → Email Accounts | MX records à vérifier |

---

## 2. Pourquoi un accès complet au serveur et au tableau de bord o2switch est nécessaire

### 2.1 Limites du déploiement FTP automatique

Les scripts (`ftp_sync.py`, `ftp_clean_deploy.py`) permettent d'uploader les fichiers, mais **ils ne peuvent pas** :

- **Gérer les certificats SSL** : l'activation HTTPS se fait dans le cPanel o2switch, pas par FTP.
- **Contrôler le cache CDN** : o2switch utilise un cache HTTPS/CDN en amont d'Apache. Ce cache ignore les headers `.htaccess` et les paramètres `?nocache=1`. Seul le cPanel permet de le désactiver ou de le purger complètement.
- **Modifier la configuration Apache au niveau serveur** : certaines directives de sécurité (masquer la version du serveur, headers HSTS) nécessitent un accès à la configuration globale ou au moins au cPanel.
- **Gérer les DNS** : pointer `mentivis.com` vers le serveur o2switch se fait chez le registrar de domaine ou via les nameservers o2switch.
- **Créer des comptes email** : si vous utilisez `contact@mentivis.com` hébergé chez o2switch.

### 2.2 Ce qui est accessible par FTP vs. cPanel

| Action | FTP | cPanel |
|--------|-----|--------|
| Uploader des fichiers statiques | ✅ | ❌ (sauf file manager) |
| Modifier `.htaccess` | ✅ | ✅ (file manager) |
| Activer HTTPS / SSL | ❌ | ✅ |
| Désactiver le cache CDN | ❌ | ✅ |
| Voir les logs d'erreur Apache | ❌ | ✅ (Error Logs) |
| Gérer les DNS / MX | ❌ | ✅ |
| Créer des emails | ❌ | ✅ |
| Gérer les bases de données | ❌ | ✅ (non utilisé ici) |

### 2.3 Conséquence d'un accès limité

Sans accès cPanel, en cas de `ChunkLoadError` après un déploiement, **vous ne pouvez pas purger le cache CDN**. Vous devez attendre 30 à 120 minutes que le TTL expire, ou contacter le support o2switch. C'est pourquoi **le cache HTTPS CDN doit être désactivé avant la mise en production**.

---

## 3. L'écosystème complet

### 3.1 Architecture à trois niveaux

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            VISITEUR                                     │
│                    (navigateur, Googlebot)                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  COUCHE 1 — FRONTEND STATIQUE (o2switch)                                │
│  ───────────────────────────────────────                                │
│  Domaine : mentivis.com (futur)                                         │
│  Serveur : sc3bovu7233.universe.wf (prod)                               │
│            sc4bovu7233.universe.wf (dev)                                │
│  Type    : Hébergement mutualisé Apache                                 │
│  Contenu : HTML, CSS, JS, images, vidéos (export statique Next.js)      │
│  Accès   : FTP (FileZilla, scripts Python)                              │
│  Config  : .htaccess (réécriture, cache, headers)                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
              API calls (POST /api/submit-to-hubspot)
              JS fetch (client-side, CORS protégé)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  COUCHE 2 — BACKEND SERVERLESS (Vercel)                                 │
│  ─────────────────────────────────────                                  │
│  Domaine : mentivis-web.vercel.app (caché au public)                    │
│  Type    : Fonctions serverless (Edge Runtime)                          │
│  Routes  : /api/submit-to-hubspot  (relay formulaire → HubSpot)         │
│            /api/health             (check de santé, public)             │
│            /api/insights           (gestion articles, protégé)          │
│            middleware.ts           (Edge, filtre requêtes)              │
│  Déploiement : Git push → GitHub → Vercel (automatique)                 │
│  Sécurité : Bearer token, CORS strict, rate limiting 5 req/min/IP       │
│  Visibilité : Interdit aux robots (robots.txt, X-Robots-Tag, 403)       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
              POST api.hsforms.com
              (HubSpot Forms API v3)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  COUCHE 3 — SERVICES EXTERNES                                           │
│  ─────────────────────────────                                          │
│  HubSpot      : CRM, formulaires (contact relay + careers iframe)       │
│  Google Fonts : Chargement typographie (CDN Google)                     │
│  YouTube      : Vidéos intégrées (youtube-nocookie.com)                 │
│  GTM          : Google Tag Manager (uniquement en prod, Vercel)         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Flux de données — Formulaire de contact

```
Visiteur (o2switch) ──► POST https://mentivis-web.vercel.app/api/submit-to-hubspot
                              │
                              ▼ (Vercel vérifie CORS + Bearer token + rate limit)
                        Validation + honeypot
                              │
                              ▼
                        POST api.hsforms.com (HubSpot)
                              │
                              ▼
                        HubSpot CRM (contact créé/mis à jour)
```

### 3.3 Flux de données — Formulaire careers (candidature)

```
Visiteur (o2switch) ──► Charge un iframe HubSpot natif (hbspt.forms.create)
                              │
                              ▼ (Le formulaire est hébergé par HubSpot)
                        Upload CV directement chez HubSpot
                              │
                              ▼
                        HubSpot CRM (candidature reçue)
```

> **Pourquoi deux méthodes ?**  
> Le formulaire de contact utilise le relay Vercel pour cacher le Portal ID HubSpot et ajouter du rate limiting.  
> Le formulaire careers utilise l'iframe natif car l'upload de fichier (CV) n'est pas supporté par l'API HubSpot v3.

---

## 4. Comment le site est mis à jour

Il existe **trois chemins de déploiement**, selon le type de modification.

### 4.1 Chemin A — Mise à jour normale (incrémentale)

**Commande :**
```bash
./scripts/deploy.sh --prod
```

**Ce que fait le script :**
1. `git add -A && git commit -m "Deploy ..." && git push origin main`
2. Déclenche le déploiement automatique Vercel (GitHub → Vercel)
3. `npm run build:ftp` → génère le site statique dans `out/`
4. `FTP_HOST=sc3... FTP_USER=sc3... python3 scripts/ftp_sync.py` → upload incrémental

**Quand l'utiliser :**
- Modification de texte, nouveau contenu, correction mineure
- Ajout d'une page ou d'un article

**Risque :**
- Le script `ftp_sync.py` est **additif uniquement**. Il n'efface pas les anciens fichiers.
- Si les hash des chunks JavaScript changent (ce qui arrive à chaque build significatif), les anciens chunks restent sur le serveur et peuvent causer des `ChunkLoadError` si le CDN les sert.

**Durée :** ~5 minutes

---

### 4.2 Chemin B — Déploiement propre (recommandé pour les changements majeurs)

**Commande :**
```bash
rm -rf out .next
npm run build:ftp
FTP_HOST=sc3bovu7233.universe.wf \
FTP_USER=sc3bovu7233 \
FTP_PASSWORD=<mot_de_passe> \
python3 scripts/ftp_clean_deploy.py
```

**Ce que fait le script :**
1. Se connecte en FTP au serveur
2. **Supprime** les anciens dossiers de build (`fr/`, `en/`, `_next/`, `site-images/`, etc.)
3. **Préserve** les fichiers manuels (`.htaccess`, `robots.txt`, favicons, `logo-noir.svg`, `guide-images/`, `mentivis-solutions/`, etc.)
4. **Upload** tous les nouveaux fichiers (893 fichiers, ~159 Mo)

**Quand l'utiliser :**
- Refactoring majeur du code
- Changement de structure (ex: passage de `fr.html` à `fr/index.html`)
- Après un `ChunkLoadError` (erreur de chunk)
- Mise en production initiale

**Avantage :** Zéro fichier orphelin sur le serveur. Cohérence garantie.

**Inconvénient :** Downtime de ~10–12 minutes (le site peut être partiellement mis à jour pendant l'upload).

**Durée :** ~10–12 minutes

---

### 4.3 Chemin C — Mise à jour Vercel uniquement

**Commande :**
```bash
git push origin main
```

**Ce que fait Git :**
- Push sur `main` déclenche le webhook GitHub → Vercel
- Vercel rebuild et redéploie les fonctions serverless automatiquement

**Quand l'utiliser :**
- Modification d'une API route (`/api/submit-to-hubspot`, `/api/health`)
- Modification du middleware (`src/middleware.ts`)
- Changement de variable d'environnement Vercel

**Avantage :** Aucune manipulation FTP nécessaire.

---

## 5. Comment ça marche en détail

### 5.1 Pipeline de build (Next.js → Export statique)

**Fichier :** `scripts/build-ftp.js`

```
1. Supprime .next/ et out/ (évite les chunks obsolètes)
2. Sauvegarde src/app/api/ → .api-temp/
3. Supprime src/app/api/ (Next.js export statique n'accepte pas les API routes)
4. Exécute : node scripts/txt2json.js
5. Exécute : node scripts/gen-llms-txt.js
6. Exécute : npx next build --webpack (AVEC NEXT_BUILD_TARGET=ftp)
7. Restaure src/app/api/ depuis .api-temp/
```

**Pourquoi supprimer `src/app/api/` ?**
Next.js en mode `output: "export"` ne supporte pas les routes API. Si le dossier `api/` existe dans `src/app/`, le build échoue. D'où la suppression temporaire.

**Pourquoi `--webpack` et pas Turbopack ?**
Turbopack (le bundler expérimental de Next.js) a un bug de nommage des chunks (issues #87680, #88775). Le HTML généré référence des fichiers JS qui n'existent pas, provoquant des `ChunkLoadError`. Webpack est stable et utilisé en production.

> **Règle d'or :** `npm run dev` utilise Turbopack (rapide, local uniquement). `npm run build` et `npm run build:ftp` utilisent `--webpack` (stable, production).

### 5.2 Routage et trailing slash

**Configuration (`next.config.ts`) :**
```typescript
output: "export",
trailingSlash: true
```

**Résultat :**
- La route `/fr/contact` génère un dossier `out/fr/contact/index.html`
- Apache avec `DirectoryIndex index.html` sert ce fichier automatiquement
- L'URL visible reste `/fr/contact/` (avec slash final)

**Pourquoi `trailingSlash: true` ?**
Sans cela, Next.js génère `fr.html` (fichier plat). Or, Apache avec `Options -MultiViews` risque de servir `fr.html` au lieu de `fr/index.html`, ou de créer des conflits. Le mode dossier est plus robuste sur Apache mutualisé.

### 5.3 Stratégie de cache (`.htaccess`)

**Fichier :** `public/.htaccess`

```apache
# HTML : jamais mis en cache (pour voir les mises à jour immédiatement)
<FilesMatch "\.html$">
  Header set Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate"
</FilesMatch>

# Assets statiques (JS, CSS, images) : cache immutable 1 an
# Les noms de fichiers incluent un hash, donc ils changent à chaque build
<FilesMatch "\.(js|css|png|jpg|svg|webp|avif|woff2)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

**Le piège du cache HTTPS CDN d'o2switch :**
o2switch place un **cache CDN en amont d'Apache**, sur la couche HTTPS. Ce cache :
- Ignore les headers `Cache-Control` de `.htaccess`
- Ignore les paramètres `?nocache=1`
- Met en cache les fichiers HTML indépendamment par chemin (`/fr/`, `/fr/insights/`, etc.)
- Le bouton "Purger le cache" dans cPanel ne purge souvent que la page d'accueil

**Conséquence :** Après un déploiement, le CDN peut servir un vieux HTML qui référence d'anciens chunks JS (supprimés). Résultat : `ChunkLoadError` pour le visiteur.

**Solution :** Désactiver complètement le cache HTTPS CDN dans le cPanel o2switch.

### 5.4 Bilinguisme (FR / EN)

**Architecture des routes :**
```
src/app/
  [lang]/              # Route dynamique : "fr" ou "en"
    page.tsx           # Page d'accueil
    contact/
      page.tsx
    solutions/
      page.tsx
    ...
```

**Fichiers de traduction :**
- `src/messages/fr.json`
- `src/messages/en.json`

**Règles :**
- Les deux fichiers ont **exactement la même structure** de clés
- Seules les valeurs diffèrent
- Aucune chaîne de texte en dur dans les composants
- Tous les liens internes utilisent le préfixe `/${lang}/`

### 5.5 Sécurité multi-couches

#### 5.5.1 Masquage du domaine Vercel

Le backend Vercel ne doit jamais être indexé ni visité directement. Trois protections :

1. **`public/robots.txt`** :
   ```
   User-agent: *
   Disallow: /
   ```

2. **`X-Robots-Tag: noindex`** (dans `next.config.ts`) :
   ```typescript
   async headers() {
     return [{
       source: "/:path*",
       headers: [{ key: "X-Robots-Tag", value: "noindex" }]
     }];
   }
   ```

3. **`src/middleware.ts`** :
   ```typescript
   if (host.endsWith('.vercel.app') && !pathname.startsWith('/api/')) {
     return new Response('Forbidden', { status: 403 });
   }
   ```

**Test :**
```bash
curl -I https://mentivis-web.vercel.app/fr        # Doit retourner 403
curl https://mentivis-web.vercel.app/api/health    # Doit retourner 200 { "status": "ok" }
```

#### 5.5.2 Protection des API routes

Toutes les API (sauf `/api/health`) nécessitent :
```
Authorization: Bearer <INTERNAL_TOKEN>
```

- Le token est stocké côté serveur dans `process.env.INTERNAL_TOKEN` (variable Vercel)
- Côté client, il est en dur dans `src/lib/hubspot.ts` (public par nécessité, car le navigateur doit l'envoyer)
- Le token public est acceptable car il est protégé par :
  - CORS (origines autorisées uniquement)
  - Rate limiting (5 requêtes/minute/IP)
  - Le domaine Vercel est masqué

**Origines CORS autorisées :**
- `http://sc4bovu7233.universe.wf` et `https://...` (dev)
- `http://sc3bovu7233.universe.wf` et `https://...` (prod)
- `http://mentivis.com`, `https://mentivis.com`, `http://www.mentivis.com`, `https://www.mentivis.com` (futur)

---

## 6. Résolution des problèmes

### 6.1 ChunkLoadError après déploiement

**Symptôme :** La console du navigateur affiche `ChunkLoadError` ou `Loading chunk X failed`.

**Cause :** Le CDN a servi un vieux HTML qui référence des chunks JS qui n'existent plus.

**Solution immédiate :**
1. Se connecter au cPanel o2switch
2. Trouver le paramètre **Cache HTTPS** (pas Varnish, pas Apache)
3. **Désactiver complètement** le cache HTTPS

**Alternative :**
Exécuter un déploiement propre :
```bash
rm -rf out .next
npm run build:ftp
FTP_HOST=sc3... FTP_USER=sc3... python3 scripts/ftp_clean_deploy.py
```

**Dernier recours :** Attendre 30 à 120 minutes que le TTL du CDN expire.

---

### 6.2 Page 404 ou contenu vide

**Symptôme :** Une page retourne 404 ou reste blanche.

**Vérifications :**
1. Se connecter en FTP et vérifier que le dossier existe (ex: `fr/insights/index.html`)
2. Vérifier que `.htaccess` contient `DirectoryIndex index.html`
3. Vérifier que le build a bien généré le dossier (regarder dans `out/` en local)
4. Faire un hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)

---

### 6.3 Formulaire qui ne soumet pas

**Symptôme :** Le formulaire de contact reste bloqué ou affiche une erreur.

**Vérifications :**
1. Ouvrir les outils de développement → onglet Network
2. Vérifier que la requête POST vers `mentivis-web.vercel.app/api/submit-to-hubspot` retourne 200
3. Si 403 → problème de CORS ou de Bearer token
4. Si 429 → rate limiting (trop de requêtes depuis la même IP)
5. Vérifier que le domaine actuel est dans la liste des origines CORS autorisées (Section 5.5.2)
6. Vérifier que `INTERNAL_TOKEN` est correctement défini dans les variables d'environnement Vercel

---

### 6.4 Styles cassés ou mise en page incorrecte

**Symptôme :** Le site s'affiche sans CSS ou avec une mise en page brisée.

**Vérifications :**
1. Ouvrir les outils de développement → onglet Console
2. Vérifier s'il y a des erreurs 404 sur des fichiers `.css` ou `.js`
3. Se connecter en FTP et vérifier que `_next/static/css/...` existe
4. Si des fichiers manquent, relancer un `ftp_clean_deploy.py`

---

## 7. Procédures de maintenance

### 7.1 Fréquence recommandée

| Fréquence | Action | Outils |
|-----------|--------|--------|
| **Hebdomadaire** | Vérifier Google Search Console (erreurs de crawl, indexation) | search.google.com |
| **Hebdomadaire** | Vérifier les soumissions HubSpot (formulaires reçus) | app.hubspot.com |
| **Mensuel** | Vérifier les logs d'erreur Apache (cPanel → Error Logs) | cPanel |
| **Trimestriel** | Mettre à jour les dépendances Next.js (`npm update`) | Terminal |
| **Trimestriel** | Vérifier les avis de sécurité (npm audit) | Terminal |
| **À chaque déploiement** | Vérifier toutes les pages principales sur mobile et desktop | Navigateur |

### 7.2 Avant chaque déploiement en production

**Checklist rapide :**
- [ ] `rm -rf out .next` (build propre)
- [ ] `npm run build:ftp` (pas d'erreur)
- [ ] Vérifier la cohérence des chunks : `grep -r 'main-app[^"]*\.js' out/ | sort -u` (doit afficher UN seul nom de fichier)
- [ ] Vérifier que `out/fr/` et `out/en/` contiennent bien des `index.html`
- [ ] Vérifier que `.htaccess` est présent dans `out/`
- [ ] Si changement majeur : utiliser `ftp_clean_deploy.py`, pas `ftp_sync.py`
- [ ] Après déploiement : vider le cache navigateur et tester 3–4 pages

### 7.3 Rotation des identifiants (sécurité)

| Identifiant | Où | Quand changer |
|-------------|-----|---------------|
| Mot de passe FTP o2switch | cPanel → FTP Accounts | Tous les 6 mois, ou si partagé avec un tiers |
| Token API Vercel (`INTERNAL_TOKEN`) | Vercel Dashboard → Environment Variables | Si soupçon d'exposition |
| Clés HubSpot | HubSpot Settings | Si comportement anormal des formulaires |

---

## 8. Transition de domaine : sc3 → mentivis.com (OVH)

### 8.1 Avant le switch DNS

- [ ] Vérifier que le build prod est stable sur `https://sc3bovu7233.universe.wf`
- [ ] Activer SSL Let's Encrypt sur `sc3` via cPanel → SSL/TLS Status
- [ ] Tester HTTPS : pas de mixed content, pas d'erreur de certificat
- [ ] Réduire le TTL DNS à 300s chez OVH 24h avant le switch (OVH Manager → Domaine → DNS → Zone DNS → TTL minimal)
- [ ] Backup des DNS actuels (OVH Manager → Exporter la zone DNS)

### 8.2 Changement DNS (OVH Manager)

1. Se connecter à [OVH Manager](https://www.ovh.com/manager) → Web Cloud → Domaines → `mentivis.com`
2. Onglet **Zone DNS**
3. Supprimer ou modifier l'enregistrement **A** existant pour `@` (root) :
   - Type : `A`
   - Cible : `<IP_de_sc3bovu7233.universe.wf>` (récupérable via `ping sc3bovu7233.universe.wf`)
   - TTL : 300
4. Ajouter ou modifier l'enregistrement **A** pour `www` :
   - Type : `A`
   - Cible : même IP que `@`
   - TTL : 300
5. Vérifier les enregistrements MX (si emails chez OVH) — ne pas les toucher
6. Vérifier les enregistrements TXT (SPF, DKIM) — ne pas les toucher
7. Appliquer les modifications

> **Alternative (redirection www) :** Si vous préférez rediriger `www.mentivis.com` → `mentivis.com`, utiliser un enregistrement **CNAME** `www` → `mentivis.com.` (avec le point final) ou configurer la redirection dans le cPanel o2switch après le pointage.

### 8.3 Configuration cPanel o2switch

1. **Ajouter le domaine** :
   - cPanel → **Addon Domains** ou **Aliases** (selon la config o2switch)
   - Domaine : `mentivis.com`
   - Document Root : `public_html` (même que `sc3bovu7233.universe.wf`)
   - Si "Addon Domain" force un sous-dossier, utiliser **Alias** (Parked Domain) à la place

2. **Forcer HTTPS** :
   - cPanel → **Domains** → Gérer `mentivis.com` → Forcer HTTPS redirection
   - Ou ajouter dans `.htaccess` :
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

3. **Redirection www ↔ non-www** (choisir une option) :
   - Si vous préférez `mentivis.com` (sans www) :
   ```apache
   RewriteCond %{HTTP_HOST} ^www\.mentivis\.com$ [NC]
   RewriteRule ^(.*)$ https://mentivis.com/$1 [L,R=301]
   ```
   - Si vous préférez `www.mentivis.com` :
   ```apache
   RewriteCond %{HTTP_HOST} ^mentivis\.com$ [NC]
   RewriteRule ^(.*)$ https://www.mentivis.com/$1 [L,R=301]
   ```

### 8.4 Mise à jour du code

1. **CORS Vercel** : Ajouter `https://mentivis.com` et `https://www.mentivis.com` dans les origines autorisées de chaque API route (`src/app/api/*/route.ts`)

2. **GTM** : Activer pour la prod :
   ```bash
   # Vercel Dashboard → Project Settings → Environment Variables
   NEXT_PUBLIC_GTM_ID=GTM-PM93CCQL
   ```
   Redéployer Vercel : `git push origin main`

3. **Robots** : Modifier `public/robots.txt` :
   ```
   User-agent: *
   Allow: /
   Sitemap: https://mentivis.com/sitemap.xml
   ```

4. **Noindex conditionnel** : Modifier `next.config.ts` pour ne pas envoyer `X-Robots-Tag: noindex` sur les domaines de prod :
   ```typescript
   async headers() {
     const host = req.headers.get('host') || '';
     if (host.includes('vercel.app')) {
       return [{
         source: "/:path*",
         headers: [{ key: "X-Robots-Tag", value: "noindex" }]
       }];
     }
     return [];
   }
   ```
   *(Nécessite d'accéder à `req` dans headers — si impossible avec export statique, supprimer le header `X-Robots-Tag` complètement et gérer le noindex côté Vercel uniquement via middleware.)*

5. **Canonical** : Vérifier que `src/app/sitemap.ts` et les métadonnées génèrent des URLs `https://mentivis.com/...`

### 8.5 Post-switch (vérifications)

- [ ] `curl -I https://mentivis.com/fr` → 200, pas de `X-Robots-Tag: noindex`
- [ ] `curl -I https://mentivis.com/sitemap.xml` → 200
- [ ] `curl -I https://www.mentivis.com` → 301 vers `https://mentivis.com` (ou inverse selon choix)
- [ ] `curl -I http://mentivis.com` → 301 vers `https://mentivis.com`
- [ ] Tester le formulaire de contact (soumission + réception HubSpot)
- [ ] Tester le formulaire careers (iframe HubSpot)
- [ ] Vérifier Google Search Console → propriété `mentivis.com` → soumettre sitemap
- [ ] Vérifier Google Analytics / GTM (si activé)
- [ ] Vérifier les emails (`contact@mentivis.com`) si MX chez OVH

### 8.6 Rollback (si catastrophe)

1. Repointer les DNS OVH vers l'ancienne IP ou activer la zone DNS précédente
2. Attendre 5–15 minutes (TTL 300s)
3. Purger le cache navigateur + CDN

---

## Annexes

### A. Commandes utiles

```bash
# Build local (dev)
npm run dev

# Build pour FTP (prod)
npm run build:ftp

# Déploiement complet (git + build + ftp)
./scripts/deploy.sh --prod

# Déploiement propre (supprime anciens fichiers)
rm -rf out .next
npm run build:ftp
FTP_HOST=sc3bovu7233.universe.wf FTP_USER=sc3bovu7233 python3 scripts/ftp_clean_deploy.py

# Vérifier les chunks
grep -r 'main-app[^"]*\.js' out/ | sort -u

# Taille du build
du -sh out/

# IP du serveur prod
ping sc3bovu7233.universe.wf
```

### B. Points d'accès critiques

| Service | URL | Identifiant |
|---------|-----|-------------|
| o2switch cPanel (prod) | `sc3bovu7233.universe.wf:2083` | `sc3bovu7233` |
| o2switch cPanel (dev) | `sc4bovu7233.universe.wf:2083` | `sc4bovu7233` |
| Vercel Dashboard | `vercel.com` | Compte GitHub lié |
| HubSpot | `app.hubspot.com` | Compte Mentivis |
| Google Search Console | `search.google.com` | Compte Google |
| OVH Manager | `ovh.com/manager` | Compte OVH |

### C. Fichiers importants du projet

| Fichier | Rôle |
|---------|------|
| `next.config.ts` | Configuration build, headers, export statique |
| `scripts/build-ftp.js` | Pipeline de build pour FTP (supprime cache, gère API routes) |
| `scripts/ftp_sync.py` | Upload incrémental FTP |
| `scripts/ftp_clean_deploy.py` | Upload complet avec suppression préalable |
| `scripts/deploy.sh` | Script de déploiement global (git + build + ftp) |
| `public/.htaccess` | Configuration Apache (rewrite, cache, headers) |
| `public/robots.txt` | Directives pour les crawlers |
| `src/app/sitemap.ts` | Génération dynamique du sitemap (70 URLs) |
| `src/middleware.ts` | Edge middleware (403 sur vercel.app) |
| `src/lib/hubspot.ts` | Configuration HubSpot (token, IDs de formulaires) |

---

*Fin du manuel. Pour toute question ou mise à jour, modifier ce fichier directement dans le dépôt et le redéployer.*
