import { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import SkillpathClient from "./SkillpathClient";
import { SITE } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Skillpath — Plateforme native IA" : "Skillpath — AI-Native Learning Platform",
    description: isFr
      ? "La plateforme native IA qui construit le parcours de formation exact dont chaque personne a besoin."
      : "The AI-native platform that builds the exact learning path each person needs.",
  };
}

export default async function SkillpathPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Skillpath",
        description: isFr
          ? "La plateforme native IA qui construit le parcours de formation exact dont chaque personne a besoin."
          : "The AI-native platform that builds the exact learning path each person needs.",
        url: `${SITE.baseUrl}/${lang}/skillpath`,
        brand: { "@id": `${SITE.baseUrl}/#organization` },
        inLanguage: isFr ? "fr-FR" : "en-US",
      }} />
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: "Skillpath" }
      ]} />
      <SkillpathClient />
    </>
  );
}
