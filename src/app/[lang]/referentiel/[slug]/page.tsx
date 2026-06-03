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
      <Suspense fallback={<div style={{ padding: "80px 0", textAlign: "center" }}>Chargement...</div>}>
        <ReferentielDetailClient article={article} lang={lang} />
      </Suspense>
    </>
  );
}
