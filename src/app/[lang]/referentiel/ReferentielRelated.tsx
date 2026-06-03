import Link from "next/link";
import { REFERENTIEL_META } from "@/data/referentiel-meta";

interface Props {
  currentSlug: string;
  cible: string;
  tags: string[];
  activeCible: string;
  activeThematique: string;
  activeTag: string;
  query: string;
  lang: string;
}

export default function ReferentielRelated({
  currentSlug,
  cible,
  tags,
  activeCible,
  activeThematique,
  activeTag,
  query,
  lang,
}: Props) {
  const buildHref = (slug: string) => {
    const params = new URLSearchParams();
    if (activeCible) params.set("cible", activeCible);
    if (activeThematique) params.set("thematique", activeThematique);
    if (activeTag) params.set("tag", activeTag);
    if (query) params.set("q", query);
    const qs = params.toString();
    return `/${lang}/referentiel/${slug}/${qs ? `?${qs}` : ""}`;
  };

  const related = REFERENTIEL_META
    .filter((a) => a.slug !== currentSlug && a.cible === cible && a.lang === lang)
    .map((a) => ({
      ...a,
      sharedTags: a.tags.filter((t) => tags.includes(t)).length,
    }))
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, 4)
    .filter((a) => a.sharedTags > 0);

  if (related.length === 0) return null;

  return (
    <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--m-line)" }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--m-ink)", marginBottom: 16, fontFamily: "var(--font-sans, 'IBM Plex Sans')" }}>
        Articles liés
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {related.map((a) => (
          <Link
            key={a.slug}
            href={buildHref(a.slug)}
            style={{
              fontSize: 14,
              lineHeight: 1.4,
              color: "var(--m-purple)",
              textDecoration: "none",
              fontFamily: "var(--font-sans, 'IBM Plex Sans')",
            }}
          >
            {a.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
