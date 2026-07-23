/* eslint-disable */
// Full job data with description content — used ONLY for job detail pages.
// For listings and cards, use @/data/careers-meta (much lighter, no description).

import type { JobMeta, JobType } from "./careers-meta";

export type { JobType } from "./careers-meta";
export { JOB_TYPE_LABELS } from "./careers-meta";

export interface Job extends JobMeta {
  descriptionFr: string;
  descriptionEn: string;
}

import job1 from "../content/careers/d2925d8647e7da6a.json";
import job2 from "../content/careers/d125f86fbab204cf.json";
import job3 from "../content/careers/7f071be05b114844.json";

export const CAREERS: Job[] = [
  job1, job2, job3,
] as Job[];

export function getJobBySlug(slug: string): Job | undefined {
  return CAREERS.find((j) => j.slug === slug);
}

export function getJobSlugs(): string[] {
  return CAREERS.map((j) => j.slug);
}
