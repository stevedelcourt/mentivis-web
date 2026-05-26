/* eslint-disable */
// Full article data with body content — used ONLY for article detail pages.
// For listings and cards, use @/data/insights-meta (much lighter, no body content).

import type { InsightArticleMeta, InsightCategory } from "./insights-meta";
import article1 from "../content/insights/mentivisos-fait-ses-debuts-a-sxsw-edu-2026.json";
import article2 from "../content/insights/conseil-boutique-vs-big-four.json";
import article3 from "../content/insights/crise-competences-metallurgie-france-solutions.json";
import article4 from "../content/insights/crise-enseignement-superieur-entreprises-formation.json";
import article5 from "../content/insights/formation-professionnelle-france-enjeux-2026.json";
import article6 from "../content/insights/french-training-system-foreign-companies-rncp-qualiopi.json";
import article7 from "../content/insights/la-franchise-francaise-a-la-croisee-des-chemins-quand-la-penurie-de-talents-revele-une-faille-systemique.json";
import article8 from "../content/insights/le-poste-est-mort-vive-la-competence.json";
import article9 from "../content/insights/leducation-as-a-service-eaas-pour-une-transformation-durable.json";
import article10 from "../content/insights/leducation-merite-mieux-que-les-effets-de-mode-technologiques.json";
import article11 from "../content/insights/les-entreprises-sont-les-prochaines-grandes-ecoles.json";
import article12 from "../content/insights/les-nouveaux-maitres-decole-les-patrons-francais-et-la-formation.json";
import article13 from "../content/insights/leurope-face-a-son-defi-educatif-le-grand-examen-de-davos.json";
import article14 from "../content/insights/lia-comme-nouvelle-alphabetisation-reprendre-la-bataille-de-la-lumiere.json";
import article15 from "../content/insights/lia-transforme-la-formation-professionnelle-en-france-une-revolution-a-5-milliards-deuros.json";
import article16 from "../content/insights/lorientation-post-bac-anatomie-dun-chaos-organise.json";
import article17 from "../content/insights/mentivis-solutions-conseil-ingenierie-transformation-digitale.json";
import article18 from "../content/insights/mentivos-os-formation-native-ia.json";
import article19 from "../content/insights/morin-contre-les-machines.json";
import article20 from "../content/insights/rearmement-france-penurie-competences-industrielles-defense.json";
import article21 from "../content/insights/senegal-petrole-intelligence-artificielle-formation.json";
import article22 from "../content/insights/transformation-educative-solutions-cles-en-main.json";

// Re-export types from meta so detail pages can import from either module
export type { InsightCategory } from "./insights-meta";
export { CATEGORY_LABELS, INSIGHT_CATEGORIES } from "./insights-meta";

export interface InsightArticle extends InsightArticleMeta {
  bodyFr: string;  // full HTML body
  bodyEn: string;
}

export const INSIGHTS: InsightArticle[] = [
  article1, article2, article3, article4, article5,
  article6, article7, article8, article9, article10,
  article11, article12, article13, article14, article15,
  article16, article17, article18, article19, article20,
  article21, article22
] as InsightArticle[];

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return INSIGHTS.find((a) => a.slug === slug);
}

export function getInsightSlugs(): string[] {
  return INSIGHTS.map((a) => a.slug);
}

export function getInsightsByCategory(category: InsightCategory): InsightArticle[] {
  return INSIGHTS.filter((a) => a.category === category);
}

export function getInsightCategories(): InsightCategory[] {
  const set = new Set<InsightCategory>();
  INSIGHTS.forEach((a) => set.add(a.category));
  return Array.from(set);
}
