/* eslint-disable */
// Full article data with body content — used ONLY for article detail pages.
// For listings and cards, use @/data/referentiel-meta (much lighter, no body content).

import type { ReferentielArticleMeta } from "./referentiel-meta";
import { CATEGORY_LABELS } from "./referentiel-meta";
export { CATEGORY_LABELS };
import article1 from "../content/referentiel/comment-obtenir-la-certification-qualiopi.json";
import article2 from "../content/referentiel/comment-creer-un-cfa-en-france-en-2026.json";
import article3 from "../content/referentiel/comment-financer-une-formation-professionnelle-sans-reste-a-charge.json";
import article4 from "../content/referentiel/comment-creer-un-programme-de-formation-conforme-qualiopi.json";
import article5 from "../content/referentiel/comment-declarer-son-activite-de-formation-professionnelle.json";
import article6 from "../content/referentiel/comment-concevoir-un-bilan-de-competences-conforme.json";
import article7 from "../content/referentiel/comment-monter-un-dossier-de-certification-rncp.json";
import article8 from "../content/referentiel/comment-calculer-le-cout-pedagogique-dune-formation.json";
import article9 from "../content/referentiel/comment-gerer-les-alternants-droits-obligations-encadrement.json";
import article10 from "../content/referentiel/comment-evaluer-les-acquis-des-apprenants-de-facon-valide.json";

export interface ReferentielArticle extends ReferentielArticleMeta {
  content: string;
}

export const REFERENTIEL: ReferentielArticle[] = [
  article1, article2, article3, article4, article5,
  article6, article7, article8, article9, article10,
] as ReferentielArticle[];

export function getReferentielBySlug(slug: string): ReferentielArticle | undefined {
  return REFERENTIEL.find((a) => a.slug === slug);
}

export function getReferentielSlugs(): string[] {
  return REFERENTIEL.map((a) => a.slug);
}

export function getReferentielByCible(cible: string): ReferentielArticle[] {
  return REFERENTIEL.filter((a) => a.cible === cible);
}

export function getReferentielByThematique(thematique: string): ReferentielArticle[] {
  return REFERENTIEL.filter((a) => a.thematique === thematique);
}
