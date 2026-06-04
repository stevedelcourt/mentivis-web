import { notFound } from "next/navigation";
import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import {
  INSIGHTS,
  getInsightBySlug,
} from "@/data/insights";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { SITE } from "@/lib/config";
import InsightDetailClient from "./InsightDetailClient";

export function generateStaticParams() {
  const locales = ["fr", "en"];
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const slug of INSIGHTS.map((a) => a.slug)) {
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
  const { lang, slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) return {};

  const title = lang === "fr" ? article.titleFr : article.titleEn || article.titleFr;
  const desc = lang === "fr" ? article.excerptFr : article.excerptEn || article.excerptFr;

  return {
    title: `${title} — Mentivis`,
    description: desc,
    keywords: article.keywords,
    openGraph: {
      title,
      description: desc,
      images: article.heroImage,
      type: "article",
      locale: lang === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [article.heroImage],
    },
    ...localeAlternates(lang, `/insights/${slug}`),
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) notFound();

  const title = lang === "fr" ? article.titleFr : article.titleEn || article.titleFr;

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE.baseUrl}/${lang}/` },
        { name: "Insights", url: `${SITE.baseUrl}/${lang}/insights/` },
        { name: title }
      ]} />
      <InsightDetailClient article={article} />
    </>
  );
}
