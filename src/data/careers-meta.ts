// Metadata-only careers array — used for listings and job cards.
// For full job content (descriptionFr/descriptionEn), use @/data/careers

import careersMetaJson from "./careers-meta.json";

export type JobType = "cdi" | "cdd" | "freelance" | "stage" | "alternance";

export interface JobMeta {
  slug: string;
  titleFr: string;
  titleEn: string;
  department: string;
  location: string;
  type: JobType;
  remote: boolean;
  date: string;
}

export const JOB_TYPE_LABELS: Record<JobType, { fr: string; en: string }> = {
  cdi: { fr: "CDI", en: "Full-time" },
  cdd: { fr: "CDD", en: "Fixed-term" },
  freelance: { fr: "Freelance", en: "Freelance" },
  stage: { fr: "Stage", en: "Internship" },
  alternance: { fr: "Alternance", en: "Work-study" },
};

export const CAREERS_META: JobMeta[] = careersMetaJson as JobMeta[];

export function getJobMetaBySlug(slug: string): JobMeta | undefined {
  return CAREERS_META.find((j) => j.slug === slug);
}

export function getJobMetaSlugs(): string[] {
  return CAREERS_META.map((j) => j.slug);
}

export function getJobDepartments(): string[] {
  const set = new Set<string>();
  CAREERS_META.forEach((j) => set.add(j.department));
  return Array.from(set).sort();
}
