import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  REFERENTIEL,
  getReferentielBySlug,
} from "@/data/referentiel";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ReferentielDetailClient from "./ReferentielDetailClient";

export function generateStaticParams() {
  const locales = ["fr"];
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
  const { slug } = await params;
  const article = getReferentielBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | Le Référentiel — Mentivis`,
    description: article.metaDescription || article.shortDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription || article.shortDescription,
      type: "article",
      locale: "fr_FR",
      images: [{
        url: "https://mentivis.com/images/referentiel-og.jpg",
        width: 1200,
        height: 630,
        alt: "Le Référentiel — Mentivis",
      }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["https://mentivis.com/images/referentiel-og.jpg"],
    },
  };
}

export default async function ReferentielDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = getReferentielBySlug(slug);
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
      <Suspense fallback={<main style={{ padding: "80px 0", textAlign: "center" }}>Chargement...</main>}>
        <ReferentielDetailClient article={article} lang={lang} />
      </Suspense>
    </>
  );
}
