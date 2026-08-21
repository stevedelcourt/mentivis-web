# GTM / Google Tag Audit — mentivis.com (sc3)

**Date :** 2026-08-21
**Workspace :** `mentivis-web/` (Next.js 16 — export statique `out/`, déployé o2switch via FTP)

## Identifiants

| Élément | Valeur | Source |
|---|---|---|
| Conteneur GTM | `GTM-PM93CCQL` | `src/lib/config.ts:14`, `src/components/GTMClient.tsx` (supprimé → désormais `src/app/layout.tsx`), `docs/process.md` |
| Google Tag / GA4 Measurement ID | `G-NX7WKDYB1T` | `docs/process.md:1182`, §22.4 « Configuration Tag: Google Tag G-NX7WKDYB1T » |
| Env de pilotage | `NEXT_PUBLIC_GTM_ID` | défini en prod (Vercel secret) et en FTP (`scripts/build-ftp.js:57`) |

## 1. AUDIT — comment le tag `G-NX7WKDYB1T` est-il chargé ?

| Élément | Où | Code |
|---|---|---|
| Snippet GTM (`gtm.js`) | `src/app/layout.tsx` (dans `<head>` serveur, synchrone) | `(function(w,d,s,l,i){…})(…,'GTM-PM93CCQL')` |
| `gtag()` défini + consent mode | `src/app/layout.tsx` (`<head>` serveur, avant GTM) | `gtag('consent','default',{ad_storage:'denied',…})` |
| `gtag('config', 'G-NX7WKDYB1T')` | **Aucun** dans le source | — |
| Google Tag GA4 | **Déployé dans le conteneur GTM** (tag « Google Tag G-NX7WKDYB1T » dans `GTM-PM93CCQL`) | visible uniquement côté conteneur |

**Conclusion : scénario (c)** — le Google Tag est chargé par une balise déployée dans le conteneur GTM. Aucun `gtag('config')` séparé dans le HTML → pas de motif `gtm.js` + `gtag('config')` (scénario a, non supporté après le 02/10/2026).

## 2. DIAGNOSTIC

- **Statut : CONFORME** pour la dépreciation du 02/10/2026.
- Raison : le snippet `gtm.js` (GTM) est présent et le Google Tag GA4 n'est pas dupliqué via un `gtag('config')` en dur dans le HTML — il est géré par le conteneur GTM, implémentation supportée.
- Le `gtag('consent','default', …)` en `<head>` est la configuration **consent mode v2** recommandée, pas une config de tag → non concerné.

## 3. CORRECTION

Non requise (conforme). Les scénarios A/B ne s'appliquent pas.

## 4. VÉRIFICATION (post-déploiement, manuelle requise)

La présence *effective* du tag `G-NX7WKDYB1T` dans `GTM-PM93CCQL` ne se voit pas dans le code — vérification manuelle obligatoire :

- [ ] **GTM Preview** (`GTM-PM93CCQL`) : sur une page `fr/`/`en/`, confirmer qu'un tag de type **Google Tag** avec ID `G-NX7WKDYB1T` se déclenche (`gtm.js` + `page_view` GA4).
- [ ] **Tag Assistant** (extension) : une seule instance GA4 (`G-NX7WKDYB1T`) active (pas de double-fire).
- [ ] **Chrome DevTools → Network** : filtrer `google-analytics.com/g/collect` → `page_view` présent après consentement ; pas de requête avant acceptation cookies.
- [ ] **Consent mode** : après refus (CookieConsent), `gtm.js` charge mais `g/collect` reste bloqué tant que `analytics_storage != 'granted'`.
- [ ] Vérifier que le conteneur ne contient **pas** de second tag GA4 en `gtag('config')` en dur (doublon).

---

## Amélioration appliquée (2026-08-21) — GTM synchrone en `<head>`

Le snippet GTM était auparavant injecté côté client via `useEffect` (`GTMClient.tsx`), donc après hydratation. Il est désormais rendu de façon **synchrone dans `<head>`** (serveur) dans `src/app/layout.tsx`, immédiatement après le script `consent default`. Le consent mode étant déjà en `<head>` serveur, l'ordre reste correct (consent → GTM).

Changements :
- `src/app/layout.tsx` : ajout de `GTM_SNIPPET` (conditionné par `NEXT_PUBLIC_GTM_ID`) en `<head>`.
- `src/components/GTMClient.tsx` : **supprimé** (code mort).
- `src/app/[lang]/layout.tsx` : retrait de l'import et du `<GTMClient />` (évite un double chargement GTM).

Vérification build : `out/fr/index.html` / `out/en/index.html` doivent contenir `gtm.js?id=GTM-PM93CCQL` **une seule fois**, dans `<head>`, après le script `consent default`.
