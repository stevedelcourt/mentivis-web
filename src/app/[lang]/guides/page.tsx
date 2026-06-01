import { Metadata } from "next";
import { localeAlternates } from "@/lib/metadata";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import GuidesClient from "./GuidesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Guides pratiques" : "Reference Guides",
    description: isFr
      ? "Six guides pratiques pour maîtriser les mécanismes de financement, la conformité et la structuration de vos dispositifs de formation."
      : "Six practical guides to master funding mechanisms, compliance, and the structuring of your training programs.",
    ...localeAlternates(lang, "/guides"),
  };
}

export default async function GuidesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://mentivis.com/${lang}/` },
        { name: isFr ? "Guides pratiques" : "Reference guides" }
      ]} />
      <GuidesClient />
    </>
  );
}
