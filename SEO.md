# SEO — mentivis.com — journal des changements

Site statique Next.js (`npm run build:ftp` → `out/` → SC3 `public_html` via rsync SSH).
Build cible : `out/sitemap.xml`, JSON-LD par page, `out/llms.txt`.

## 2026-09-23 — Audit referentiel : 6 causes "Discovered - currently not indexed" (95 FR + 95 EN)

Contexte : Search Console signale les 190 pages `/referentiel/[slug]/` en "Discovered -
currently not indexed" (détecté 2025-01-18). Audit complet (crawl sitemap, manifest,
fetch live) le 2026-09-23 → 6 causes. Correctifs appliqués :

1. **JSON-LD TechArticle** (`src/app/[lang]/referentiel/[slug]/ReferentielDetailClient.tsx`) :
   `headline` plafonné à 110 caractères, `author.url` + `publisher.url` →
   `https://mentivis.com`, logo publisher = PNG existant
   `images/mentivis-logo-400x400.png` (dims réelles vérifiées 512×512 via sips/file —
   pas de SVG, inéligible aux rich results), `inLanguage` `fr-FR`/`en-US` (cohérent
   avec le reste du site, pas `en-GB`). `datePublished`/`dateModified` restent
   statiques (`2025-06-01`/`2026-09-07`) : aucune date par article n'existe dans
   `src/content/referentiel/*.json` ni `referentiel-meta.ts`. BreadcrumbList existant
   conservé, pas de doublon.
2. **FAQPage homepage** (`src/app/[lang]/page.tsx`) : déduplication déjà faite le
   2026-09-07 (`61444aa`) — vérifié 1 seul bloc FAQPage dans `out/fr|en/index.html`
   (le 2e hit `rg` est le payload RSC, pas un bloc). **Alignement ajouté** : le
   JSON-LD reprenait 5 Q/A différentes du FAQ visible (6 Q/A) → réécrit pour
   refléter le visible **verbatim, même ordre**, localisé FR/EN (le bloc FR était
   hardcodé aussi sur `/en/`). Page rendue `async` pour résoudre `lang`.
3. **Sitemap lastmod** (`src/app/sitemap.ts`) : déjà statique `2026-09-07` partout,
   aucun `new Date()` dynamique pour le contenu → pas de changement.
4. **Hubs sitemap** : `/fr/referentiel/` + `/en/referentiel/` déjà présents via
   `STATIC_PAGES` (vérifié dans `out/sitemap.xml`) → pas de changement.
5. **Sidebar duplication** (`ReferentielSidebar.tsx` + `ReferentielDetailClient.tsx`) :
   nouveau mode `compact` sur les pages détail — top 5 même `cible` + tags partagés
   (même logique que `ReferentielRelated`), titre seul + lien "Voir tous les
   articles" → `/{lang}/referentiel/`. Hub inchangé (liste complète, 95 vérifiés).
   Page détail : 5 liens uniques + hub link (vérifié).
6. **Titres + descriptions** (`[slug]/page.tsx`) : le double suffixe était réel
   (`… | Le Référentiel — Mentivis` + template layout `%s | Mentivis`) → titres en
   `absolute` (bypass template) avec règle H1 ≤30 → `— Le Référentiel Mentivis`
   (EN : `— The Reference Mentivis`), 30–45 → `— Mentivis`, >45 → H1 seul.
   Descriptions plafonnées à **155 caractères rendus** (prise en compte de
   l'expansion des entités HTML `'`→`&#x27;`, troncature au mot + `…`, données
   intactes). Résultat : 0/190 descriptions >155 (183 entre 130–155) ; 127/190
   titres ≤65 — les 63 restants sont des H1 seuls >65 (règle appliquée à la lettre ;
   option : hard-cap envisagée, non retenue).

Validation `out/` : TechArticle complet (FR+EN), FAQPage ×1 + Q1 verbatim, hubs au
sitemap sans lastmod dynamique, sidebar détail 5 + hub link, hub 95 intacts.

## 2026-09-23 — Divers

- `/landing` : copie de `/contact` (FR+EN) avec hero OF dédié (`d2cfd46`).
- `/of` : suppression segment "Cas clients" UseCaseSection (`b3fcbf8`).

## 2026-09-20 — Heroes, OG, homepage

- Heroes : `hero-2.avif` (HP, `1a9e700`), `hero-1.avif` 1920×1097 (HP, `856d496`),
  `hero-2.avif` → enterprise (`9e986fe`), overlay `ImageHero` 0.35→0.15 site-wide
  (`c3e3ff1`), `hero-1a.avif` 1372×784 (HP, `b45dca7`), `hero-1c.avif` 3911×1800
  (HP, `f7e18bc`) puis crop 3526×1800 (`d3896a7`), `hero-1b.avif` (inutilisé,
  `7731701`), `men-enterprise.avif` 2000×1143 (`16ef420`) puis 2000×991 (`5264e45`).
- OG par page (`src/lib/og.ts`, `38c78f4`) : helper `getOgImage()` + hero par page
  (HP `hero-1c`, enterprise `men-enterprise`, of, about…), articles insights via
  `heroImage`, referentiel via `referentiel-og.jpg`.
- Homepage : 3 derniers insights par date (`c9cc6e9`), suppression emdashes `—`
  pages top-menu, texte EN "Not only a consulting firm." (`38c78f4`).
- `/fr|en/enterprise` : retour ligne hero après "formation"/"into" (`5264e45`).
- CI : deploy FTP auto désactivé sur push, manuel uniquement (`6902325`).

## 2026-09-19 — Hydration #418

- `93061b6` CollectionPage + filtres client referentiel, `694bb1f` filtres SSR-safe,
  `bd9cbe1` trailing slash + search params + PageShell, `992ee4f` final
  (`useContactUrl` SSR-safe, `useSearchParams` mounted+pushState, trailing slash).
- `/mentivisos` CTA bas → `open.mentivisos.com?utm_source=mentivis.com`, `target=_blank`.

## 2026-09-07 — Vague SEO/GEO (TODO1-9)

- `6d88796` hub referentiel CollectionPage + sitemap lastmod statique (TODO4-5).
- `a6388d9` 3 pages piliers (creation-organisme-formation, ecole-entreprise,
  cabinet-conseil-formation) + sitemap (TODO6).
- `dd244b1` hero `next/image` alt+priority (TODO7).
- `4428c1e` `llms.txt` complet + redirect www→non-www (TODO8-9).
- `baa3126` teasers OF/enterprise/home vers piliers (TODO 6c-d-e).
- `fc01839` FAQ visibles bilingues + emdashes→hyphens (piliers).
- `d546a5e` "Articles pratiques" + footer "Le Référentiel" bilingue.
- `0f3bc32` tableau CHANGEMENTS-SEO-GEO.md par URL ; `62de326` `llms.txt` encoding.
- Détail par URL : voir `CHANGEMENTS-SEO-GEO.md`.

## 2026-08-17 — Étude IA (HANDOFF-IA-STUDY.md)

- Article `lia-et-la-transformation-de-leducation-2026-2030` + PDF + bloc
  téléchargement HubSpot ; fix `hubspot.ts` slash final (CORS 308) ; middleware
  `guide-pdf` (dev only).

## 2026-07 — Divers SEO

- 2026-07-23/24 : slugs careers encodés, postings supprimés (état vide).
- 2026-07-20 : 1 posting retiré, `noindex` sur 3 restants.
- 2026-07-14 : sitemap double-slash homepage (GSC High, `edc1c71`) ; timezone
  `VideoObject` uploadDate (GSC, `89fe124`).
- 2026-07-12 : rewrite page enterprise + 5 articles referentiel GEPP + cross-links.
- 2026-07-10 : annonce MentivisOS Open + fixes SEO.

## 2026-06 — Fondations

- 2026-06-04 : `twitter:image` sync, OG par page, FAQPage/Person JSON-LD, stub Brevo
  (`009d6b3`) ; fix doublon URLs vidéo sitemap (`2794d1b`).
- 2026-06-03 : support EN 180 articles + routing lang (`abbbe08`) ; EN referentiel
  au sitemap (`c064288`) ; pitch MentivisOS sur 125 articles (`bbfb5ed`) ;
  referentiel FR+EN dans `llms.txt` (`4c0417a`).

## Règles en vigueur (ne pas régresser)

- FTP/o2switch : **ne jamais supprimer `_next/`** au déploiement (rsync sans
  `--delete` sur `_next/`, chunks anciens conservés — évite 404 + hydration #418).
- Titres : `absolute` sur referentiel (bypass template `%s | Mentivis`) ; pas de
  double suffixe marque.
- Descriptions : cap rendu 155 caractères (entités incluses), données intactes.
- JSON-LD : 1 seul FAQPage homepage = visible verbatim ; TechArticle complet sur
  détail referentiel ; logo PNG uniquement (jamais SVG).
- Sitemap : lastmod statiques, jamais `new Date()` pour le contenu.
- Sidebar détail ≤5 + lien hub ; hub = liste complète.
- Pas de `LANG_SCRIPT` (hydration) ; `suppressHydrationWarning` sur `<html>`.
