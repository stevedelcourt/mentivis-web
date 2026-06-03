// Metadata-only referentiel array — used for listings and cards.
// For full article content, use @/data/referentiel

import referentielMetaJson from "./referentiel-meta.json";

export type ReferentielArticleMeta = {
  slug: string;
  title: string;
  cible: string;
  thematique: string;
  tags: string[];
  shortDescription: string;
  metaDescription: string;
  order: number;
};

export const CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
  "Apprentissage": { fr: "Apprentissage", en: "Apprenticeship" },
  "Bilan de compétences": { fr: "Bilan de compétences", en: "Skills assessment" },
  "Certification": { fr: "Certification", en: "Certification" },
  "Financement": { fr: "Financement", en: "Funding" },
  "Pédagogie": { fr: "Pédagogie", en: "Pedagogy" },
  "Qualiopi": { fr: "Qualiopi", en: "Qualiopi" },
  "Réglementation": { fr: "Réglementation", en: "Regulation" },
};

export const REFERENTIEL_META: ReferentielArticleMeta[] = referentielMetaJson as ReferentielArticleMeta[];

export function getReferentielMetaBySlug(slug: string): ReferentielArticleMeta | undefined {
  return REFERENTIEL_META.find((a) => a.slug === slug);
}

export function getReferentielMetaSlugs(): string[] {
  return REFERENTIEL_META.map((a) => a.slug);
}

export function getReferentielMetaByCible(cible: string): ReferentielArticleMeta[] {
  return REFERENTIEL_META.filter((a) => a.cible === cible);
}

export function getReferentielMetaByThematique(thematique: string): ReferentielArticleMeta[] {
  return REFERENTIEL_META.filter((a) => a.thematique === thematique);
}

export function getReferentielMetaByTag(tag: string): ReferentielArticleMeta[] {
  return REFERENTIEL_META.filter((a) => a.tags.includes(tag));
}

export function searchReferentielMeta(query: string): ReferentielArticleMeta[] {
  const q = query.toLowerCase();
  return REFERENTIEL_META.filter((a) =>
    a.title.toLowerCase().includes(q) ||
    a.shortDescription.toLowerCase().includes(q) ||
    a.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getCibles(): string[] {
  const set = new Set<string>();
  REFERENTIEL_META.forEach((a) => set.add(a.cible));
  return Array.from(set).sort();
}

export function getThematiques(): string[] {
  const set = new Set<string>();
  REFERENTIEL_META.forEach((a) => set.add(a.thematique));
  return Array.from(set).sort();
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  REFERENTIEL_META.forEach((a) => a.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
