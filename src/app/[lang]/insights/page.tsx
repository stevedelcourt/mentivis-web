import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import InsightsClient from "./InsightsClient";
import { localeAlternates } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Insights & Publications" : "Insights & Publications",
    description: isFr
      ? "Analyses, perspectives et ressources sur la formation professionnelle, la conformité et l'innovation pédagogique."
      : "Analysis, perspectives and resources on professional training, compliance and pedagogical innovation.",
    ...localeAlternates(lang, "/insights"),
  };
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <InsightsClient />;
}
