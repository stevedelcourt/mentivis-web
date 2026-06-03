import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  REFERENTIEL,
  getReferentielBySlug,
} from "@/data/referentiel";
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

  return {
    title: `${article.title} | ${lang === "fr" ? "Le Référentiel — Mentivis" : "The Reference — Mentivis"}`,
    description: article.metaDescription || article.shortDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription || article.shortDescription,
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
          { name: "Accueil", url: "https://mentivis.com/fr/" },
          { name: "Le Référentiel", url: "https://mentivis.com/fr/referentiel/" },
          { name: article.title },
        ]}
      />
      <ReferentielDetailClient article={article} lang={lang} />
    </>
  );
}
