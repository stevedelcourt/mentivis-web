import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  REFERENTIEL,
  getReferentielBySlug,
} from "@/data/referentiel";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ReferentielDetailClient from "./ReferentielDetailClient";

export function generateStaticParams() {
  const locales = ["fr", "en"];
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const slug of REFERENTIEL.map((a) => a.slug)) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const article = getReferentielBySlug(slug, lang);
  if (!article) return {};

  // Title rule (SEO): keep Google-visible title under ~65 chars. `absolute`
  // bypasses the layout "%s | Mentivis" template so the suffix appears once.
  // Typographic apostrophe (') renders literally; straight quote (') would be
  // escaped to &#x27; by Next.js. H1 visible and data stay untouched.
  const h1 = article.title;
  const isFr = lang === "fr";
  const fullTitle = (
    isFr
      ? h1.length <= 30
        ? `${h1} — Le Référentiel Mentivis`
        : h1.length <= 45
          ? `${h1} — Mentivis`
          : h1
      : h1.length <= 30
        ? `${h1} — The Reference Mentivis`
        : h1.length <= 45
          ? `${h1} — Mentivis`
          : h1
  ).replace(/'/g, "’");

  // Meta description capped so the HTML-escaped output stays within 155 chars
  // (Google counts rendered chars; Next.js escapes ' " & < > into entities).
  // Data is untouched — only the rendered length is capped.
  const rawDesc = article.metaDescription || article.shortDescription;
  const EXPAND: Record<string, number> = { "&": 5, "'": 6, '"': 6, "<": 4, ">": 4 };
  const expandedLen = (s: string) => [...s].reduce((n, ch) => n + (EXPAND[ch] ?? 1), 0);
  let description = rawDesc;
  if (expandedLen(rawDesc) > 154) {
    let len = 0;
    let idx = 0;
    for (const ch of rawDesc) {
      const w = EXPAND[ch] ?? 1;
      if (len + w > 154) break;
      len += w;
      idx += ch.length;
    }
    description = rawDesc.slice(0, idx).trimEnd().replace(/[\s,;:]+$/, "") + "…";
  }

  return {
    title: { absolute: fullTitle },
    description,
    ...localeAlternates(lang, `/referentiel/${slug}`),
    openGraph: {
      title: article.title.replace(/'/g, "’"),
      description,
      url: `https://mentivis.com/${lang}/referentiel/${slug}/`,
      type: "article",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      images: [{
        url: "/images/referentiel-og.jpg",
        width: 1200,
        height: 630,
        alt: lang === "fr" ? "Le Référentiel — Mentivis" : "The Reference — Mentivis",
      }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/images/referentiel-og.jpg"],
    },
  };
}

export default async function ReferentielDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = getReferentielBySlug(slug, lang);
  if (!article) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: lang === "fr" ? "Accueil" : "Home", url: `https://mentivis.com/${lang}/` },
          { name: lang === "fr" ? "Le Référentiel" : "The Reference", url: `https://mentivis.com/${lang}/referentiel/` },
          { name: article.title },
        ]}
      />
      <ReferentielDetailClient article={article} lang={lang} />
    </>
  );
}
