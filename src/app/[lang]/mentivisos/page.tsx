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
    title: isFr ? "MentivisOS — Plateforme native IA" : "MentivisOS — AI-Native Learning Platform",
    description: isFr
      ? "La plateforme native IA qui construit le parcours de formation exact dont chaque personne a besoin."
      : "The AI-native platform that builds the exact learning path each person needs.",
    openGraph: {
      images: [
        {
          url: "https://www.mentivis.com/opengraph-image-mentivisOS.jpg",
          width: 1200,
          height: 630,
          alt: "MentivisOS",
        },
      ],
    },
    twitter: {
      images: ["https://www.mentivis.com/opengraph-image-mentivisOS.jpg"],
    },
  };
}

export default async function SkillpathPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "MentivisOS",
        description: isFr
          ? "La plateforme native IA qui construit le parcours de formation exact dont chaque personne a besoin."
          : "The AI-native platform that builds the exact learning path each person needs.",
        url: `${SITE.baseUrl}/${lang}/mentivisos`,
        brand: { "@id": `${SITE.baseUrl}/#organization` },
        inLanguage: isFr ? "fr-FR" : "en-US",
      }} />
      <BreadcrumbJsonLd items={[
        { name: isFr ? "Accueil" : "Home", url: `https://www.mentivis.com/${lang}/` },
        { name: "MentivisOS" }
      ]} />
      <SkillpathClient />
    </>
  );
}
