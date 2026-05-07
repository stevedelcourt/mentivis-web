import { usePathname } from "next/navigation";

const PATH_TO_SUBJECT: Record<string, string> = {
  "/mentivisos": "MentivisOS",
  "/solutions": "Solutions",
  "/enterprise": "Enterprise",
  "/of": "OF",
  "/mentivissolutions": "MentivisSolutions",
  "/about": "About",
  "/insights": "Insights",
  "/guides": "Guides",
  "/score-formation": "ScoreFormation",
  "/careers": "Careers",
  "/videos": "Videos",
  "/usecases": "UseCases",
  "/contact": "Contact",
  "/meeting": "Meeting",
};

export function getContactSubject(pathname: string): string | null {
  // Remove language prefix
  const clean = pathname.replace(/^\/(fr|en)/, "");
  return PATH_TO_SUBJECT[clean] || null;
}

export function buildContactUrl(lang: string, pathname?: string): string {
  if (!pathname) return `/${lang}/contact`;
  const subject = getContactSubject(pathname);
  return subject ? `/${lang}/contact?subject=${encodeURIComponent(subject)}` : `/${lang}/contact`;
}

export function useContactUrl(lang: string): string {
  const pathname = usePathname();
  return buildContactUrl(lang, pathname);
}
